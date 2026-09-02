// ═══════════════════════════════════════════════════════════════════
// 工作流引擎（Workflow Engines）
//
// DeepKing 的四种模式，每一种都由「厂商原装工作流引擎」驱动，并与
// DeepSeek 运行时（deepseek.rs 客户端 + agent_loop.rs 核心循环 +
// tools.rs 工具注册表）强强结合 —— 不是只靠 System Prompt 模拟风格。
//
// | 模式 | 引擎                           | 上游原装仓库                                  | 许可证     |
// |------|--------------------------------|-----------------------------------------------|------------|
// | DSH  | DeepSeek Harness 原生 Agent   | deepseek-ai（DeepSeek Harness）               | MIT        |
// | DSK  | Kimi Code CLI 原装工作流     | github.com/MoonshotAI/kimi-code               | MIT        |
// | DSQ  | Qwen Code 原装工作流         | github.com/QwenLM/qwen-code                   | Apache-2.0 |
// | DSG  | GLM-5 Agentic Engineering    | github.com/zai-org/GLM-5（GLM-5.3 官方仓库）   | Apache-2.0 |
//
// 上游原版源码按原文完整随仓保存在 DeepKing/vendor/（含 LICENSE），
// 本模块与其对应关系的说明见 DeepKing/docs/WORKFLOW-ENGINES.md。
// ═══════════════════════════════════════════════════════════════════

pub mod glm;
pub mod kimi;
pub mod qwen;

use crate::ai::agent_loop::{AgentEvent, AgentEventKind, AgentLoopInput, AgentLoopOutput};
use crate::ai::deepseek::{DeepSeekClient, Message};
use std::sync::Arc;

/// 按模式分发到对应的原装工作流引擎
pub async fn run<F>(input: AgentLoopInput, on_event: F) -> Result<AgentLoopOutput, String>
where
    F: FnMut(AgentEvent) + Send,
{
    match input.mode.as_str() {
        // DSH = DeepSeek Harness 原生 Agent 循环（DeepSeek 运行时基准）
        "dsh" => crate::ai::agent_loop::run_agent_loop(input, on_event).await,
        // DSK = Kimi Code CLI 原装工作流（计划 → 工具执行 → 塔式审查修复）
        "dsk" => kimi::run(input, on_event).await,
        // DSQ = Qwen Code 原装工作流（调研 → 设计+测试计划 → 实现 → 验证 → 自我审计 → 审查）
        "dsq" => qwen::run(input, on_event).await,
        // DSG = GLM-5 原装 Agentic Engineering（全局视角 → 工程化循环 → 关键思维终审）
        "dsg" => glm::run(input, on_event).await,
        other => Err(format!("未知工作流模式：{}（支持 dsh / dsk / dsq / dsg）", other)),
    }
}

// ═══════════════════════════════════════════════════════════════════
// 引擎共享助手
// ═══════════════════════════════════════════════════════════════════

/// 记录事件到本地 sink 并转发给回调
pub fn emit<F>(events: &mut Vec<AgentEvent>, event: AgentEvent, cb: &mut F)
where
    F: FnMut(AgentEvent),
{
    events.push(event.clone());
    cb(event);
}

/// 一次纯文本模型调用（无工具）—— 引擎的规划/设计阶段使用
pub async fn text_call(
    deepseek: &Arc<DeepSeekClient>,
    system: &str,
    user: &str,
) -> Result<String, String> {
    let messages = vec![Message {
        role: "user".into(),
        content: user.to_string(),
        tool_calls: None,
        tool_call_id: None,
        name: None,
        reasoning_content: None,
        r#type: "user".into(),
    }];
    let resp = deepseek.chat(system, &messages).await?;
    let content = resp
        .choices
        .first()
        .map(|c| c.message.content.clone())
        .unwrap_or_default();
    if content.trim().is_empty() {
        return Err("规划阶段模型返回空内容".into());
    }
    Ok(content)
}

/// 阶段循环结果（回传阶段结论，工具调用数等统计）
#[derive(Debug, Clone, Default)]
pub struct PhaseResult {
    pub content: String,
    pub iterations: usize,
    pub tool_calls: usize,
}

