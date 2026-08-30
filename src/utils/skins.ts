/**
 * DeepKing 界面皮肤系统
 * 覆盖范围：顶部工具栏、文件树、编辑区（标签栏/空状态/容器）、AI 面板（气泡/输入框/按钮）
 * 皮肤通过注入 <style id="deepking-skin-style"> 覆盖全局样式，编辑器 CodeMirror 主题仍由 editorTheme 独立控制
 */

export type SkinVariant = "light" | "dark";

/** 皮肤调色板：作用于 IDE 各区域的槽位色 */
export interface SkinPalette {
  bg: string; // 顶部工具栏背景
  bgText: string; // 顶部工具栏文字
  sidebarBg: string; // 文件树侧栏背景
  sidebarText: string;
  sidebarHover: string;
  sidebarSelected: string;
  sidebarHeader: string; // "资源管理器"标题色
  editorBg: string; // 编辑区容器/空状态背景
  tabsBg: string; // 标签栏背景
  tabBg: string;
  tabText: string;
  tabActiveBg: string;
  tabActiveText: string;
  aiBg: string; // AI 面板背景
  aiText: string;
  aiTabText: string;
  userBubbleBg: string;
  userBubbleText: string;
  aiBubbleBg: string;
  aiBubbleText: string;
  aiBubbleBorder: string;
  systemBubbleBg: string;
  systemBubbleText: string;
  inputBg: string;
  inputText: string;
  inputBorder: string;
  accent: string; // 强调色：发送按钮、激活 tab 上边框等
  accentText: string;
  border: string; // 通用分隔线
  chipBg: string; // 上下文 chip
  chipText: string;
  chipBorder: string;
}

export interface SkinDefinition {
  id: string;
  name: string;
  /** 来源 GitHub 仓库 */
  source?: string;
  /** 内置皮肤不可删除 */
  builtin: boolean;
  description?: string;
  palettes: { light: SkinPalette; dark?: SkinPalette };
  /** 鲸鱼娘装饰图（编辑区右下角直接显示，带投影） */
  mascot?: { light?: string; dark?: string };
}

// ───────────────────────── 内置皮肤（不可删除） ─────────────────────────

// 本地鲸鱼娘素材（打包进应用，无需 VPN 加载）
const imgCloud = new URL("../assets/skins/whale-cloud.webp", import.meta.url).href;
const imgMaid = new URL("../assets/skins/whale-maid.webp", import.meta.url).href;
const imgMaidNight = new URL("../assets/skins/whale-maid-night.webp", import.meta.url).href;
const imgAds = new URL("../assets/skins/whale-ads.webp", import.meta.url).href;
// 本地原神角色皮肤素材（打包进应用，与鲸鱼娘同款内嵌样式）
const imgFurina = new URL("../assets/skins/genshin-furina.png", import.meta.url).href;
const imgCitlali = new URL("../assets/skins/genshin-citlali.png", import.meta.url).href;
const imgKeqing = new URL("../assets/skins/genshin-keqing.png", import.meta.url).href;
const imgKokomi = new URL("../assets/skins/genshin-kokomi.jpg", import.meta.url).href;
const imgAyaka = new URL("../assets/skins/genshin-ayaka.jpg", import.meta.url).href;
const imgYoimiya = new URL("../assets/skins/genshin-yoimiya.png", import.meta.url).href;

