// https://v1.tauri.app/v1/guides/building/sidecar/

use crate::tauri::api::process::Command;
use tauri::{api::process::CommandEvent, Window};

pub fn initialize_etvr_backend(window: Window) {
  let (mut rx, mut child) = Command::new_sidecar("backend")
    .expect("failed to create `my-sidecar` binary command")
    .spawn()
    .expect("Failed to spawn sidecar");

  tauri::async_runtime::spawn(async move {
    // read events such as stdout
    while let Some(event) = rx.recv().await {
      if let CommandEvent::Stdout(line) = event {
        window
          .emit("message", Some(format!("'{}'", line)))
          .expect("failed to emit event");

        child.write("message from Rust\n".as_bytes()).unwrap();
      }
    }
  });
}
