use std::sync::Mutex;
use tauri::{
  plugin::{Builder, TauriPlugin},
  Manager, Runtime,
};

pub use api::*;

use crate::state::EspState;

pub mod api;
mod state;

pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("esp")
    .invoke_handler(tauri::generate_handler![
      available_ports,
      test_connection,
      flash,
      stream_logs,
      cancel_stream_logs,
      send_commands,
      get_possible_networks,
      get_wifi_connection_status
    ])
    .setup(move |app, _api| {
      app.manage(Mutex::new(EspState {
        log_stream_cancel: None,
      }));
      Ok(())
    })
    .build()
}