/** 鲸鱼娘·常规风格 —— 源自 dsh-maid-whale-webUI「云鲸纸面」：纸白/云灰/淡天蓝 + 暮蓝暗色 */
const whaleCloud: SkinDefinition = {
  id: "whale-cloud",
  name: "鲸鱼娘·常规",
  source: "https://github.com/yunxiiQwQ/dsh-maid-whale-webUI",
  builtin: true,
  description: "云鲸纸面：纸白云灰淡天蓝，暗色为暮蓝蓝墨",
  palettes: {
    light: {
      bg: "#fffef9", bgText: "#243746",
      sidebarBg: "#e3f1f7", sidebarText: "#315d78", sidebarHover: "#d0e9f2", sidebarSelected: "#bde0ee", sidebarHeader: "#6d8a94",
      editorBg: "#fffef9",
      tabsBg: "#e9f2f5", tabBg: "#e3f1f7", tabText: "#536b6f", tabActiveBg: "#fffef9", tabActiveText: "#243746",
      aiBg: "#eef6f9", aiText: "#243746", aiTabText: "#697f80",
      userBubbleBg: "#cde8f3", userBubbleText: "#243746",
      aiBubbleBg: "#fffef9", aiBubbleText: "#243746", aiBubbleBorder: "#bde0ee",
      systemBubbleBg: "#fff8e6", systemBubbleText: "#876800",
      inputBg: "#fffef9", inputText: "#243746", inputBorder: "#a8d1df",
      accent: "#5aa7d8", accentText: "#fffef9",
      border: "#cde5ef",
      chipBg: "#cde8f3", chipText: "#315d78", chipBorder: "#a8d1df",
    },
    dark: {
      bg: "#1b2a38", bgText: "#deeff4",
      sidebarBg: "#16232e", sidebarText: "#a8d1df", sidebarHover: "#243746", sidebarSelected: "#315d78", sidebarHeader: "#697f80",
      editorBg: "#1b2a38",
      tabsBg: "#16232e", tabBg: "#1b2a38", tabText: "#8d9f9d", tabActiveBg: "#243746", tabActiveText: "#deeff4",
      aiBg: "#16232e", aiText: "#deeff4", aiTabText: "#8d9f9d",
      userBubbleBg: "#315d78", userBubbleText: "#f2f8fa",
      aiBubbleBg: "#243746", aiBubbleText: "#deeff4", aiBubbleBorder: "#315d78",
      systemBubbleBg: "#3d3420", systemBubbleText: "#e8d9a0",
      inputBg: "#243746", inputText: "#deeff4", inputBorder: "#315d78",
      accent: "#69acc8", accentText: "#0f1c26",
      border: "#315d78",
      chipBg: "#315d78", chipText: "#deeff4", chipBorder: "#438db8",
    },
  },
  mascot: {
    light: imgCloud,
    dark: imgCloud,
  },
};

/** 鲸鱼娘·女仆风格 —— 源自 dsh-deep-whale「深海女仆工坊」：深海蓝/陶瓷白/长春花蓝/柔金 */
const whaleMaid: SkinDefinition = {
  id: "whale-maid",
  name: "鲸鱼娘·女仆",
  source: "https://github.com/Small-tailqwq/dsh-deep-whale",
  builtin: true,
  description: "深海女仆工坊：陶瓷白与柔金蕾丝，暗色为深海蓝",
  palettes: {
    light: {
      bg: "#f8f6f0", bgText: "#172347",
      sidebarBg: "#eef1f8", sidebarText: "#243866", sidebarHover: "#e2e8f5", sidebarSelected: "#e9dfc8", sidebarHeader: "#8a94aa",
      editorBg: "#f8f6f0",
      tabsBg: "#e9edf6", tabBg: "#eef1f8", tabText: "#4d5d7f", tabActiveBg: "#f8f6f0", tabActiveText: "#172347",
      aiBg: "#f4f2ec", aiText: "#172347", aiTabText: "#6f7c99",
      userBubbleBg: "#dfe6f6", userBubbleText: "#172347",
      aiBubbleBg: "#fffdf8", aiBubbleText: "#172347", aiBubbleBorder: "#e2cfaa",
      systemBubbleBg: "#f5ecd9", systemBubbleText: "#7a5f2a",
      inputBg: "#fffdf8", inputText: "#172347", inputBorder: "#c5a468",
      accent: "#536eae", accentText: "#f8f6f0",
      border: "#d8dff0",
      chipBg: "#f0e8d5", chipText: "#7a5f2a", chipBorder: "#c5a468",
    },
    dark: {
      bg: "#0d1836", bgText: "#e6e9f5",
      sidebarBg: "#091333", sidebarText: "#8ea5da", sidebarHover: "#10204d", sidebarSelected: "#1c326b", sidebarHeader: "#4d5d7f",
      editorBg: "#0d1836",
      tabsBg: "#091333", tabBg: "#0d1836", tabText: "#6f7c99", tabActiveBg: "#1c326b", tabActiveText: "#e6e9f5",
      aiBg: "#091333", aiText: "#e6e9f5", aiTabText: "#6f7c99",
      userBubbleBg: "#1c326b", userBubbleText: "#e6e9f5",
      aiBubbleBg: "#10204d", aiBubbleText: "#e6e9f5", aiBubbleBorder: "#3d3420",
      systemBubbleBg: "#2a2415", systemBubbleText: "#e2cfaa",
      inputBg: "#10204d", inputText: "#e6e9f5", inputBorder: "#2c447c",
      accent: "#8ea5da", accentText: "#091333",
      border: "#1c326b",
      chipBg: "#1c326b", chipText: "#e2cfaa", chipBorder: "#c5a468",
    },
  },
  mascot: {
    light: imgMaid,
    dark: imgMaidNight,
  },
};

