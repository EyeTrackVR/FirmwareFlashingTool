pub use crate::errors::Error;
pub use crate::{etvr_stderr, etvr_stdout};
pub use log::{debug, error, info, trace, warn};
pub use tauri_specta::ts;
pub use tauri_specta::*;

//pub const EXPORT_PATH_ROOT: &str = "../../../../src/static/types/tauri/";
pub const EXPORT_PATH_ROOT: &str = "./";
pub use std::format as f;
// Generic wrapper tuple struct for new type pattern , mostly used for type aliasing
pub struct W<T>(pub T);

pub fn generate_plugin_path(plugin_name: &str) -> String {
  f!("{}{}.ts", EXPORT_PATH_ROOT, plugin_name)
}

macro_rules! tauri_handlers {
	($($name:path),+) => {{
		#[cfg(debug_assertions)]
		tauri_specta::ts::export(specta::collect_types![$($name),+], "../../../src/static/types/tauri_types.ts").unwrap();

		tauri::generate_handler![$($name),+]
	}};
}
