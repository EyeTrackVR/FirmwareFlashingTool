use std::borrow::Cow;
use std::io::{Read, Write};
use std::sync::mpsc::TryRecvError;
use std::sync::{mpsc, Arc, Mutex};
use std::thread::sleep;
use std::time::Duration;
use std::{fs, thread};

use espflash::connection::reset::{ResetAfterOperation, ResetBeforeOperation};
use espflash::elf::RomSegment;
use espflash::flasher::{Flasher, ProgressCallbacks};
use log::error;
use serde::{Deserialize, Serialize, Serializer};
use serialport::{FlowControl, SerialPort, SerialPortInfo, SerialPortType};
use tauri::{command, AppHandle, Runtime, State, Window};
use thiserror::Error;

use crate::state::EspState;

#[derive(Error, Debug)]
pub enum EspError {
  #[error(transparent)]
  SerialPortError {
    #[from]
    source: serialport::Error,
  },
  #[error(transparent)]
  EspFlashError {
    #[from]
    source: espflash::error::Error,
  },
  #[error(transparent)]
  IoError {
    #[from]
    source: std::io::Error,
  },
  #[error(transparent)]
  SerdeJsonError {
    #[from]
    source: serde_json::Error,
  },
  #[error("Unknown port: {port_name}")]
  UnknownPort { port_name: String },
}

impl Serialize for EspError {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}

type EspResult<T> = Result<T, EspError>;

#[command]
pub fn available_ports() -> EspResult<Vec<SerialPortInfo>> {
  let ports = serialport::available_ports()?;
  let ports = ports
    .into_iter()
    .filter(|port_info| matches!(&port_info.port_type, SerialPortType::UsbPort(..)))
    .collect::<Vec<_>>();
  Ok(ports)
}

fn connect(port_name: &str) -> EspResult<Flasher> {
  let ports = available_ports()?;
  let port_info = ports
    .iter()
    .find(|port_info| port_info.port_name.eq_ignore_ascii_case(&port_name))
    .ok_or_else(|| EspError::UnknownPort {
      port_name: port_name.to_string(),
    })?
    .to_owned();

  let port_info = match port_info.port_type {
    SerialPortType::UsbPort(info) => info,
    _ => unreachable!(),
  };

  let serial_port = serialport::new(port_name, 115_200)
    .flow_control(FlowControl::None)
    .open_native()?;

  Ok(Flasher::connect(
    serial_port,
    port_info,
    None,
    true,
    true,
    true,
    None,
    ResetAfterOperation::HardReset,
    ResetBeforeOperation::DefaultReset,
  )?)
}

#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type")]
enum EspflashStatus {
  Init { address: u32, total: usize },
  Update { current: usize },
  Finish,
}

struct EspflashProgress<R: Runtime> {
  event_name: String,
  window: Window<R>,
}

fn emit_espflash_status<R: Runtime>(window: &Window<R>, event_name: &str, status: EspflashStatus) {
  if let Err(error) = window.emit(&event_name, status) {
    println!("Failed to send flash status: {}", error)
  }
}

impl<R: Runtime> ProgressCallbacks for EspflashProgress<R> {
  fn init(&mut self, address: u32, total: usize) {
    emit_espflash_status(
      &self.window,
      &self.event_name,
      EspflashStatus::Init { address, total },
    );
  }

  fn update(&mut self, current: usize) {
    emit_espflash_status(
      &self.window,
      &self.event_name,
      EspflashStatus::Update { current },
    );
  }

  fn finish(&mut self) {
    emit_espflash_status(&self.window, &self.event_name, EspflashStatus::Finish);
  }
}

#[command]
pub fn test_connection(port_name: String) -> EspResult<()> {
  connect(&port_name)?;
  Ok(())
}

