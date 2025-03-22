use command_group::CommandGroup;
use std::process::Command;
use std::sync::mpsc::{Receiver, RecvError};
use std::thread;
use tauri::api::process::Command as TauriCommand;

pub fn initialize_etvr_backend(receiver: Receiver<i32>) {
  let sidecar_handle = TauriCommand::new_sidecar("ETVR").expect("failed to start ETVR backend");
  let mut group = Command::from(sidecar_handle)
    .group_spawn()
    .expect("Failed to spawn ETVR backend");

  println!("ETVR backend spawned");
  thread::spawn(move || loop {
    let signal = receiver.recv();
    match signal {
      Ok(message) => {
        if message == -1 {
          println!("ETVR backend terminated.");
          group.kill().expect("failed to kill ETVR backend");
        }
      }
      Err(e) => {
        println!("How is this possible? This should not error out: {:?}", e);
      }
    }
  });
}
