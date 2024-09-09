use std::sync::Mutex;
use tauri::{
    Manager,
    plugin::{Builder, TauriPlugin}, Runtime,
};

use api::*;

use crate::state::EspState;

mod api;
mod state;
mod manifest;
mod command;

pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("esp")
    .invoke_handler(tauri::generate_handler![
      available_ports,
      test_connection,
      flash,
        stream_logs,
        cancel_stream_logs,
    ])
    .setup(move |app| {
      app.manage(Mutex::new(EspState {
        log_stream_cancel: None
      }));
      Ok(())
    })
    .build()
}
