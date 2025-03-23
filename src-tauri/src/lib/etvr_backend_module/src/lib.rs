mod client;
mod commands;
mod constants;
mod state;

use std::sync::mpsc::channel;
use tauri::{plugin::{Builder, TauriPlugin}, AppHandle, Manager, Runtime};

use client::initialize_etvr_backend;
use commands::shutdown_etvr_backend;
use state::AppState;

pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("etvr_backend")
    .invoke_handler(tauri::generate_handler![shutdown_etvr_backend,])
    .setup(move |app: &AppHandle<R>| {
      let (tx, rx) = channel::<()>();

      app.manage(AppState { sidecar_sender: tx });
      initialize_etvr_backend(app.clone(), rx);
      Ok(())
    })
    .build()
}
