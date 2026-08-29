use std::path::PathBuf;
use serde::{Deserialize, Serialize};

pub mod commands;
pub mod ai;
pub mod cli;

pub use ai::{DeepSeekClient, PersonaLoader, UndoStore};

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

/// 获取 Personas 目录路径
pub fn get_personas_dir() -> PathBuf {
    // Tauri 打包后 resource dir 是 exe 所在目录的上一级
    // 开发时是 src-tauri/
    let mut dir = std::env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|p| p.to_path_buf()))
        .unwrap_or_else(|| PathBuf::from("."));

    // 从 target/debug/ 或 target/release/ 向上一级找 personas/
    for _ in 0..4 {
        let personas = dir.join("personas");
        if personas.exists() {
            return personas;
        }
        dir = dir.parent().map(|p| p.to_path_buf()).unwrap_or(dir);
    }

    // fallback: 相对于 src-tauri 的上级目录
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .map(|p| p.join("personas"))
        .unwrap_or_else(|| PathBuf::from("personas"))
}
