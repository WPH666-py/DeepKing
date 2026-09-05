# DeepKing 说明文档 / Documentation

> 新一代多模态智能体 IDE · Next-Generation Multimodal Agentic IDE
> 用最简洁的架构，做最牛逼的产品！— 水哥

---

# 一、中文说明

## 1. 项目简介

DeepKing 是一款面向现代开发者打造的新一代多模态智能体集成开发环境（Multimodal Agentic IDE）。它由 Deep-IDE 继承而来并全面升级，由青岛理工大学 2022 级毕业生水哥独立设计与开发。DeepKing 并不是传统编辑器的简单复刻，而是将「代码编辑」「多模态 AI 大模型辅助」「多智能体工具调用」「多语言运行环境」「文件解析」「版本控制」与「插件生态」深度融合的桌面级生产力工具。

DeepKing 的核心理念是「简洁架构 + 极致体验」。底层采用 Rust 与 Tauri 2 构建，前端使用 Vue 3 与 TypeScript，实现了接近原生的启动速度与极低的内存占用，同时规避了 Electron 类应用常见的体积臃肿与性能损耗。无论你是学生、独立开发者还是团队工程师，DeepKing 都能在一个窗口内完成从「新建项目 → 编辑代码 → 多模态 AI 辅助开发 → 运行调试 → 版本提交」的完整闭环。

与上一代产品最大的区别在于两点：一是能力模型从「单一文本」升级为「多模态」——内置 DeepSeek-OCR 与 ModLens 两套视觉引擎，让纯文本大模型也能真正"看懂"图片、截图、设计稿与扫描文档；二是工作流从「五种模拟人格」收敛为「四种聚焦模式」——DSH、DSK、DSQ、DSG——其中 DSH 为 DeepSeek Harness 原生 Agent，DSK、DSQ、DSG 由 **Rust 移植的厂商原装工作流引擎**（kimi-code / qwen-code / GLM-5 官方开源仓库）驱动，与 DeepSeek 运行时强强结合，不是仅靠提示词模拟风格。

## 2. 核心特性

- **跨平台桌面应用**：基于 Tauri 2，支持 Windows、macOS 与 Linux，Windows 端提供原生 NSIS 安装包。
- **多标签代码编辑器**：内置 CodeMirror 编辑器，支持语法高亮、主题切换（经典纯白 / 护眼淡绿 / 深色专业）与多种编程语言。
- **文件树与资源管理**：完整的文件树浏览，新建 / 重命名 / 删除 / 复制 / 剪切 / 粘贴，支持拖拽调整面板宽度。
- **四模式 AI 助手**：DSH / DSK / DSQ / DSG 四种工作流，统一走 DeepSeek 大模型运行时；DSK / DSQ / DSG 由厂商原装工作流引擎（Rust 移植 kimi-code / qwen-code / GLM-5 官方源码）驱动。
- **内置多模态视觉引擎**：集成 DeepSeek-OCR 与 ModLens，可识别含文字截图、UI 设计稿、图表、公式与扫描文档，并把视觉内容转译为结构化文本供模型推理。
- **Agent Loop 工具调用**：提供 Claude Code / Cursor 风格的工具 Agent 循环，支持实时代码读写、命令行执行、依赖安装等自动化操作。
- **多语言一键运行**：支持 Python、JavaScript、TypeScript、Java、Go、Rust、C、C++、C#、PHP、SQL、MATLAB、Shell 等多种语言文件的自动识别与运行。
- **内置终端**：底部集成「终端 / 输出」面板，支持输入命令、查看运行结果、导出与复制输出。
- **智能文件解析**：纯 Rust 解析 Office（Excel / Word / PowerPoint），支持 PDF、CSV、图片预览，二进制文件用系统默认程序打开。
- **Git 集成**：内置 Git 状态查看与一键推送，配合 GitHub Token 完成远程仓库提交。
- **插件市场**：接入 VS Code 插件市场，支持搜索、安装与管理软件和插件。
- **界面皮肤系统**：内置三款鲸鱼娘主题皮肤（常规 / 女仆 / 广告），覆盖文件树、编辑区与 AI 区域，支持亮色 / 暗色随时切换；也可粘贴 GitHub 仓库地址一键转换为自定义皮肤。
- **会话持久化**：AI 对话、思考过程、生成结果均本地持久化，刷新页面不丢失。

