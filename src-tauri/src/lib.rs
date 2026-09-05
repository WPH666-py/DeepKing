use serde::{Deserialize, Serialize};

pub mod commands;
pub mod ai;
pub mod cli;

pub use ai::{DeepSeekClient, UndoStore};

/// 文件条目（用于文件树）
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub size: u64,
    pub children: Option<Vec<FileEntry>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DirListResult {
    pub entries: Vec<FileEntry>,
    pub path: String,
}

/// AI 模式（DeepKing 仅支持四种）
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum AIMode {
    #[serde(rename = "dsh")]
    DSH,
    #[serde(rename = "dsk")]
    DSK,
    #[serde(rename = "dsq")]
    DSQ,
    #[serde(rename = "dsg")]
    DSG,
}

impl AIMode {
    pub fn as_str(&self) -> &'static str {
        match self {
            AIMode::DSH => "dsh",
            AIMode::DSK => "dsk",
            AIMode::DSQ => "dsq",
            AIMode::DSG => "dsg",
        }
    }

    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "dsh" => Some(AIMode::DSH),
            "dsk" => Some(AIMode::DSK),
            "dsq" => Some(AIMode::DSQ),
            "dsg" => Some(AIMode::DSG),
            _ => None,
        }
    }
}