#[command(async)]
pub fn flash<R: Runtime>(app: AppHandle<R>, window: Window<R>, port_name: String) -> EspResult<()> {
  let mut flasher = connect(&port_name)?;

  // It's safe to unwrap here, as it was already successfully used at this point
  let data_dir = app.path_resolver().app_data_dir().unwrap();
  let bin_data = fs::read(data_dir.join("build/merged-binary.bin"))?;
  let firmware_rom_data = vec![RomSegment {
    addr: 0,
    data: Cow::from(bin_data),
  }];

  let hexed_port_name: String = port_name
    .as_bytes()
    .iter()
    .map(|byte| format!("{:02x}", byte))
    .collect();

  flasher.write_bins_to_flash(
    &firmware_rom_data,
    Some(&mut EspflashProgress {
      event_name: format!("plugin-esp-flash-{}", hexed_port_name),
      window,
    }),
  )?;

  flasher.connection().reset()?;

  Ok(())
}

#[derive(Clone, Serialize)]
enum LogEvent {
  Data(String),
  Error(String),
}

#[command]
pub fn stream_logs<R: Runtime>(
  window: Window<R>,
  state: State<'_, Mutex<EspState>>,
  port_name: String,
) -> EspResult<()> {
  let mut serial_port = serialport::new(port_name, 115_200)
    .flow_control(FlowControl::None)
    .open_native()?;

  serial_port.write_data_terminal_ready(false)?;
  serial_port.write_request_to_send(true)?;
  sleep(Duration::from_millis(250));

  serial_port.write_data_terminal_ready(false)?;
  serial_port.write_request_to_send(false)?;
  sleep(Duration::from_millis(250));

  let (stream_cancel_sender, stream_cancel_receiver) = mpsc::channel();
  state.lock().unwrap().log_stream_cancel = Some(stream_cancel_sender);

  thread::spawn(move || loop {
    match stream_cancel_receiver.try_recv() {
      Ok(()) => break,
      Err(TryRecvError::Disconnected) => break,
      _ => {}
    }

    let mut buffer = [0u8; 1024];
    let length = match serial_port.read(&mut buffer) {
      Ok(length) => length,
      Err(error) if std::io::ErrorKind::TimedOut == error.kind() => {
        sleep(Duration::from_millis(250));
        continue;
      }
      Err(error) => {
        let _ = window.emit("plugin-esp-logs", LogEvent::Error(error.to_string()));
        break;
      }
    };

    let data = String::from_utf8_lossy(&buffer[0..length]);
    let _ = window.emit("plugin-esp-logs", LogEvent::Data(data.to_string()));
  });

  Ok(())
}

#[command]
pub fn cancel_stream_logs(state: State<'_, Mutex<EspState>>) -> EspResult<()> {
  let mut state = state.lock().unwrap();

  if let Some(sender) = state.log_stream_cancel.clone() {
    let _ = sender.send(());
    state.log_stream_cancel = None;
  }

  sleep(Duration::from_millis(250));

  Ok(())
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "command", content = "data", rename_all = "snake_case")]
pub enum Command {
  SetWifi {
    ssid: String,
    password: String,
    name: String,
    channel: u8,
    power: u8,
    bssid: String,
  },
  SetMdns {
    hostname: String,
  },
  SwitchMode {
    mode: String,
  },
  ConnectWifi,
  GetMdnsName,
  GetDeviceMode,
  ScanNetworks,
  GetWifiStatus,
  RestartDevice,
  Pause {
    pause: bool,
  },
}

#[derive(Debug, Serialize)]
struct CommandsOperation {
  pub commands: Vec<Command>,
}