/** 鲸鱼娘·广告风格 —— 源自 dsh-ads 蓝鲸海报：高饱和商业蓝 +  jackpot 金 */
const whaleAds: SkinDefinition = {
  id: "whale-ads",
  name: "鲸鱼娘·广告",
  source: "https://github.com/Nagi-ovo/dsh-ads",
  builtin: true,
  description: "蓝鲸海报风：高饱和商业蓝与亮金点缀",
  palettes: {
    light: {
      bg: "#ffffff", bgText: "#0f1e3d",
      sidebarBg: "#eef3ff", sidebarText: "#1e3a8a", sidebarHover: "#dbe7ff", sidebarSelected: "#c3d7ff", sidebarHeader: "#64748b",
      editorBg: "#ffffff",
      tabsBg: "#e8efff", tabBg: "#eef3ff", tabText: "#475569", tabActiveBg: "#ffffff", tabActiveText: "#0f1e3d",
      aiBg: "#f5f8ff", aiText: "#0f1e3d", aiTabText: "#64748b",
      userBubbleBg: "#2563eb", userBubbleText: "#ffffff",
      aiBubbleBg: "#ffffff", aiBubbleText: "#0f1e3d", aiBubbleBorder: "#c3d7ff",
      systemBubbleBg: "#fef3c7", systemBubbleText: "#92400e",
      inputBg: "#ffffff", inputText: "#0f1e3d", inputBorder: "#93c5fd",
      accent: "#2563eb", accentText: "#ffffff",
      border: "#dbe7ff",
      chipBg: "#fef3c7", chipText: "#92400e", chipBorder: "#f5b301",
    },
  },
  mascot: {
    light: imgAds,
  },
};

/** 芙宁娜·深蓝咏叹风格 —— 源自 Genshen-Furina-Skin：海蓝/陶瓷白，暗色为深海军蓝 */
const furinaSkin: SkinDefinition = {
  id: "genshin-furina",
  name: "芙宁娜 · 深蓝咏叹",
  source: "https://github.com/WPH666-py/Genshen-Furina-Skin",
  builtin: true,
  description: "海蓝咏叹：潮汐瓷白与深蓝底色，暗色为深海军蓝",
  palettes: {
    light: {
      bg: "#f4f9fc", bgText: "#16344a",
      sidebarBg: "#e3f2f9", sidebarText: "#2a6b8f", sidebarHover: "#d3e9f4", sidebarSelected: "#bfe0f0", sidebarHeader: "#6d94a8",
      editorBg: "#f4f9fc",
      tabsBg: "#e9f2f7", tabBg: "#e3f2f9", tabText: "#4a6b80", tabActiveBg: "#f4f9fc", tabActiveText: "#16344a",
      aiBg: "#eef6fa", aiText: "#16344a", aiTabText: "#5c7f95",
      userBubbleBg: "#cce8f5", userBubbleText: "#16344a",
      aiBubbleBg: "#ffffff", aiBubbleText: "#16344a", aiBubbleBorder: "#bfe0f0",
      systemBubbleBg: "#fff7e8", systemBubbleText: "#8a6414",
      inputBg: "#ffffff", inputText: "#16344a", inputBorder: "#9fd2e8",
      accent: "#3d9dc9", accentText: "#ffffff",
      border: "#cfe5f0",
      chipBg: "#d7ecf7", chipText: "#2a6b8f", chipBorder: "#9fd2e8",
    },
    dark: {
      bg: "#10243a", bgText: "#dcecf5",
      sidebarBg: "#0c1c2e", sidebarText: "#7fb4cc", sidebarHover: "#16344f", sidebarSelected: "#235a7c", sidebarHeader: "#5c7f95",
      editorBg: "#10243a",
      tabsBg: "#0c1c2e", tabBg: "#10243a", tabText: "#7f95a0", tabActiveBg: "#16344f", tabActiveText: "#dcecf5",
      aiBg: "#0c1c2e", aiText: "#dcecf5", aiTabText: "#7f95a0",
      userBubbleBg: "#235a7c", userBubbleText: "#eaf5fb",
      aiBubbleBg: "#16344f", aiBubbleText: "#dcecf5", aiBubbleBorder: "#235a7c",
      systemBubbleBg: "#3a3220", systemBubbleText: "#e8d9a0",
      inputBg: "#16344f", inputText: "#dcecf5", inputBorder: "#235a7c",
      accent: "#62b8e8", accentText: "#0c1c2e",
      border: "#235a7c",
      chipBg: "#1c4966", chipText: "#bcdff0", chipBorder: "#3d7fa5",
    },
  },
  mascot: { light: imgFurina, dark: imgFurina },
};

