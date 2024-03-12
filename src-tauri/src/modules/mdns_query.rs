//! A mdns query client.

// TODO: Migrate to plugin and remove the mdns_query module

use log::{error, info};
use mdns_sd::{ServiceDaemon, ServiceEvent};
use serde::Serialize;
use std::collections::hash_map::HashMap;
use std::sync::{Arc, Mutex};

pub type MdnsMap = Arc<Mutex<HashMap<String, String>>>; // Arc<Mutex<HashMap<String, String>>>;
/// A struct to hold the mDNS query results
/// - `base_url`: a hashmap of the base urls found
/// - `name`: a vector of the names of the devices found
#[derive(Debug)]
pub struct Mdns {
  pub base_url: MdnsMap,
  pub names: Vec<String>,
  pub ip: Vec<String>,
}

/// A struct to hold the mDNS query results and pass them to the front end
/// - `names`: a vector of the names of the devices found
/// - `ip`: a vector of the ip addresses of the devices found
#[derive(Debug, Serialize)]
pub struct MdnsData {
  pub names: Vec<String>,
  pub ips: Vec<String>,
}

impl Mdns {
  /// A function to create a new Mdns struct
  /// ## Returns
  /// A new Mdns struct
  pub fn new() -> Mdns {
    Mdns {
      base_url: Arc::new(Mutex::new(HashMap::new())),
      names: Vec::new(),
      ip: Vec::new(),
    }
  }
}

impl MdnsData {
  /// A function to create a new MdnsData struct
  /// ## Arguments
  /// - `names`: a vector of the names of the devices found
  /// - `ip`: a vector of the ip addresses of the devices found
  /// ## Returns
  /// A new MdnsData struct
  pub fn new() -> MdnsData {
    MdnsData {
      names: Vec::new(),
      ips: Vec::new(),
    }
  }
}

/// Runs a mDNS query for X seconds
/// ## Arguments
/// - `mdns` A mutable reference to the Mdns struct
/// - `service_type` The service type to query for
/// - `scan_time` The number of seconds to query for
/// ## Example
/// ```
/// // Create a new Mdns struct
///let mut mdns: mdns_query::Mdns = mdns_query::Mdns {
///    base_url: HashMap::new(),
///    name: Vec::new(),
///};
/// // Run a mDNS query for 10 seconds
///let ref_mdns = &mut mdns;
///mdns_query::run_query(ref_mdns, String::from("_http._tcp"), 10);
/// ```
/// ## Notes
/// ***The service type should not have a '.' or a 'local' at the end.*** <br>
/// ***The program adds ".local." automatically.***
pub async fn run_query(
  instance: &mut Mdns,
  mut service_type: String,
  mdns_data: &mut MdnsData,
  scan_time: u64,
) -> Result<(), Box<dyn std::error::Error>> {
  let mdns =
    ServiceDaemon::new().expect("Failed to create daemon. Please install Bonjour on your system");
  //* Browse for a service type.
  service_type.push_str(".local.");
  let receiver = mdns.browse(&service_type).map_err(|e| e.to_string())?;
  let now = std::time::Instant::now();
  //* listen for event then stop the event loop after 5 seconds.
  // while let Ok(event) = receiver.recv() {}
  while now.elapsed().as_secs() <= scan_time {
    //* let event = receiver.recv().expect("Failed to receive event");
    if let Ok(event) = receiver.recv_async().await {
      match event {
        ServiceEvent::ServiceResolved(info) => {
          info!(
            "At {:?}: Resolved a new service: {} IP: {:#?}:{:#?} Hostname: {:#?}",
            now.elapsed(),
            info.get_fullname(),
            info.get_addresses(),
            info.get_port(),
            info.get_hostname(),
          );
          //* split the fullname by '.' and take the first element
          let name = info.get_hostname();
          info!("Service name: {}", name);
          //* remove the period at the end of the name
          let mut name = name.trim_end_matches('.');
          //* append name to 'http://' to get the base url
          let mut base_url = String::from("http://");
          base_url.push_str(name);
          info!("Base URL: {}", base_url);
          //* add the base url to the hashmap
          instance
            .base_url
            .lock()
            .map_err(|e| e.to_string())?
            .insert(name.to_string(), base_url);
          //* remove the `.local` from the name
          name = name.trim_end_matches(".local");
          instance.names.push(name.to_string());
          let ip = info.get_addresses();
          // grab the ip address' from the hash-set and add them to the vector
          for i in ip {
            instance.ip.push(i.to_string());
          }
          //* add the name and ip to the MdnsData struct
          mdns_data.names = instance.names.clone();
          mdns_data.ips = instance.ip.clone();
        }
        other_event => {
          info!(
            "At {:?} : Received other event: {:?}",
            now.elapsed(),
            &other_event
          );
        }
      }
    }
  }
  std::thread::sleep(std::time::Duration::from_nanos(1));
  //mdns.stop_browse(&service_type).map_err(|e| e.to_string())?;
  info!("Stopping mDNS query daemon -  refresh to restart");
  mdns.shutdown().map_err(|e| e.to_string())?;
  Ok(())
}

