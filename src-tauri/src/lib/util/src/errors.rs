//! Main crate Error
use serde::{ser::Serializer, Serialize};

//use crate::{colors::Color, etvr_stderr, etvr_stdout, f};

#[derive(thiserror::Error, Debug)]
pub enum Error {
  #[error("Generic error: {0}")]
  Generic(String),
  #[error(transparent)]
  IO(#[from] std::io::Error),
  #[error("Operation Canceled error: {0}")]
  OperationCancelled(String),
}

pub type ETVResult<T> = std::result::Result<T, Error>;

impl Error {
  pub fn new(message: String) -> Self {
    Self::Generic(message)
  }

  pub fn op_cancelled(message: &str) -> Self {
    Self::OperationCancelled(message.to_string())
  }
}

impl Serialize for Error {
  fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}

impl From<reqwest::Error> for Error {
  fn from(e: reqwest::Error) -> Self {
    Error::IO(std::io::Error::new(std::io::ErrorKind::Other, e))
  }
}

// TODO: Handler for custom errors
/* pub fn handle(result: ETVResult<()>) {
  if let Err(error) = result {
    match error {
      Error::Generic(msg) => {
        etvr_stderr!(&msg);
        std::process::exit(1)
      }
      Error::OperationCancelled(msg) => {
        etvr_stdout!(f!("Operation cancelled: {}", Color::new(&msg).bold()).as_str());
      }
      Error::IO(error) => {
        etvr_stderr!(&error.to_string());
        std::process::exit(1)
      }
    }
  }
} */
