use tauri::{
  plugin::{Builder, TauriPlugin},
  AppHandle, Manager, Runtime,
};

use reqwest::Client;
use std::sync::{Arc, Mutex};

use etvr_utils::{errors::ETVResult, prelude::*};

const PLUGIN_NAME: &str = "tauri-plugin-request-client";

#[derive(Debug)]
pub struct RESTClient {
  pub http_client: Arc<tauri::async_runtime::Mutex<Client>>,
  pub base_url: Arc<Mutex<String>>,
  pub method: Arc<Mutex<String>>,
}

/// A function to create a new RESTClient instance
/// ## Arguments
/// - `base_url` The base url of the api to query
impl RESTClient {
  pub fn new(base_url: Option<String>, method: Option<String>) -> Self {
    Self {
      http_client: Arc::new(tauri::async_runtime::Mutex::new(Client::new())),
      base_url: Arc::new(Mutex::new(base_url.unwrap_or_default())),
      method: Arc::new(Mutex::new(method.unwrap_or_default())),
    }
  }
}

#[derive(Debug)]
pub struct APIPlugin<R: Runtime> {
  pub app_handle: AppHandle<R>,
  pub rest_client: RESTClient,
}

impl<R: Runtime> APIPlugin<R> {
  fn new(app_handle: AppHandle<R>) -> Self {
    let rest_client = RESTClient::new(None, None);
    Self {
      app_handle,
      rest_client,
    }
  }

  fn set_base_url(&self, base_url: String) -> &Self {
    *self.rest_client.base_url.lock().unwrap() = base_url;
    self
  }

  fn set_method(&self, method: String) -> &Self {
    *self.rest_client.method.lock().unwrap() = method;
    self
  }

  fn get_base_url(&self) -> String {
    self.rest_client.base_url.lock().unwrap().clone()
  }

  fn get_method(&self) -> String {
    self.rest_client.method.lock().unwrap().clone()
  }

  async fn request(&self) -> ETVResult<String> {
    info!("Making REST request");

    let base_url = self.get_base_url();

    let response: String;

    let method = self.get_method();

    let method = method.as_str();

    let response = match method {
      "GET" => {
        response = self
          .rest_client
          .http_client
          .lock()
          .await
          .get(&base_url)
          .header("User-Agent", "EyeTrackVR")
          .send()
          .await?
          .text()
          .await?;
        response
      }
      "POST" => {
        response = self
          .rest_client
          .http_client
          .lock()
          .await
          .post(&base_url)
          .send()
          .await?
          .text()
          .await?;
        response
      }
      _ => {
        error!("Invalid method");
        return Err(Error::IO(std::io::Error::new(
          std::io::ErrorKind::Other,
          "Invalid method",
        )));
      }
    };
    self
      .app_handle
      .trigger_global("request-response", Some(response.clone()));
    Ok(response)
    // send a global event when the API is closed
  }

  /// A function to run a REST Client and create a new RESTClient instance for each device found
  /// ## Arguments
  /// - `endpoint` The endpoint to query for
  /// - `device_name` The name of the device to query
  async fn run_rest_client(
    &self,
    endpoint: String,
    device_name: String,
    method: String,
  ) -> ETVResult<()> {
    info!("Starting REST client");

    let full_url = format!("{}{}", device_name, endpoint);
    info!("[APIPlugin]: Full url: {}", full_url);
    self.set_base_url(full_url).set_method(method);

    let request_result = self.request().await;
    match request_result {
      Ok(response) => {
        self
          .app_handle
          .emit_all("request-response", Some(response.clone()))
          .expect("Failed to emit event");
        println!("[APIPlugin]: Request response: {}", response);
      }
      Err(e) => println!("[APIPlugin]: Request failed: {}", e),
    }
    Ok(())
  }
}

#[tauri::command]
#[specta::specta]
async fn make_request<R: Runtime>(
  endpoint: String,
  device_name: String,
  method: String,
  app_handle: AppHandle<R>,
) -> Result<(), String> {
  info!("Starting REST request");
  let result = app_handle
    .state::<APIPlugin<R>>()
    .run_rest_client(endpoint, device_name, method)
    .await;

  match result {
    Ok(()) => {
      println!("[APIPlugin]: Request response: Ok");
      Ok(())
    }
    Err(e) => {
      println!("[APIPlugin]: Request failed: {}", e);
      Err(e.to_string())
    }
  }
}

macro_rules! specta_builder {
  ($e:expr, Runtime) => {
    ts::builder()
      .commands(collect_commands![make_request::<$e>])
      .path(generate_plugin_path(PLUGIN_NAME))
      .config(specta::ts::ExportConfig::default().formatter(specta::ts::prettier))
    //.events(collect_events![RandomNumber])
  };
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
  //let plugin_utils = specta_builder!(R, Runtime).into_plugin_utils(PLUGIN_NAME);
  Builder::new(PLUGIN_NAME)
    //.invoke_handler(plugin_utils.invoke_handler)
    .setup(move |app| {
      let app = app.clone();

      //(plugin_utils.setup)(&app);

      let plugin = APIPlugin::new(app.app_handle());
      app.manage(plugin);
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![make_request])
    .build()
}

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn export_types() {
    println!("Exporting types for plugin: {}", PLUGIN_NAME);
    println!("Export path: {}", generate_plugin_path(PLUGIN_NAME));

    assert_eq!(
      specta_builder!(tauri::Wry, Runtime)
        .export_for_plugin(PLUGIN_NAME)
        .ok(),
      Some(())
    );
  }
}