/// Returns a map of the base urls found
/// ## Arguments
/// - `mdns` A mutable reference to the Mdns struct
/// ## Return
/// A map of all the base urls found for the service type
/// ## Example
/// ```
/// // Create a new Mdns struct
///let mut mdns: mdns_query::Mdns = mdns_query::Mdns {
///    base_url: HashMap::new(),
///    name: Vec::new(),
///};
/// // Run a query for 10 seconds
///let ref_mdns = &mut mdns;
///mdns_query::run_query(ref_mdns, String::from("_http._tcp"), 10);
/// // Get the base urls map
///let urls_map = mdns_query::get_url_map(ref_mdns);
/// ```
/* pub fn get_url_map(instance: &mut Mdns) -> &mut MdnsMap {
  println!("Base URL: {:?}", &instance.base_url);
  &mut instance.base_url
} */

/// Returns a vector of the base urls found
/// ## Arguments
/// - `mdns` A mutable reference to the Mdns struct
/// ## Return
/// A vector of all the urls found for the service type
/// ## Example
/// ```
/// // Create a new Mdns struct
/// let mut mdns: mdns_query::Mdns = mdns_query::Mdns {
///    base_url: HashMap::new(),
///   name: Vec::new(),
/// };
/// // Run a query for 10 seconds
/// let ref_mdns = &mut mdns;
/// mdns_query::run_query(ref_mdns, String::from("_http._tcp"), 10);
/// // Get the names vector
/// let vec = mdns_query::get_urls(ref_mdns);
/// ```
pub fn get_urls(instance: &Mdns) -> Vec<String> {
  let mut urls: Vec<String> = Vec::new();

  let instance_lock = instance.base_url.lock();
  let instance_check_result = match instance_lock {
    Ok(instance_lock) => instance_lock,
    Err(err) => {
      error!(
        "Failed to lock the instance: {:?} with error: {} in get_urls",
        instance, err
      );
      return urls;
    }
  };

  for (_, url) in instance_check_result.iter() {
    urls.push(url.to_string());
  }
  urls
}

/* pub async fn generate_json(instance: &Mdns) -> Result<String, Box<dyn std::error::Error>> {
  let data = get_urls(instance);
  //let mut json: serde_json::Value = serde_json::from_str("{}").unwrap();
  let mut json: Option<serde_json::Value> = None;
  // create a data iterator
  for (i, url) in data.iter().enumerate() {
    json = Some(serde_json::json!({
        "ips": [instance.ip[i].to_string()],
        "urls": {
            instance.names[i].to_string(): url.to_string()
        },
    }));
  }
  let config: serde_json::Value;
  if let Some(json) = json {
    let _serde_json = serde_json::from_value(json);
    let serde_json_result = match _serde_json {
      Ok(serde_json) => serde_json,
      Err(err) => {
        error!("Error configuring JSON config file: {}", err);
        return Err("Error configuring JSON config file".into());
      }
    };
    config = serde_json_result;
  } else {
    config = serde_json::json!({});
  }
  info!("{:?}", config);
  // write the json object to a file
  let to_string_json = serde_json::to_string_pretty(&config)?;
  // return the json object as a string

  Ok(to_string_json)
} */
