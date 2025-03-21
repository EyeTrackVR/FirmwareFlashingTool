use tauri::api::process::Command;

pub fn initialize_etvr_backend() {
  let _ = Command::new_sidecar("ETVR")
    .expect("failed to start ETVR backend")
    .spawn()
    .expect("Falied to spawn ETVR backend");

  println!("ETVR backend spawned");
}