/** 茜特拉莉·紫粉星夜风格 —— 源自 Genshen-Citlali-Skin：紫粉/星夜深紫，暗色为夜紫 */
const citlaliSkin: SkinDefinition = {
  id: "genshin-citlali",
  name: "茜特拉莉 · 紫粉星夜",
  source: "https://github.com/WPH666-py/Genshen-Citlali-Skin",
  builtin: true,
  description: "紫粉星夜：薰衣草淡紫与星辉粉，暗色为夜之紫",
  palettes: {
    light: {
      bg: "#fbf5ff", bgText: "#2a1b4a",
      sidebarBg: "#f1e9fc", sidebarText: "#53387f", sidebarHover: "#e9ddfa", sidebarSelected: "#ddc8f5", sidebarHeader: "#8a7ba6",
      editorBg: "#fbf5ff",
      tabsBg: "#f3ecfe", tabBg: "#f1e9fc", tabText: "#6f5b8f", tabActiveBg: "#fbf5ff", tabActiveText: "#2a1b4a",
      aiBg: "#f6efff", aiText: "#2a1b4a", aiTabText: "#84719f",
      userBubbleBg: "#e4d4fa", userBubbleText: "#2a1b4a",
      aiBubbleBg: "#ffffff", aiBubbleText: "#2a1b4a", aiBubbleBorder: "#ddc8f5",
      systemBubbleBg: "#fdf3e0", systemBubbleText: "#8a6414",
      inputBg: "#ffffff", inputText: "#2a1b4a", inputBorder: "#c9aef0",
      accent: "#a855f7", accentText: "#ffffff",
      border: "#e6d9f8",
      chipBg: "#f0e4ff", chipText: "#53387f", chipBorder: "#c9aef0",
    },
    dark: {
      bg: "#160b2e", bgText: "#f0dcff",
      sidebarBg: "#100821", sidebarText: "#b58fe0", sidebarHover: "#241245", sidebarSelected: "#3b1d6b", sidebarHeader: "#84719f",
      editorBg: "#160b2e",
      tabsBg: "#100821", tabBg: "#160b2e", tabText: "#9d8ab8", tabActiveBg: "#241245", tabActiveText: "#f0dcff",
      aiBg: "#100821", aiText: "#f0dcff", aiTabText: "#9d8ab8",
      userBubbleBg: "#3b1d6b", userBubbleText: "#f0dcff",
      aiBubbleBg: "#241245", aiBubbleText: "#f0dcff", aiBubbleBorder: "#55319a",
      systemBubbleBg: "#3a3420", systemBubbleText: "#e8d9a0",
      inputBg: "#241245", inputText: "#f0dcff", inputBorder: "#55319a",
      accent: "#f0abfc", accentText: "#160b2e",
      border: "#3b1d6b",
      chipBg: "#2e1657", chipText: "#d8bbf5", chipBorder: "#55319a",
    },
  },
  mascot: { light: imgCitlali, dark: imgCitlali },
};

/** 刻晴·紫电雷鸣风格 —— 源自 Genshen-Keqing-Skin：电紫/云白，暗色为雷夜紫 */
const keqingSkin: SkinDefinition = {
  id: "genshin-keqing",
  name: "刻晴 · 紫电雷鸣",
  source: "https://github.com/WPH666-py/Genshen-Keqing-Skin",
  builtin: true,
  description: "紫电雷鸣：雷光浅紫与云白，暗色为雷夜深紫",
  palettes: {
    light: {
      bg: "#f7f5fc", bgText: "#231a3d",
      sidebarBg: "#eee9f8", sidebarText: "#4f3f7d", sidebarHover: "#e3dbf4", sidebarSelected: "#d3c5ee", sidebarHeader: "#8a83a4",
      editorBg: "#f7f5fc",
      tabsBg: "#f0ecf9", tabBg: "#eee9f8", tabText: "#6b6290", tabActiveBg: "#f7f5fc", tabActiveText: "#231a3d",
      aiBg: "#f4f1fb", aiText: "#231a3d", aiTabText: "#7f76a2",
      userBubbleBg: "#e0d5f5", userBubbleText: "#231a3d",
      aiBubbleBg: "#ffffff", aiBubbleText: "#231a3d", aiBubbleBorder: "#d3c5ee",
      systemBubbleBg: "#fdf3e0", systemBubbleText: "#8a6414",
      inputBg: "#ffffff", inputText: "#231a3d", inputBorder: "#c1b2e8",
      accent: "#8b5cf6", accentText: "#ffffff",
      border: "#e0d8f2",
      chipBg: "#ece4fb", chipText: "#4f3f7d", chipBorder: "#c1b2e8",
    },
    dark: {
      bg: "#141020", bgText: "#e8e2f8",
      sidebarBg: "#0f0b1c", sidebarText: "#ab9cd8", sidebarHover: "#221a40", sidebarSelected: "#372a63", sidebarHeader: "#7f76a2",
      editorBg: "#141020",
      tabsBg: "#0f0b1c", tabBg: "#141020", tabText: "#8f86b0", tabActiveBg: "#221a40", tabActiveText: "#e8e2f8",
      aiBg: "#0f0b1c", aiText: "#e8e2f8", aiTabText: "#8f86b0",
      userBubbleBg: "#372a63", userBubbleText: "#e8e2f8",
      aiBubbleBg: "#221a40", aiBubbleText: "#e8e2f8", aiBubbleBorder: "#4d3d8a",
      systemBubbleBg: "#3a3420", systemBubbleText: "#e8d9a0",
      inputBg: "#221a40", inputText: "#e8e2f8", inputBorder: "#4d3d8a",
      accent: "#a78bfa", accentText: "#0f0b1c",
      border: "#372a63",
      chipBg: "#2b2050", chipText: "#cdbdf5", chipBorder: "#6152a8",
    },
  },
  mascot: { light: imgKeqing, dark: imgKeqing },
};