## 3. 四模式架构

DeepKing 只支持四种工作模式：**DSH、DSK、DSQ、DSG**。四种模式共享同一个 DeepSeek 运行时与多模态视觉栈，**区别在于工作流引擎**：

| 模式 | 对应模型 | 原装工作流引擎 | 机制 |
| --- | --- | --- | --- |
| **DSH** | DeepSeek Harness | DeepSeek Harness 原生 Agent | 稳健的 Agent 循环，架构先行、长任务可追踪 |
| **DSK** | Kimi Code CLI | MoonshotAI/kimi-code（MIT） | 任务规划 → 工具执行 → 塔式审查修复 |
| **DSQ** | Qwen Code | QwenLM/qwen-code（Apache-2.0） | 调研 → 设计+测试计划 → 实现 → 验证 → 自我审计 |
| **DSG** | GLM-5.3 | zai-org/GLM-5（Apache-2.0） | 全局视角 → 工程化循环 → 关键思维终审 |

设计思路：DSH 作为「主模式」，提供最依赖原生 Agent 循环的基准体验；DSK、DSQ 与 DSG 不需要单独拉模型——它们的**编排算法移植自各厂商官方开源工作流源码**（MoonshotAI/kimi-code、QwenLM/qwen-code、zai-org/GLM-5），以 Rust 引擎的形式运行在 DeepSeek 运行时之上。原版源码（含 LICENSE 与 commit 锁定）随仓保存在 `vendor/` 目录，映射关系与算法说明见 `docs/WORKFLOW-ENGINES.md`。这样既保留了真正的"原装工作流"，又把成本压到最低——只消耗 DeepSeek Token。

## 4. 无 Persona 注入层（原装工作流引擎驱动）

DeepKing **不加载任何 Persona 文件、不模拟任何"人格"**。四种模式的编排完全由 Rust 原装工作流引擎负责：

- `src-tauri/src/ai/workflow/kimi.rs`（DSK）、`qwen.rs`（DSQ）、`glm.rs`（DSG）与原生 `agent_loop.rs`（DSH）各自在 `extra_preamble` / 阶段指令中注入**上游原装工作流内容**（kimi-code、qwen-code、GLM-5）；
- 代码内置的"原生系统提示"（`src-tauri/src/ai/modes.rs`）只包含极简的模式身份说明、上下文文件内容块与通用安全规则——没有风格模拟、没有注释清单、没有按权重的知识注入；
- 模式元数据（名称 / 引擎 / 上游仓库 / 许可证 / 机制）由 `modes.rs` 静态表提供，不再读取磁盘上的任何 persona.toml / Markdown 知识文件（`personas/` 目录已整体移除）。

这是"原装工作流 + 单一 DeepSeek 运行时"的完整实现：引擎负责编排，DeepSeek 负责推理，只消耗 DeepSeek Token，其他厂商的模型与人格均不涉及。

## 5. 多模态能力

DeepKing 内置两套互补的视觉引擎，解决"纯文本模型睁眼瞎"这一行业长期痛点：

- **DeepSeek-OCR**：以"上下文光学压缩"范式对高分辨率页面进行高效编码，擅长长文档、复杂版式、公式、五线谱、表格的结构化还原，输出带排版的 Markdown，是大规模文档解析的首选。
- **ModLens**：即插即用的视觉引擎，提供原生 `read_image` 工具，输出结构化 JSON 证据（OCR、版面、语义），并对各种视觉模型提供统一适配，适合截图理解、UI 还原与语义级看图问答。

两者的输出都会转译为结构化文本证据，再注入 DeepSeek 的上下文，使模型能够"看懂"报错截图、设计稿、流程图与扫描件。配合 DeepKing 既有的 Office / PDF / CSV 文件解析，形成了从「文本 → 表格 → 文档 → 图片」的完整多模态上下文闭环。

## 6. 技术架构

DeepKing 采用前后端分层架构。前端使用 Vue 3 + TypeScript + Vite 构建，编辑器基于 CodeMirror 6，状态管理使用 Pinia；后端使用 Rust 编写 Tauri 命令，通过 IPC 与前端通信。文件解析模块大量使用纯 Rust 库：Excel 采用 calamine，Word 与 PowerPoint 采用 zip + XML 解析，文本文件直接用 `std::fs` 读取并支持 UTF-8 / UTF-16 / GBK 编码自动识别；PDF 则通过内置的 Python pymupdf 兜底处理。所有子进程均通过隐藏窗口标志执行，避免弹出黑色命令行窗口。

