use std::sync::Mutex;
use tauri::{
  plugin::{Builder, TauriPlugin},
  Manager, Runtime,
};

use api::*;

use crate::state::EspState;

mod api;
mod command;
mod manifest;
mod state;

pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("esp")
    .invoke_handler(tauri::generate_handler![
      available_ports,
      test_connection,
      flash,
      stream_logs,
      cancel_stream_logs,
      send_commands
    ])
    .setup(move |app| {
      app.manage(Mutex::new(EspState {
        log_stream_cancel: None,
      }));
      Ok(())
    })
    .build()
}
