use crate::constants::ETVR_BACKEND_PORT;
use command_group::CommandGroup;
use std::process::Command;
use std::sync::mpsc::Receiver;
use std::thread;
use tauri::api::process::Command as TauriCommand;
use tauri::{AppHandle, Manager, Runtime};

pub fn initialize_etvr_backend<R: Runtime>(app: AppHandle<R>, receiver: Receiver<()>) {
  let sidecar_handle_result = TauriCommand::new_sidecar("ETVR");
  match sidecar_handle_result {
    Ok(handle) => {
      spawn_backend(handle, receiver);
    }
    Err(spawn_error) => {
      if let Some(window) = app.get_window("main") {
        if let Err(error) = window.emit("backend-init-fail", spawn_error.to_string()) {
          log::error!("failed to emit error event: {}", error);
        }
      }
      log::error!("failed to start ETVR backend");
    }
  }
}

fn spawn_backend(sidecar_handle: TauriCommand, receiver: Receiver<()>) {
  let mut group = Command::from(sidecar_handle)
    .args(["--port", ETVR_BACKEND_PORT])
    .group_spawn()
    .expect("Failed to spawn ETVR backend");

  log::info!("ETVR backend spawned");

  // TODO this is fine for a happy-path scenario, we need a way to
  // we'll also need to handle situations where the user quits forcefully
  // or the app gets somehow killed
  // something like a daemon process holding a socket to ETVR and a PID of the backend
  // that once the socket gets closed - kills the backend and terminates, could work

  thread::spawn(move || loop {
    let signal = receiver.recv();
    match signal {
      Ok(_) => {
        log::info!("ETVR backend terminated.");
        group.kill().expect("failed to kill ETVR backend");
      }
      Err(e) => {
        log::error!("How is this possible? This should not error out: {:?}", e);
      }
    }
  });
}
