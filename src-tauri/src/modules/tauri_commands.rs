use log::debug;
// use log::{error, info};
use serde_json::{self, Value};
// use tauri::{self, Manager};
// use tauri_plugin_store::with_store;
use tauri_plugin_window_state::AppHandleExt;
use tauri_plugin_window_state::{StateFlags, WindowExt};

/// TODO: refactor to use tauri::fs and tauri::path
#[tauri::command]
pub fn unzip_archive(archive_path: String, target_dir: String) -> Result<String, String> {
  let target_dir = std::path::PathBuf::from(&target_dir);
  let archive = std::fs::read(&archive_path).map_err(|e| e.to_string())?;

  let mut zip = zip::ZipArchive::new(std::io::Cursor::new(archive)).map_err(|e| e.to_string())?;

  zip.extract(&target_dir).map_err(|e| e.to_string())?;

  Ok(archive_path)
}

#[tauri::command]
pub async fn handle_save_window_state<R: tauri::Runtime>(
  app: tauri::AppHandle<R>,
) -> Result<(), String> {
  // disabled on macos, because it's causing infinite loading with a constant white screen
  // todo fixme
  #[cfg(not(target_os = "macos"))]
  app
    .save_window_state(StateFlags::all())
    .expect("[Window State]: Failed to save window state");

  Ok(())
}

#[tauri::command]
pub async fn handle_load_window_state<R: tauri::Runtime>(
  window: tauri::Window<R>,
) -> Result<(), String> {
  // disabled on macos, because it's causing infinite loading with a constant white screen
  // todo fixme
  #[cfg(not(target_os = "macos"))]
  window
    .restore_state(StateFlags::all())
    .expect("[Window State]: Failed to restore window state");

  Ok(())
}

pub fn handle_debug<R: tauri::Runtime>(_: tauri::AppHandle<R>) -> Result<log::LevelFilter, String> {
  // read the Store file
  // let stores = app.state::<tauri_plugin_store::StoreCollection<R>>();
  // let path = std::path::PathBuf::from(".app-settings.bin");
  // // match the store value to a LogFilter
  // let mut debug_state: String = String::new();
  // with_store(app.clone(), stores, path, |store| {
  //   let settings = store.get("settings");
  //   debug!("Settings: {:?}", settings);
  //   if let Some(json) = settings {
  //     let _serde_json = serde_json::from_value::<serde_json::Value>(json.clone());
  //     debug!("Serde JSON: {:?}", _serde_json);
  //     let serde_json_result = match _serde_json {
  //       Ok(serde_json) => serde_json,
  //       Err(err) => {
  //         error!("Error configuring JSON config file: {}", err);
  //         return Err(tauri_plugin_store::Error::Json(err));
  //       }
  //     };

  //     let temp = "off";
  //     debug!("Debug: {:?}", temp);

  //     let debug_state: String = serde_json::from_value(Value::String(temp.to_string())).unwrap();
  //   } else {
  //     debug_state = serde_json::json!({}).to_string();
  //   }
  //   info!("Debug state: {}", debug_state);
  //   Ok(())
  // })
  // .expect("Failed to get store");

  let temp = "off";
  debug!("Debug: {:?}", temp);

  let debug_state: String = serde_json::from_value(Value::String(temp.to_string())).unwrap();
  // set the log level
  let log_level = match debug_state.as_str() {
    "off" => log::LevelFilter::Off,
    "error" => log::LevelFilter::Error,
    "warn" => log::LevelFilter::Warn,
    "info" => log::LevelFilter::Info,
    "debug" => log::LevelFilter::Debug,
    "trace" => log::LevelFilter::Trace,
    _ => log::LevelFilter::Info,
  };
  // return the result
  Ok(log_level)
}
