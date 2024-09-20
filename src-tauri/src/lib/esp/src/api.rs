use std::borrow::Cow;
use std::io::{Read, Write};
use std::sync::mpsc::TryRecvError;
use std::sync::{mpsc, Mutex, PoisonError};
use std::thread::sleep;
use std::time::Duration;
use std::{fs, thread};

use espflash::connection::reset::{ResetAfterOperation, ResetBeforeOperation};
use espflash::elf::RomSegment;
use espflash::flasher::{Flasher, ProgressCallbacks};
use espflash::targets::Chip;
use log::error;
use serde::{Deserialize, Serialize, Serializer};
use serialport::{FlowControl, SerialPort, SerialPortInfo, SerialPortType};
use tauri::{command, AppHandle, Runtime, State, Window};
use thiserror::Error;

use crate::manifest::{load_manifest, ManifestError};
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
  #[error(transparent)]
  ManifestError {
    #[from]
    source: ManifestError,
  },
  #[error("Unknown port: {port_name}")]
  UnknownPort { port_name: String },
  #[error("Unknown chip: {chip}")]
  UnknownChip { chip: Chip },
  #[error("Unsupported chip family: {chip_family}")]
  UnsupportedChipFamily { chip_family: String },
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
  let manifest = load_manifest(&data_dir.join("manifest.json"))?;
  let chip = flasher.chip();
  let chip_family = match chip {
    Chip::Esp32 => "ESP32",
    Chip::Esp32c2 => "ESP32-C2",
    Chip::Esp32c3 => "ESP32-C3",
    Chip::Esp32c6 => "ESP32-C6",
    Chip::Esp32h2 => "ESP32-H2",
    Chip::Esp32p4 => "ESP32-P4",
    Chip::Esp32s2 => "ESP32-S2",
    Chip::Esp32s3 => "ESP32-S3",
    _ => return Err(EspError::UnknownChip { chip }),
  };

  let build = match manifest
    .builds
    .into_iter()
    .find(|build| build.chip_family == chip_family)
  {
    Some(build) => build,
    None => {
      return Err(EspError::UnsupportedChipFamily {
        chip_family: chip_family.to_string(),
      })
    }
  };

  let mut rom_segments = Vec::with_capacity(build.parts.len());

  for part in build.parts {
    rom_segments.push(RomSegment {
      addr: part.offset,
      data: Cow::from(fs::read(data_dir.join(part.path))?),
    })
  }

  flasher.write_bins_to_flash(
    &rom_segments,
    Some(&mut EspflashProgress {
      event_name: format!("plugin-esp-flash-{}", port_name),
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

  Ok(())
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "command", content = "data", rename_all = "snake_case")]
pub enum Command {
  SetWifi { ssid: String, password: String },
  SetMdns { hostname: String },
}

#[derive(Debug, Serialize)]
struct CommandsOperation {
  pub commands: Vec<Command>,
}

#[command]
pub fn send_commands(port_name: String, commands: Vec<Command>) -> EspResult<()> {
  let mut serial_port = serialport::new(port_name, 115_200)
    .flow_control(FlowControl::None)
    .open_native()?;

  let operation = CommandsOperation { commands };
  serial_port.write_all(serde_json::to_string(&operation)?.as_bytes())?;
  log::debug!("{:?}", serde_json::to_string(&operation));

  Ok(())
}
