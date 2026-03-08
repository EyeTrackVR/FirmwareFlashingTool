use std::sync::mpsc::Sender;

pub struct AppState {
    pub sidecar_sender: Sender<()>,
}