多模态上下文通过同一文件解析入口统一构成：普通文本与代码支持多编码自动识别；Office 与 PDF 各有专门的解析后端；图片则由 DeepSeek-OCR 与 ModLens 转译成结构化文本。所有解析结果统一转成结构化文本（含格式名、字节数、是否截断等字段），超过上限的大文件按「首尾截断」处理，再由 Prompt 组装器拼入 System Prompt，让 AI 能"看懂"代码、文档、表格、幻灯片、PDF 与图片等多种格式。

## 7. 快速开始

1. 下载并安装 DeepKing 安装包（Windows 为 NSIS 安装程序）。
2. 启动后点击「开始 → 新建项目 / 打开项目」，选择或创建工作目录。
3. 在左侧文件树中双击文件即可编辑；图片直接预览，Office / PDF 文件用系统默认程序打开。
4. 在右侧「AI 助手」面板点击「配置」填入 DeepSeek API Key，并选择 DSH / DSK / DSQ / DSG 四种模式之一。
5. 上传截图或设计稿，DeepKing 会通过内置视觉引擎完成多模态理解后再作答。
6. 顶部选择「运行环境」与「运行文件」，点击「运行」，输出自动显示在底部终端。

## 8. 功能详解

### 8.1 项目管理
通过「开始」菜单可新建或打开项目。项目列表清晰展示「对话 / 编程」模式，进入项目后顶部同样可以查看当前项目与模式，方便随时确认上下文。

### 8.2 文件编辑
编辑器支持多标签切换、保存、另存为。文件树右键菜单提供新建文件、新建文件夹、重命名、复制路径、剪切、复制、粘贴、删除等操作，所有文件操作均限定在项目目录内，安全可控。

### 8.3 AI 助手与四模式
AI 助手支持 DSH / DSK / DSQ / DSG 四种工作流：DSH 为 DeepSeek Harness 原生 Agent 循环；DSK 由 Kimi Code CLI 原装工作流引擎驱动（任务规划 → 工具执行 → 塔式审查修复）；DSQ 由 Qwen Code 原装工作流引擎驱动（调研 → 设计+测试计划 → 实现 → 验证 → 自我审计）；DSG 由 GLM-5 原装 Agentic Engineering 驱动（全局视角 → 工程化循环 → 关键思维终审）。所有模式统一走 DeepSeek 运行时并共享多模态视觉栈，仅消耗 DeepSeek Token。

### 8.4 多模态视觉问答
用户可直接粘贴或上传图片进对话，DeepKing 自动调用 DeepSeek-OCR 或 ModLens 完成识别，把图片内容转译为结构化文本后交给模型推理。适用于报错截图分析、UI 设计稿还原、流程图文字提取、扫描文档识别等场景。

### 8.5 工具调用 Agent Loop
开启「工具」后，AI 可进入 Agent Loop 模式，自动调用读写文件、执行命令、安装依赖等工具，并在「工具」下拉中实时展示工具名称、参数与执行结果，支持展开查看完整详情。

### 8.6 运行文件
顶部可选运行环境与运行文件，系统根据扩展名自动选择解释器或编译器，结果实时输出到底部终端，Python 强制 UTF-8 输出避免中文乱码，所有子进程均隐藏窗口。

### 8.7 终端
底部终端支持输入命令、查看输出，并提供「结果导出」「复制」「清空」按钮，输入框自动聚焦便于连续操作。

### 8.8 Git 集成
「Git 提交」弹框支持填写 GitHub 用户名、Token、目标仓库、分支与提交信息，一键推送到远程仓库，并支持先「检查状态」。

### 8.9 插件市场
软件与插件市场接入 VS Code 插件市场，支持按相关性、下载量、评分等排序搜索，展示插件图标、名称、发布者与描述，一键安装并存到本地。

### 8.10 界面皮肤系统
设置面板提供「界面皮肤 / UI Skin」分区，内置三款鲸鱼娘主题皮肤——「鲸鱼娘·常规」（云鲸纸面）、「鲸鱼娘·女仆」（深海女仆工坊）与「鲸鱼娘·广告」（蓝鲸海报），三者不可删除，覆盖顶部工具栏、文件树、编辑区与 AI 面板，亮色 / 暗色可随时切换，并自动联动编辑器主题。用户还可粘贴任意 GitHub 仓库地址，DeepKing 会抓取仓库中的 `skin.json` 与 CSS 配色变量，经内置插件样式转换器自动生成符合当前编辑器的自定义皮肤；自定义皮肤支持随时删除，且皮肤素材打包于本地，无需额外网络即可加载。

