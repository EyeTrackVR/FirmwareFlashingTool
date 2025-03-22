use crate::state::AppState;
use std::sync::mpsc::SendError;
use tauri::Manager;

#[tauri::command(async)]
pub async fn shutdown_etvr_backend(app_handle: tauri::AppHandle) -> Result<(), String> {
  // requesting shutdown will immediately kill the backend so we can safely ignore the result here
  // but for some reason the process will still be somewhat alive, a zombie
  // we gotta kill it.

  // TODO change the port, random it get something bigger, 8000 is not good enough
  let _ = reqwest::get("http://127.0.0.1:8000/etvr/shutdown").await;
  let app_state = app_handle.state::<AppState>();

  log::info!("ETVR Backend shutdown successfully");
  match app_state.inner().sidecar_sender.send(()) {
    Ok(_) => {
      log::info!("ETVR Backend process killed successfully");
    }
    Err(error) => {
      log::error!("Failed to kill ETVR Backend process with error: {}", error);
    }
  }

  app_handle.exit(0);
  Ok(())
}
