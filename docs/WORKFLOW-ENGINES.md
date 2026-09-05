# DeepKing 四种模式 → 厂商原装工作流引擎

> 版本 0.2.0 · 2026-09-02
>
> DeepKing 的 DSH / DSK / DSQ / DSG 四种模式，**无 Persona 注入层**（`personas/`
> 与 Persona 加载器已整体移除，不做风格模拟）：
> DSK / DSQ / DSG 由 **Rust 移植的厂商原装工作流引擎**驱动，引擎与 DeepSeek 运行时
> （`deepseek.rs` 客户端 + `agent_loop.rs` 核心循环 + `tools.rs` 工具注册表）**强强结合**，
> 只消耗 DeepSeek Token。

## 一、引擎总览

| 模式 | 引擎 | 上游原装仓库（Open Source） | 许可证 | 引擎源码位置 |
|------|------|---------------------------|--------|--------------|
| **DSH** | DeepSeek Harness 原生 Agent | DeepSeek Harness / deepseek-ai | MIT | `src/ai/agent_loop.rs`（原生循环） |
| **DSK** | Kimi Code CLI 原装工作流 | [`MoonshotAI/kimi-code`](https://github.com/MoonshotAI/kimi-code)（Kimi Code CLI · Next-Gen Agent） | MIT | `src/ai/workflow/kimi.rs` |
| **DSQ** | Qwen Code 原装工作流 | [`QwenLM/qwen-code`](https://github.com/QwenLM/qwen-code)（Qwen Code，Apache-2.0） | Apache-2.0 | `src/ai/workflow/qwen.rs` |
| **DSG** | GLM-5 原装 Agentic Engineering | [`zai-org/GLM-5`](https://github.com/zai-org/GLM-5)（GLM-5.3 / GLM-5.2 / GLM-5.1 / GLM-5 官方仓库） + [`zai-org/GLM-4.5`](https://github.com/zai-org/GLM-4.5) | Apache-2.0 | `src/ai/workflow/glm.rs` |

四种模式共用同一个 DeepSeek V4 运行时与同一套 18 工具（read/write/edit/batch_*/bash/
grep/glob/subagents/todo/web_search/read_image/read_pdf/read_excel/check_runtime…）、
DSML 工具调用解析、上下文自动压缩与撤回撤销日志。

## 二、原版源码（vendor/）

按上游仓库原文（含 LICENSE、commit SHA）随仓保存，保证"原装工作流源代码"真实可查：

```
vendor/
├── kimi-code/                     # MoonshotAI/kimi-code @ c52d583（MIT）
│   ├── LICENSE / AGENTS.md
│   ├── agent-core-v2/CHANGELOG.md                # 下一代 Agent 核心功能清单
│   ├── agent-core-v2/src/index.ts                # Agent 引擎入口（35KB）
│   ├── agent-core-v2/src/agent/task/{types,errors}.ts   # 任务规划/后台任务契约
│   ├── agent-core-v2/src/agent/state/agentState.ts      # Agent 阶段状态机
│   └── PROVENANCE.md
├── qwen-code/                     # QwenLM/qwen-code @ main（Apache-2.0）
│   ├── LICENSE / AGENTS.md / README.md
│   ├── core/src/index.ts          # @qwen-code/qwen-code-core 入口
│   └── PROVENANCE.md
└── glm-5/                         # zai-org/GLM-5 @ 008de4d + zai-org/GLM-4.5 @ 170f20b（Apache-2.0）
    ├── LICENSE / README_zh.md / README.md
    ├── skills/glm-master-skill/SKILL.md          # GLM 官方技能总览（master skill）
    ├── glm45/LICENSE
    ├── glm45/example/claude_code/README.md       # GLM-4.5 官方 agent 运行集成
    └── PROVENANCE.md
```

所有迁移均为"忠实移植 + 来源标注"：Rust 引擎实现核心编排算法并在注释中注明对应
上游文件；vendor/ 目录保留原文供对照与审阅，许可证文件一并保留。

## 三、各引擎工作流

### DSH —— DeepSeek Harness 原生 Agent（基准）

原生 `agent_loop.rs`：无步数上限（0 = 循环到模型给出结论）、todo 规划、全局扫描、
读前必改约束、批量写/编辑、1-4 并行子智能体、DSML 双源解析、上下文自动压缩。

### DSK —— Kimi Code CLI 原装工作流（kimi.rs）

对齐 `kimi-code/packages/agent-core-v2` 的 Next-Gen Agent 语义：

1. **任务规划（plan）**：one-shot 规划器输出【目标 / 步骤 / 验收标准】
   （对应 agent-core-v2 的 task 规划与 `plan` 工具语义）；
2. **执行（execute）**：核心 Agent 循环，无步数上限（对应
   `[loop_control]` + `KIMI_LOOP_MAX_STEPS_PER_TURN` 语义：默认无限步、工具执行器
   `toolExecutor` 循环：模型生成 → 工具调用 → 结果回灌 → 直到结论），
   随规划注入 `toolDedupe` / `toolResultTruncation` 同源纪律（批量工具、结果截断）；
3. **塔式审查（tower review）**：派遣有界审查子智能体（对应 `features/tower`
   的 `spawn/review/merge`）对照验收标准逐项核验并修复，回传结论。

### DSQ —— Qwen Code 原装工作流（qwen.rs）

对齐 `qwen-code/AGENTS.md`（仓库内 `/feat-dev`、`/bugfix`、`/review` 技能的工作流）：

1. **调研 investigate**：只读探查（glob/grep/read），输出入口与影响面；
2. **设计 + 测试计划 design**：实现计划、行为验证清单、验收标准
   （`docs/design`、`.qwen/e2e-tests` 同源协议）；
3. **实现 implement（主阶段）**：无步数上限，注入 **Simplicity First** 纪律
   （最小代码、无投机抽象、写多了就重写）；
4. **验证 verify**：跑测试/构建并修复；失败则第二轮修复（`test-engineer` 语义）；
5. **自我审计 self-audit**：通读全部 diff，按"两次连续 clean pass"规则，
   每一条绿色测试证据都预设其可能错误；数轮不收敛则如实说明。

### DSG —— GLM-5 原装 Agentic Engineering（glm.rs）

对齐 `zai-org/GLM-5` 官方 README（GLM-5.3 定位"复杂系统工程与长周期任务"、
GLM-5.1 起"数百轮迭代、数千次工具调用中持续优化、反复审视推理动态调整策略"）
与 GLM-4.5 官方 agent 集成 `example/claude_code`（read → analyze → respond 循环）：

1. **全局视角 Global Scan**：只读建立模块边界/调用链/影响面地图；
2. **工程化循环（主阶段）**：无步数上限；读 → 析 → 应；每约 5 轮自省一次
   已选策略并动态调整；改共享函数前 grep 全部使用点；
3. **关键思维终审**：构造反例（边界输入、时序、错误路径）、修复、复验，
   输出结构化交付（改动清单 / 验证证据 / 遗留风险）。

## 四、成本与限制

- **单一运行时**：四种引擎全部通过 DeepSeek V4 API 完成推理，只消耗 DeepSeek Token；
  视觉识别（DeepSeek-OCR / ModLens）另计。
- **阶段开销**：DSK/DSQ/DSG 的规划/审查阶段会增加 1-3 次模型调用；小任务可关闭
  工具（纯对话模式仍走 `send_ai_message`，引擎仅在"带工具 Agent Loop"启用）。
- **合法合规**：vendor/ 内上游源码均为 MIT / Apache-2.0 许可，保留原始 LICENSE
  与本说明；Rust 引擎为参考上游算法的重写实现。