/**
 * 心海·海月之誓风格 —— 源自 Genshen-Kokomi-Skin
 * 调色板直接取自壁纸原色：渊海夜蓝（#0a1a33/#071324）为整个编辑器底色，
 * 瓷白（#fefefd）、波光粉金（#f2bca4/#a58947）、海蓝（#265682）点缀
 */
const kokomiSkin: SkinDefinition = {
  id: "genshin-kokomi",
  name: "心海 · 海月之誓",
  source: "https://github.com/WPH666-py/Genshen-Kokomi-Skin",
  builtin: true,
  description: "海月之誓：海蓝瓷白与波光粉紫，暗色为渊海夜蓝（取壁纸原色）",
  palettes: {
    light: {
      bg: "#faf7f2", bgText: "#16324d",
      sidebarBg: "#eef3f8", sidebarText: "#2a5a7d", sidebarHover: "#e3ecf4", sidebarSelected: "#f3dcd3", sidebarHeader: "#7a8a99",
      editorBg: "#faf7f2",
      tabsBg: "#eef2f6", tabBg: "#eef3f8", tabText: "#56687a", tabActiveBg: "#faf7f2", tabActiveText: "#16324d",
      aiBg: "#f4f6f9", aiText: "#16324d", aiTabText: "#5f7488",
      userBubbleBg: "#d9e7f5", userBubbleText: "#16324d",
      aiBubbleBg: "#ffffff", aiBubbleText: "#16324d", aiBubbleBorder: "#cfe0ef",
      systemBubbleBg: "#fdf2e3", systemBubbleText: "#8a6414",
      inputBg: "#ffffff", inputText: "#16324d", inputBorder: "#b8cfe2",
      accent: "#3b8fd4", accentText: "#ffffff",
      border: "#dbe6f0",
      chipBg: "#f3e3d8", chipText: "#7a4a2a", chipBorder: "#e8c7ae",
    },
    dark: {
      bg: "#0a1a33", bgText: "#eef0f2",
      sidebarBg: "#071324", sidebarText: "#aeb3bd", sidebarHover: "#162439", sidebarSelected: "#1d3a5a", sidebarHeader: "#556577",
      editorBg: "#0a1a33",
      tabsBg: "#071324", tabBg: "#0a1a33", tabText: "#556577", tabActiveBg: "#162439", tabActiveText: "#fefefd",
      aiBg: "#071324", aiText: "#e8eef5", aiTabText: "#556577",
      userBubbleBg: "#265682", userBubbleText: "#fefefd",
      aiBubbleBg: "#162439", aiBubbleText: "#eef4fa", aiBubbleBorder: "#265682",
      systemBubbleBg: "#3a3018", systemBubbleText: "#e8d9a0",
      inputBg: "#162439", inputText: "#eef4fa", inputBorder: "#364558",
      accent: "#f2bca4", accentText: "#2a1a12",
      border: "#1b2b43",
      chipBg: "#1f3b5e", chipText: "#d9e6f2", chipBorder: "#3b4a64",
    },
  },
  mascot: { light: imgKokomi, dark: imgKokomi },
};

/**
 * 绫华·霜雪冰刃风格 —— 源自 Genshen-Ayaka-Skin
 * 调色板直接取自壁纸原色：冰夜深蓝（#101b31/#0d1527）为整个编辑器底色，
 * 瓷白（#fefefe）、樱粉（#c68792）、冰紫（#535596）点缀
 */
