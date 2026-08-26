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

export const BUILTIN_SKINS: SkinDefinition[] = [whaleCloud, whaleMaid, whaleAds];

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