## 9. 运行环境支持

DeepKing 提供增强版运行时检测，自动扫描 PATH 及 C/D/E 盘常见安装目录，识别 Python、Node.js、npm、Java、Go、Rust、gcc、git、Docker、PHP、dotnet 等运行时及其版本，并在顶部下拉框中以「✓ / ✗」标识可用性。

## 10. 关于作者与联系方式

- **作者（昵称）**：水哥
- **毕业院校**：青岛理工大学，2022 级毕业生
- **联系方式**：943050454@qq.com
- **项目理念**：DeepKing，新一代多模态智能体 IDE。用最简洁的架构，做最牛逼的产品！

如有任何问题、建议或合作需求，欢迎通过上述邮箱联系水哥。

---

# 二、English Documentation

## 1. Introduction

DeepKing is a next-generation multimodal agentic IDE built for modern developers. Evolved from Deep-IDE and independently designed by "Brother Shui" (水哥), a 2022 graduate of Qingdao University of Technology, DeepKing deeply integrates code editing, multimodal large-model assistance, multi-agent tool calling, multi-language runtime, file parsing, version control, and a plugin ecosystem into a single desktop product built with Rust and Tauri 2.

Two major upgrades distinguish DeepKing from its predecessor. First, its capability is multimodal: it ships with DeepSeek-OCR and ModLens so text-only models can truly "see" images, screenshots, design mockups, and scanned documents. Second, its workflows are focused into four modes — DSH, DSK, DSQ, and DSG — mapping to DeepSeek Harness, K3, Qwen3.8, and glm5.3; the latter three are realized via offline persona injection.

## 2. Core Features

- **Cross-platform desktop app**: Built on Tauri 2 (Windows / macOS / Linux) with a native NSIS installer on Windows.
- **Multi-tab editor**: CodeMirror 6 with syntax highlighting, theme switching, and many languages.
- **File tree & resource management**: create, rename, delete, copy, cut, paste; draggable panel resizing.
- **Four-mode AI assistant**: DSH / DSK / DSQ / DSG sharing one DeepSeek runtime, with K3 / Qwen3.8 / glm5.3 emulated via offline persona injection.
- **Built-in multimodal vision**: DeepSeek-OCR + ModLens translate screenshots, mockups, charts, formulas, and scans into structured text.
- **Agent Loop tool calling**: Claude Code / Cursor style nine-tool agent loop with live file/command execution.
- **Multi-language one-click run**: Python, JS/TS, Java, Go, Rust, C/C++, C#, PHP, SQL, MATLAB, Shell, and more.
- **Built-in terminal**: input commands, view output, export/copy results.
- **Smart file parsing**: pure Rust for Excel/Word/PowerPoint, pymupdf fallback for PDF, image preview, system-default app for binaries.
- **Git integration**: status checking and one-click push with a GitHub token.
- **Plugin marketplace**: search, install, and manage VS Code extensions.
- **Session persistence**: conversations, reasoning, and results survive page refreshes.

## 3. Quick Start

1. Install the DeepKing installer (NSIS on Windows).
2. Click Start → New Project / Open Project.
3. Double-click files to edit; images preview inline, Office/PDF open with system defaults.
4. Configure the DeepSeek API Key and choose DSH / DSK / DSQ / DSG.
5. Upload screenshots or mockups for multimodal understanding.
6. Choose a Runtime and Run File, then click Run.

## 4. About the Author

- **Nickname**: 水哥 (Brother Shui)
- **Graduation**: Qingdao University of Technology, Class of 2022
- **Contact**: 943050454@qq.com
- **Motto**: DeepKing — Next-generation multimodal agentic IDE. Simple architecture, outstanding product!

---

# 三、联系 / Contact

| 项目 | 信息 |
| --- | --- |
| 作者 | 水哥 (Brother Shui) |
| 毕业院校 | 青岛理工大学 · 2022 级毕业生 |
| 邮箱 | 943050454@qq.com |
| 定位 | 新一代多模态智能体 IDE |