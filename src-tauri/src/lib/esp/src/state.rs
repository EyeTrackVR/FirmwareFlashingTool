use std::sync::mpsc::Sender;

pub struct EspState {
  pub log_stream_cancel: Option<Sender<()>>,
}
