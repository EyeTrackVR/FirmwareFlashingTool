#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use log::error;
use serde::Serialize;
use std::time::Duration;
use tauri::Emitter;
use tauri::PhysicalSize;
use tokio::time::sleep;

use tauri::{self, Manager, RunEvent, WindowEvent};

// use custom modules
mod modules;
use modules::tauri_commands;

#[derive(Clone, Serialize)]
struct SingleInstancePayload {
  args: Vec<String>,
  cwd: String,
}

pub fn run() {
  let app = tauri::Builder::default();

  // Note: This is a workaround for a bug in tauri that causes the window to not resize properly inducing a noticeable lag
  // ! https://github.com/tauri-apps/tauri/issues/6322#issuecomment-1448141495
  let app = app.on_window_event(|_, event| {
    if let WindowEvent::Resized(_) = event {
      std::thread::sleep(std::time::Duration::from_nanos(1));
    }
  });

  let app = app
    .invoke_handler(tauri::generate_handler![
      tauri_commands::unzip_archive,
      tauri_commands::handle_save_window_state,
      tauri_commands::handle_load_window_state,
      tauri_plugin_esp::available_ports,
      tauri_plugin_esp::test_connection,
      tauri_plugin_esp::flash,
      tauri_plugin_esp::stream_logs,
      tauri_plugin_esp::cancel_stream_logs,
      tauri_plugin_esp::send_commands,
      tauri_plugin_esp::get_possible_networks,
      tauri_plugin_esp::get_wifi_connection_status
    ])
    // Allow only one instance and propagate args and cwd to existing instance
    .plugin(tauri_plugin_single_instance::init(|app, args, cwd| {
      app
        .emit("new-instance", SingleInstancePayload { args, cwd })
        .unwrap_or_else(|e| {
          eprintln!("Failed to emit new-instance event: {}", e);
        });
    }))
    // Persistent storage with file system
    .plugin(tauri_plugin_store::Builder::new().build())
    .plugin(tauri_plugin_notification::init())
    .plugin(tauri_plugin_upload::init())
    // LocalHost REST Client (in v2, use http plugin instead of request_client)
    .plugin(tauri_plugin_http::init())
    // Save window position and size between sessions
    .plugin(tauri_plugin_window_state::Builder::new().build())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_esp::init())
    // Opener plugin for opening files/URLs with default system application
    .plugin(tauri_plugin_opener::init())
    .setup(move |app| {
      // TODO: Implement the Updater
      //#[cfg(feature = "updater")]
      //tauri::updater::builder(app.handle()).should_install(|_current, _latest| true);

      // Trigger backend ready event
      // let _ = app.trigger("set-backend-ready", None);

      let app_handle = app.handle();

      // Setup window configurations
      app.webview_windows().iter().for_each(|(_, window)| {
        let window_clone = window.clone();

        tauri::async_runtime::spawn(async move {
          sleep(Duration::from_secs(3)).await;
          if !window_clone.is_visible().unwrap_or(true) {
            error!("Window did not emit `app_ready` event in time, showing it now.");
            let _ = window_clone.show();
          }
        });

        let _ = window.set_decorations(false);
        let _ = window.set_min_size(Some(PhysicalSize {
          width: 750,
          height: 750,
        }));
      });

      // Configure IPC for custom protocol
      // app.ipc_scope().configure_remote_access(
      //   RemoteDomainAccessScope::new("localhost")
      //     .allow_on_scheme("eyetrackvr")
      //     .add_window("main"),
      // );

      // Log to file, stdout and webview console support

      let log_level = tauri_commands::handle_debug(app_handle.clone()).unwrap_or_else(|e| {
        eprintln!("Failed to get debug level: {}", e);
        log::LevelFilter::Off
      });

      app_handle
        .plugin(
          tauri_plugin_log::Builder::new()
            .level(log_level) // <-- use dynamic level instead of hardcoded Off
            .build(),
        )
        .expect("Failed to initialize logger");

      Ok(())
    })
    // .menu(menu::create_system_tray(app.invoke_handler(invoke_handler)))
    // .on_menu_event(menu::handle_menu_event)
    .build(tauri::generate_context!())
    .expect("error while building tauri application");

  app.run(move |_app, event| match event {
    RunEvent::Ready => {}
    RunEvent::ExitRequested { .. } => {}
    _ => {}
  });
}
