use std::fs::File;
use std::io::Read;
use std::path::Path;

use serde::{Deserialize, Serialize, Serializer};
use thiserror::Error;
use crate::api::EspError;

#[derive(Debug, Deserialize)]
pub struct Part {
    pub path: String,
    pub offset: u32,
}

#[derive(Debug, Deserialize)]
pub struct Build {
    #[serde(rename = "chipFamily")]
    pub chip_family: String,
    pub parts: Vec<Part>,
}

#[derive(Debug, Deserialize)]
pub struct Manifest {
    pub name: String,
    pub version: String,
    pub new_install_prompt_erase: bool,
    pub builds: Vec<Build>,
}

#[derive(Error, Debug)]
pub enum ManifestError {
    #[error(transparent)]
    IoError {
        #[from]
        source: std::io::Error,
    },
    #[error(transparent)]
    JsonError {
        #[from]
        source: serde_json::Error,
    },
}

impl Serialize for ManifestError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

pub fn load_manifest(path: &Path) -> Result<Manifest, ManifestError> {
    let mut file = File::open(path)?;
    let mut json = String::new();
    file.read_to_string(&mut json)?;

    let manifest: Manifest = serde_json::from_str(&json)?;
    Ok(manifest)
}
