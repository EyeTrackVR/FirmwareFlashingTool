use crate::state::AppState;
use tauri::Manager;

#[tauri::command(async)]
pub async fn shutdown_etvr_backend(app_handle: tauri::AppHandle) -> Result<(), String> {
  // requesting shutdown will immediately kill the backend so we can safely ignore the result here
  // but for some reason the process will still be somewhat alive, a zombie
  // we gotta kill it.
  let _ = reqwest::get("http://127.0.0.1:8000/etvr/shutdown").await;
  println!("ETVR Backend shutdown successfully");

  let app_state = app_handle.state::<AppState>();
  app_state
    .inner()
    .sidecar_sender
    .send(-1)
    .expect("Failed to send shutdown message");

  app_handle.exit(0);
  Ok(())
}