/// 运行一个「阶段」：本质是嵌套的核心 Agent Loop（DeepSeek 运行时），
/// 但生命周期事件按阶段规则处理：
/// - `echo_lifecycle = true`（主阶段）：Started / Done 照常转发；
/// - `echo_lifecycle = false`（辅助阶段）：Started 静默、Done 仅回传不转发，
///   避免前端出现多次 started/done 动画；tool/text/file 事件全量转发。
/// `max_iterations = 0` 表示沿用「无步数上限」语义（直到模型给出结论）。
/// `user_override` 可替换本阶段的用户消息（辅助阶段用自己的指令）。
pub async fn run_phase<F>(
    mut input: AgentLoopInput,
    max_iterations: usize,
    preamble: Option<String>,
    user_override: Option<String>,
    echo_lifecycle: bool,
    on_event: &mut F,
) -> Result<PhaseResult, String>
where
    F: FnMut(AgentEvent) + Send,
{
    if max_iterations > 0 {
        input.max_iterations_override = Some(max_iterations);
    } else {
        input.max_iterations_override = None;
    }
    input.extra_preamble = preamble;
    if let Some(u) = user_override {
        input.user_message = u;
    }
    let mut captured: Option<String> = None;
    let mut total_tool_calls = 0usize;
    let mut iterations = 0usize;

    let mut filtered = |event: AgentEvent| -> Option<AgentEvent> {
        match &event.kind {
            AgentEventKind::Started { .. } => {
                if echo_lifecycle {
                    Some(event.clone())
                } else {
                    None
                }
            }
            AgentEventKind::Done {
                content,
                total_iterations,
                total_tool_calls: t,
                ..
            } => {
                captured = Some(content.clone());
                iterations = *total_iterations;
                total_tool_calls = *t;
                if echo_lifecycle {
                    Some(event.clone())
                } else {
                    None
                }
            }
            _ => Some(event.clone()),
        }
    };

    let output = crate::ai::agent_loop::run_agent_loop(input, |ev| {
        if let Some(fwd) = filtered(ev) {
            on_event(fwd);
        }
    })
    .await?;

    let content = captured.unwrap_or(output.final_content.clone());
    Ok(PhaseResult {
        content,
        iterations: if iterations > 0 { iterations } else { output.total_iterations },
        tool_calls: if total_tool_calls > 0 { total_tool_calls } else { output.total_tool_calls },
    })
}

/// 汇总多次阶段结果为一个最终输出（事件流已实时转发过）
pub fn assemble_output<'a>(
    input: &AgentLoopInput,
    phases: &[PhaseResult],
    events: Vec<AgentEvent>,
    context_tokens: usize,
) -> AgentLoopOutput {
    let mut final_content = String::new();
    let mut total_iterations = 0usize;
    let mut total_tool_calls = 0usize;
    for p in phases {
        total_iterations += p.iterations;
        total_tool_calls += p.tool_calls;
        if !p.content.trim().is_empty() {
            final_content = p.content.clone();
        }
    }
    AgentLoopOutput {
        final_content,
        total_iterations,
        total_tool_calls,
        events,
        run_id: input.run_id.clone(),
        context_tokens,
        compressed: false,
    }
}

/// 生成一个用于阶段嵌套执行的浅拷贝（保留 deepseek/undo/工作目录，
/// 重置消息历史——阶段有独立的上下文，正是上游"子智能体/技能阶段"的语义）
pub fn clone_for_phase(input: &AgentLoopInput) -> AgentLoopInput {
    AgentLoopInput {
        mode: input.mode.clone(),
        user_message: input.user_message.clone(),
        history: Vec::new(),
        context_paths: input.context_paths.clone(),
        working_dir: input.working_dir.clone(),
        deepseek: input.deepseek.clone(),
        persona_ctx: input.persona_ctx.clone(),
        run_id: input.run_id.clone(),
        undo_store: input.undo_store.clone(),
        max_iterations_override: None,
        extra_preamble: None,
    }
}

/// 估算上下文 token（与 context.rs 一致的粗糙估算）
pub fn est_tokens(text: &str) -> usize {
    crate::ai::context::ContextCompressor::estimate_tokens(text)
}