const ayakaSkin: SkinDefinition = {
  id: "genshin-ayaka",
  name: "绫华 · 霜雪冰刃",
  source: "https://github.com/WPH666-py/Genshen-Ayaka-Skin",
  builtin: true,
  description: "霜雪冰刃：冰蓝瓷白与樱粉点缀，暗色为冰夜深蓝（取壁纸原色）",
  palettes: {
    light: {
      bg: "#fafbfd", bgText: "#1c3355",
      sidebarBg: "#eef2f9", sidebarText: "#39507a", sidebarHover: "#e2e9f4", sidebarSelected: "#fbdfe6", sidebarHeader: "#7a86a2",
      editorBg: "#fafbfd",
      tabsBg: "#edf1f8", tabBg: "#eef2f9", tabText: "#5a6a86", tabActiveBg: "#fafbfd", tabActiveText: "#1c3355",
      aiBg: "#f4f6fb", aiText: "#1c3355", aiTabText: "#5f7090",
      userBubbleBg: "#e0e9fa", userBubbleText: "#1c3355",
      aiBubbleBg: "#ffffff", aiBubbleText: "#1c3355", aiBubbleBorder: "#ccd9f0",
      systemBubbleBg: "#fdf0f3", systemBubbleText: "#8a4a5a",
      inputBg: "#ffffff", inputText: "#1c3355", inputBorder: "#b8c8e8",
      accent: "#5a8fe0", accentText: "#ffffff",
      border: "#dde6f2",
      chipBg: "#fbe3ea", chipText: "#8a4a5a", chipBorder: "#dba8b8",
    },
    dark: {
      bg: "#101b31", bgText: "#f2f4f8",
      sidebarBg: "#0d1527", sidebarText: "#a7abb4", sidebarHover: "#182237", sidebarSelected: "#2c4d7d", sidebarHeader: "#555b6a",
      editorBg: "#101b31",
      tabsBg: "#0d1527", tabBg: "#101b31", tabText: "#555b6a", tabActiveBg: "#182237", tabActiveText: "#fefefe",
      aiBg: "#0d1527", aiText: "#eef2f8", aiTabText: "#555b6a",
      userBubbleBg: "#535596", userBubbleText: "#f2f4f8",
      aiBubbleBg: "#182237", aiBubbleText: "#eef2f8", aiBubbleBorder: "#535596",
      systemBubbleBg: "#3c2430", systemBubbleText: "#eab8c4",
      inputBg: "#182237", inputText: "#eef2f8", inputBorder: "#3a4355",
      accent: "#c68792", accentText: "#2a1014",
      border: "#242c42",
      chipBg: "#22304e", chipText: "#cfd9f0", chipBorder: "#475985",
    },
  },
  mascot: { light: imgAyaka, dark: imgAyaka },
};

/**
 * 宵宫·琉金云间草风格 —— 源自 Genshen-Yoimiya-Skin
 * 调色板直接取自壁纸原色：星火夜蓝（#222a52/#171d3d）为整个编辑器底色，
 * 瓷白（#f8f6f3）、烟火红橙（#d9584a）、金琉光（#e5a677）点缀
 */
const yoimiyaSkin: SkinDefinition = {
  id: "genshin-yoimiya",
  name: "宵宫 · 琉金云间草",
  source: "https://github.com/WPH666-py/Genshen-Yoimiya-Skin",
  builtin: true,
  description: "琉金云间草：烟火红橙与瓷白，暗色为星火夜蓝（取壁纸原色）",
  palettes: {
    light: {
      bg: "#f8f6f3", bgText: "#3c2a30",
      sidebarBg: "#f3ecea", sidebarText: "#75505a", sidebarHover: "#ebe0dd", sidebarSelected: "#f3d0c4", sidebarHeader: "#8a6a70",
      editorBg: "#f8f6f3",
      tabsBg: "#f0e8e6", tabBg: "#f3ecea", tabText: "#8a6a70", tabActiveBg: "#f8f6f3", tabActiveText: "#3c2a30",
      aiBg: "#f5efed", aiText: "#3c2a30", aiTabText: "#8b7078",
      userBubbleBg: "#f7dfd3", userBubbleText: "#3c2a30",
      aiBubbleBg: "#ffffff", aiBubbleText: "#3c2a30", aiBubbleBorder: "#e5cdc2",
      systemBubbleBg: "#fdf3e0", systemBubbleText: "#8a6414",
      inputBg: "#ffffff", inputText: "#3c2a30", inputBorder: "#d9b8ae",
      accent: "#d9584a", accentText: "#ffffff",
      border: "#e8d8d2",
      chipBg: "#f9e2d4", chipText: "#8a4a3a", chipBorder: "#e0b49a",
    },
    dark: {
      bg: "#222a52", bgText: "#f4e6d0",
      sidebarBg: "#171d3d", sidebarText: "#a9a0c2", sidebarHover: "#2c3563", sidebarSelected: "#584b74", sidebarHeader: "#8a81a8",
      editorBg: "#222a52",
      tabsBg: "#171d3d", tabBg: "#222a52", tabText: "#8a81a8", tabActiveBg: "#2c3563", tabActiveText: "#f4e6d0",
      aiBg: "#171d3d", aiText: "#f0e8dc", aiTabText: "#8a81a8",
      userBubbleBg: "#584b74", userBubbleText: "#f7f2e9",
      aiBubbleBg: "#2c3563", aiBubbleText: "#f0e8dc", aiBubbleBorder: "#584b74",
      systemBubbleBg: "#3d3420", systemBubbleText: "#e8d9a0",
      inputBg: "#2c3563", inputText: "#f0e8dc", inputBorder: "#494374",
      accent: "#e5a677", accentText: "#2a1a10",
      border: "#373965",
      chipBg: "#494374", chipText: "#f2ddc8", chipBorder: "#584b74",
    },
  },
  mascot: { light: imgYoimiya, dark: imgYoimiya },
};

