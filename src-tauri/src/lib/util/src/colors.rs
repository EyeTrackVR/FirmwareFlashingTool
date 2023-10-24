use dialoguer::console::{style, StyledObject};
use log::Level;
use std::fmt::{Display, Formatter};

pub struct Color<'a> {
  inner: StyledObject<&'a str>,
}

impl<'a> Color<'a> {
  pub fn new(value: &'a str) -> Self {
    Color {
      inner: style(value),
    }
  }

  pub fn map_level(self, level: Level) -> Self {
    match level {
      Level::Error => Color {
        inner: self.inner.red(),
      },
      Level::Warn => Color {
        inner: self.inner.magenta().bold(),
      },
      Level::Info => Color {
        inner: self.inner.green(),
      },
      Level::Debug => Color {
        inner: self.inner.blue(),
      },
      Level::Trace => Color {
        inner: self.inner.cyan(),
      },
    }
  }

  pub fn bold(self) -> Self {
    Color {
      inner: self.inner.bold(),
    }
  }

  pub fn red(self) -> Self {
    Color {
      inner: self.inner.red(),
    }
  }

  pub fn green(self) -> Self {
    Color {
      inner: self.inner.green(),
    }
  }

  pub fn yellow(self) -> Self {
    Color {
      inner: self.inner.yellow(),
    }
  }

  pub fn blue(self) -> Self {
    Color {
      inner: self.inner.blue(),
    }
  }

  pub fn magenta(self) -> Self {
    Color {
      inner: self.inner.magenta(),
    }
  }

  pub fn cyan(self) -> Self {
    Color {
      inner: self.inner.cyan(),
    }
  }
}

impl Display for Color<'_> {
  fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
    f.write_str(&format!("{}", self.inner))
  }
}