#[tauri::command]
pub async fn send_commands(port_name: String, commands: Vec<Command>) -> Result<String, String> {
  tokio::task::spawn_blocking(move || {
    let mut serial_port = serialport::new(&port_name, 115_200)
      .flow_control(FlowControl::None)
      .timeout(Duration::from_millis(100))
      .open_native()
      .map_err(|e| e.to_string())?;

    let operation = CommandsOperation { commands };
    let payload = serde_json::to_string(&operation).map_err(|e| e.to_string())? + "\n";

    serial_port
      .write_all(payload.as_bytes())
      .map_err(|e| e.to_string())?;
    serial_port.flush().map_err(|e| e.to_string())?;
    log::debug!("{:?}", serde_json::to_string(&operation));

    thread::sleep(Duration::from_millis(500));

    for _ in 0..10 {
      match serial_port.bytes_to_read() {
        Ok(bytes_available) if bytes_available > 0 => {
          let mut buffer = vec![0u8; bytes_available as usize];
          serial_port
            .read_exact(&mut buffer)
            .map_err(|e| e.to_string())?;
          let response = String::from_utf8_lossy(&buffer).trim().to_string();
          return Ok(response);
        }
        Ok(_) => {
          thread::sleep(Duration::from_millis(100));
        }
        Err(e) => return Err(e.to_string()),
      }
    }

    Err("No response received after waiting".to_string())
  })
  .await
  .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn get_possible_networks(
  port_name: String,
  commands: Vec<Command>,
) -> Result<String, String> {
  let operation = CommandsOperation { commands };
  let payload = serde_json::to_string(&operation).map_err(|e| e.to_string())? + "\n";

  tauri::async_runtime::spawn_blocking(move || {
    let mut serial_port = serialport::new(port_name, 115_200)
      .flow_control(FlowControl::None)
      .timeout(Duration::from_millis(100))
      .open_native()
      .map_err(|e| e.to_string())?;

    serial_port
      .write_all(payload.as_bytes())
      .map_err(|e| e.to_string())?;
    serial_port.flush().map_err(|e| e.to_string())?;

    log::debug!("{:?}", serde_json::to_string(&operation));

    let start_time = std::time::Instant::now();
    let mut buffer = Vec::new();

    while start_time.elapsed() < Duration::from_secs(30) {
      match serial_port.bytes_to_read() {
        Ok(bytes_available) if bytes_available > 0 => {
          let mut chunk = vec![0u8; bytes_available as usize];
          if serial_port.read_exact(&mut chunk).is_ok() {
            buffer.extend_from_slice(&chunk);

            let response = String::from_utf8_lossy(&buffer).trim().to_string();
            if response.contains("results") || response.contains("Networks scanned") {
              return Ok(response);
            }
          }
        }
        _ => {
          std::thread::sleep(Duration::from_millis(250));
        }
      }
    }

    Err("Operation timed out".to_string())
  })
  .await
  .map_err(|e| e.to_string())?
}

#[command]
pub async fn get_wifi_connection_status(
  port_name: String,
  commands: Vec<Command>,
) -> Result<String, String> {
  let operation = CommandsOperation { commands };
  let payload = serde_json::to_string(&operation).map_err(|e| e.to_string())? + "\n";
  tauri::async_runtime::spawn_blocking(move || {
    let mut serial_port = serialport::new(port_name, 115_200)
      .flow_control(FlowControl::None)
      .timeout(Duration::from_millis(100))
      .open_native()
      .map_err(|e| e.to_string())?;

    serial_port
      .write_all(payload.as_bytes())
      .map_err(|e| e.to_string())?;
    serial_port.flush().map_err(|e| e.to_string())?;

    log::debug!("{:?}", serde_json::to_string(&operation));

    let start_time = std::time::Instant::now();
    let mut buffer = Vec::new();

    while start_time.elapsed() < Duration::from_secs(30) {
      match serial_port.bytes_to_read() {
        Ok(bytes_available) if bytes_available > 0 => {
          let mut chunk = vec![0u8; bytes_available as usize];
          if serial_port.read_exact(&mut chunk).is_ok() {
            buffer.extend_from_slice(&chunk);

            let response = String::from_utf8_lossy(&buffer).trim().to_string();
            if response.contains("results") {
              return Ok(response);
            }
          }
        }
        _ => {
          std::thread::sleep(Duration::from_millis(250));
        }
      }
    }

    Err("Operation timed out".to_string())
  })
  .await
  .map_err(|e| e.to_string())?
}
