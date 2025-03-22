use std::sync::mpsc::SyncSender;

pub struct AppState {
    pub sidecar_sender: SyncSender<i32>,
}