export const BUILTIN_SKINS: SkinDefinition[] = [whaleCloud, whaleMaid, whaleAds, furinaSkin, citlaliSkin, keqingSkin, kokomiSkin, ayakaSkin, yoimiyaSkin];

// ───────────────────────── 自定义皮肤持久化 ─────────────────────────

const CUSTOM_SKINS_KEY = "deepking-custom-skins";

export function getCustomSkins(): SkinDefinition[] {
  try {
    const raw = localStorage.getItem(CUSTOM_SKINS_KEY);
    return raw ? (JSON.parse(raw) as SkinDefinition[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomSkins(skins: SkinDefinition[]) {
  localStorage.setItem(CUSTOM_SKINS_KEY, JSON.stringify(skins));
}

export function addCustomSkin(skin: SkinDefinition) {
  const list = getCustomSkins().filter((s) => s.id !== skin.id);
  list.push({ ...skin, builtin: false });
  saveCustomSkins(list);
}

/** 仅允许删除自定义皮肤；内置皮肤会被忽略 */
export function removeCustomSkin(id: string): boolean {
  if (BUILTIN_SKINS.some((s) => s.id === id)) return false;
  const list = getCustomSkins();
  const next = list.filter((s) => s.id !== id);
  if (next.length === list.length) return false;
  saveCustomSkins(next);
  return true;
}

export function getAllSkins(): SkinDefinition[] {
  return [...BUILTIN_SKINS, ...getCustomSkins()];
}

export function getSkinById(id: string): SkinDefinition | undefined {
  return getAllSkins().find((s) => s.id === id);
}

// ───────────────────────── 皮肤应用 ─────────────────────────

const STYLE_TAG_ID = "deepking-skin-style";

/** 由调色板生成覆盖 CSS（作用于文件树 / 编辑区 / AI 区域） */
export function buildSkinCss(p: SkinPalette, mascotUrl?: string): string {
  const mascotCss = mascotUrl
    ? `
.editor-main-content::after {
  content: ""; position: absolute; right: 20px; bottom: 20px;
  width: 380px; height: 380px; pointer-events: none; z-index: 5;
  background: url("${mascotUrl}") no-repeat right bottom / contain;
  opacity: 1; border-radius: 14px;
  filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.3)) saturate(1.3) contrast(1.08);
}`
    : "";
  return `
/* DeepKing 皮肤覆盖层（自动生成，请勿手动编辑） */
.editor-header { background: ${p.bg} !important; border-bottom-color: ${p.border} !important; }
.editor-header, .editor-header .menu-button, .editor-header .env-select, .editor-header select { color: ${p.bgText} !important; }
.editor-header .menu-button:hover { background: ${p.sidebarHover} !important; }
.editor-header .runtime-select, .editor-header .runfile-select, .editor-header .browser-select {
  background: ${p.inputBg} !important; color: ${p.inputText} !important;
  border: 1px solid ${p.inputBorder} !important;
}
.editor-header .runtime-select:focus, .editor-header .runfile-select:focus, .editor-header .browser-select:focus {
  border-color: ${p.accent} !important; outline: none;
}
.editor-header .runtime-select option, .editor-header .runfile-select option, .editor-header .browser-select option {
  background: ${p.inputBg} !important; color: ${p.inputText} !important;
}
.editor-header .add-runtime-btn {
  background: ${p.inputBg} !important; color: ${p.accent} !important; border: 1px solid ${p.inputBorder} !important;
}
.editor-header .add-runtime-btn:hover { background: ${p.sidebarHover} !important; }

.file-explorer { background: ${p.sidebarBg} !important; border-right-color: ${p.border} !important; }
.file-explorer-header { color: ${p.sidebarHeader} !important; border-bottom-color: ${p.border} !important; }
.file-explorer .file-item { color: ${p.sidebarText} !important; }
.file-explorer .file-item:hover { background: ${p.sidebarHover} !important; }
.file-explorer .file-item.selected { background: ${p.sidebarSelected} !important; }
.file-explorer .file-item.open { background: ${p.sidebarSelected} !important; }
.file-explorer .file-item.open:hover { background: ${p.sidebarHover} !important; }

.editor-area { background: ${p.editorBg} !important; }
.tabs-bar { background: ${p.tabsBg} !important; border-bottom-color: ${p.border} !important; }
.tabs-bar .tab { background: ${p.tabBg} !important; color: ${p.tabText} !important; }
.tabs-bar .tab.active { background: ${p.tabActiveBg} !important; color: ${p.tabActiveText} !important; border-top-color: ${p.accent} !important; }
.editor-main-content { background: ${p.editorBg} !important; position: relative; }
.editor-empty { background: ${p.editorBg} !important; color: ${p.aiTabText} !important; }
.editor-empty .empty-text, .editor-empty .empty-sub { color: ${p.aiTabText} !important; }

.ai-panel { background: ${p.aiBg} !important; border-left-color: ${p.border} !important; color: ${p.aiText} !important; }
.ai-panel-tabs { border-bottom-color: ${p.border} !important; }
.ai-panel-tabs .ai-tab { color: ${p.aiTabText} !important; }
.ai-panel-tabs .ai-tab.active { color: ${p.aiText} !important; border-bottom-color: ${p.accent} !important; }
.ai-panel .message.user-message { background: ${p.userBubbleBg} !important; color: ${p.userBubbleText} !important; }
.ai-panel .message.ai-message { background: ${p.aiBubbleBg} !important; color: ${p.aiBubbleText} !important; border-color: ${p.aiBubbleBorder} !important; }
.ai-panel .message.system-message { background: ${p.systemBubbleBg} !important; color: ${p.systemBubbleText} !important; border-color: ${p.chipBorder} !important; }
.ai-panel .msg-role { color: ${p.aiTabText} !important; }
.ai-input-area { border-top-color: ${p.border} !important; }
.ai-input-area textarea { background: ${p.inputBg} !important; color: ${p.inputText} !important; border-color: ${p.inputBorder} !important; }
.ai-input-area textarea:focus { border-color: ${p.accent} !important; }
.ai-input-area select { background: ${p.inputBg} !important; color: ${p.inputText} !important; border-color: ${p.inputBorder} !important; }
.ai-send-btn { background: ${p.accent} !important; color: ${p.accentText} !important; }
.ai-send-btn:hover:not(:disabled) { filter: brightness(1.12); }
.ai-context-chip { background: ${p.chipBg} !important; color: ${p.chipText} !important; border-color: ${p.chipBorder} !important; }
.ai-context-add-btn { color: ${p.chipText} !important; border-color: ${p.chipBorder} !important; }
.ai-quick-actions .quick-action-btn { background: ${p.aiBubbleBg} !important; color: ${p.aiText} !important; border-color: ${p.border} !important; }
${mascotCss}
`;
}

/** 应用皮肤：skinId 为 null 时恢复默认样式 */
export function applySkin(skinId: string | null, variant: SkinVariant = "light") {
  let tag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
  if (!skinId) {
    tag?.remove();
    delete document.body.dataset.skin;
    return;
  }
  const skin = getSkinById(skinId);
  if (!skin) {
    tag?.remove();
    return;
  }
  // 若皮肤没有暗色变体但用户选了暗色，回退到亮色
  const v: SkinVariant = variant === "dark" && !skin.palettes.dark ? "light" : variant;
  const palette = v === "dark" ? skin.palettes.dark! : skin.palettes.light;
  const mascotUrl = v === "dark" ? skin.mascot?.dark ?? skin.mascot?.light : skin.mascot?.light;
  if (!tag) {
    tag = document.createElement("style");
    tag.id = STYLE_TAG_ID;
    document.head.appendChild(tag);
  }
  tag.textContent = buildSkinCss(palette, mascotUrl);
  document.body.dataset.skin = `${skin.id}:${v}`;
}

// ───────────────────────── 颜色工具（converter 也会用） ─────────────────────────

export function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(m)) return null;
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** 向白色混合（amount: 0~1） */
export function lighten(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return rgbToHex(rgb[0] + (255 - rgb[0]) * amount, rgb[1] + (255 - rgb[1]) * amount, rgb[2] + (255 - rgb[2]) * amount);
}

/** 向黑色混合（amount: 0~1） */
export function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return rgbToHex(rgb[0] * (1 - amount), rgb[1] * (1 - amount), rgb[2] * (1 - amount));
}

/** 粗略判断颜色是否为浅色 */
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 > 150;
}

// 开发模式下皮肤代码热更新后，自动重绘当前皮肤（无需手动重选）
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    const id = localStorage.getItem("deepking-skin-id");
    const v = (localStorage.getItem("deepking-skin-variant") as SkinVariant) || "light";
    applySkin(id, v);
  });
}
