# DeepKing

> 新一代多模态智能体 IDE · Next-Generation Multimodal Agentic IDE
>
> 用最简洁的架构，做最牛逼的产品！ — 水哥

DeepKing 是一款面向现代开发者打造的多模态智能体集成开发环境（Multimodal Agentic IDE）。它由 Deep-IDE 继承升级而来，将「代码编辑」「多模态 AI 辅助」「多智能体工具调用」「多语言运行」「文件解析」「版本控制」与「插件生态」深度融合到同一个桌面窗口。

底层采用 **Rust + Tauri 2** 构建，前端使用 **Vue 3 + TypeScript**，实现接近原生的启动速度与极低内存占用，规避了 Electron 类应用的体积臃肿与性能损耗。

## 核心特性

- **跨平台桌面应用**：基于 Tauri 2，支持 Windows / macOS / Linux，Windows 端提供 NSIS 安装包。
- **四模式 AI 助手**：DSH / DSK / DSQ / DSG 四种工作流，统一走 DeepSeek 运行时；DSK / DSQ / DSG 由 Rust 移植的**厂商原装工作流引擎**（kimi-code / qwen-code / GLM-5）驱动，而非仅风格模拟。
- **内置多模态视觉引擎**：集成 DeepSeek-OCR 与 ModLens，让纯文本大模型也能"看懂"截图、设计稿、图表与扫描文档。
- **界面皮肤系统**：内置三款鲸鱼娘主题皮肤（常规 / 女仆 / 广告），支持亮色 / 暗色随时切换，并可将 GitHub 仓库一键转换为自定义皮肤。
- **多标签编辑器**：内置 CodeMirror 编辑器，支持语法高亮与主题切换（经典纯白 / 护眼淡绿 / 深色专业）。
- **Agent Loop 工具调用**：Claude Code / Cursor 风格的九工具 Agent 循环，支持实时代码读写、命令执行、依赖安装。
- **多语言一键运行**：Python、JavaScript、TypeScript、Java、Go、Rust、C/C++、C#、PHP、SQL、MATLAB、Shell 等自动识别与运行。
- **智能文件解析**：纯 Rust 解析 Office（Excel / Word / PowerPoint），支持 PDF、CSV、图片预览。
- **Git 集成**：状态查看与一键推送，配合 GitHub Token 完成远程提交。
- **插件市场**：接入 VS Code 插件市场，支持搜索、安装与管理插件。
- **会话持久化**：AI 对话、思考过程与生成结果均本地持久化。

## 四种模式

| 模式 | 对应模型 | 原装工作流引擎（Open Source 上游） | 许可证 | 机制 |
| --- | --- | --- | --- | --- |
| **DSH** | DeepSeek Harness | DeepSeek Harness 原生 Agent | MIT | 稳健 Agent 循环，架构先行、长任务可追踪 |
| **DSK** | Kimi Code CLI | [MoonshotAI/kimi-code](https://github.com/MoonshotAI/kimi-code) | MIT | 任务规划 → 工具执行 → 塔式审查修复 |
| **DSQ** | Qwen Code | [QwenLM/qwen-code](https://github.com/QwenLM/qwen-code) | Apache-2.0 | 调研 → 设计+测试计划 → 实现 → 验证 → 自我审计 |
| **DSG** | GLM-5.3 | [zai-org/GLM-5](https://github.com/zai-org/GLM-5) | Apache-2.0 | 全局视角 → 工程化循环 → 关键思维终审 |

四种模式共享同一个 DeepSeek V4 运行时与多模态视觉栈。DSH 是原生 Agent 循环基准；
DSK / DSQ / DSG 的编排算法**移植自厂商官方开源工作流源码**（原版源码随仓保存在
[`vendor/`](vendor/) 目录，含 LICENSE 与 commit 锁定），与 DeepSeek 代码强强结合 ——
**无 Persona 模拟层**：四种模式完全由 Rust 原装工作流引擎驱动（`personas/` 目录与
Persona 加载器已移除）。详见 [`docs/WORKFLOW-ENGINES.md`](docs/WORKFLOW-ENGINES.md)。

## 多模态能力

- **DeepSeek-OCR**：以"上下文光学压缩"范式高效编码高分辨率页面，擅长长文档、复杂版式、公式、表格的结构化还原，输出带排版的 Markdown。
- **ModLens**：即插即用的视觉引擎，提供原生 `read_image` 工具，输出结构化 JSON 证据（OCR、版面、语义），适合截图理解、UI 还原与语义级看图问答。

两者输出均转译为结构化文本证据后注入 DeepSeek 上下文，形成从「文本 → 表格 → 文档 → 图片」的完整多模态闭环。

## 界面皮肤系统

设置面板提供「界面皮肤 / UI Skin」分区：

- 内置三款鲸鱼娘皮肤，**不可删除**：
  - **鲸鱼娘·常规**（云鲸纸面）
  - **鲸鱼娘·女仆**（深海女仆工坊）
  - **鲸鱼娘·广告**（蓝鲸海报）
- 覆盖顶部工具栏、文件树、编辑区与 AI 面板，亮色 / 暗色可随时切换并自动联动编辑器主题。
- 支持自定义接入：粘贴任意 GitHub 仓库地址，自动抓取 `skin.json` 与 CSS 配色变量，经内置插件样式转换器生成符合当前编辑器的皮肤；自定义皮肤可随时删除。
- 皮肤素材打包于本地，加载无需额外网络。

## 技术栈

| 层 | 技术 |
| --- | --- |
| 桌面框架 | Tauri 2（Rust） |
| 前端 | Vue 3 + TypeScript + Vite |
| 编辑器 | CodeMirror 6 |
| 状态管理 | Pinia |
| 文件解析 | calamine、zip + XML、pymupdf |

## 快速开始

1. 下载并安装 DeepKing 安装包（Windows 为 NSIS 安装程序）。
2. 启动后点击「开始 → 新建项目 / 打开项目」。
3. 在左侧文件树双击文件编辑，图片直接预览，Office / PDF 用系统默认程序打开。
4. 在右侧「AI 助手」面板配置 DeepSeek API Key，并选择 DSH / DSK / DSQ / DSG 模式。
5. 粘贴截图或设计稿，DeepKing 会经内置视觉引擎完成多模态理解后再作答。
6. 顶部选择「运行环境」与「运行文件」，点击「运行」，输出显示在底部终端。

## 开发与构建

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm tauri dev

# 构建安装包
pnpm tauri build
```

## 关于作者

- **昵称**：水哥
- **毕业院校**：青岛理工大学 · 2022 级毕业生
- **邮箱**：943050454@qq.com
- **项目理念**：DeepKing，新一代多模态智能体 IDE。用最简洁的架构，做最牛逼的产品！

如有问题、建议或合作需求，欢迎通过邮箱联系。
