// ═══════════════════════════════════════════════════════════════════
// DSG 工作流引擎 — GLM-5 原装 Agentic Engineering（全局视角 → 工程化循环 → 终审）
//
// 上游：github.com/zai-org/GLM-5（GLM-5.3 / GLM-5.2 / GLM-5.1 / GLM-5 官方仓库，
//       Apache-2.0）与 github.com/zai-org/GLM-4.5（Apache-2.0）
//   - GLM-5 定位：复杂系统工程与长周期智能体任务（"vibe coding → agentic
//     engineering"）；GLM-5.1 起具备长程持续优化能力：拆解复杂问题、设计
//     实验、解读结果、定位瓶颈，通过反复审视自身推理、动态调整策略，在
//     数百轮迭代、数千次工具调用中持续优化——运行越久结果越好。
//   - GLM-4.5 官方 Claude Code 集成（vendor/glm-5/glm45/example/claude_code）：
//     agent 运行形态为"read → analyze → respond"循环，配合 tool-call 解析。
//   - skills/glm-master-skill（随仓 vendor/glm-5/）：GLM 官方技能目录，
//     代理按"匹配意图 → 打开对应 SKILL.md → 按指令执行"消费技能。
//
// DeepKing 集成方式：全局视角(读-析-应循环建立代码地图) →
// 工程化主循环(无步数上限 + 每 5 轮自审策略) → 关键思维终审 ——
// 全部运行在 DeepSeek 运行时上。原版源码随仓保存于 vendor/glm-5/。
// ═══════════════════════════════════════════════════════════════════

use crate::ai::agent_loop::{AgentEvent, AgentEventKind, AgentLoopInput, AgentLoopOutput};
use crate::ai::workflow::{assemble_output, clone_for_phase, emit, est_tokens, run_phase};

/// GLM-5 工程化循环纪律（对齐官方 README 的 agentic engineering 与长程自审）
const GLM_ENGINEERING_PREAMBLE: &str = r#"
## GLM-5 原装 Agentic Engineering 循环（zai-org/GLM-5）
GS: 目标 = 复杂系统工程与长周期任务。循环规则：
1. 读(Read) → 析(Analyze) → 应(Respond)：每次动手前先读取最新真实内容，
   分析后回应，绝不凭记忆改文件（对齐 GLM-4.5 官方 agent 集成的工作形态）。
2. 长程自我优化：每完成约 5 轮，主动审视自身推理与已选策略，动态调整
   策略（拆解问题 → 设计实验 → 解读结果 → 定位瓶颈），而不是机械重复。
3. 全局视角优先：修改共享函数前先 grep 其全部使用点；处理边界情况并明确
   错误语义；小步提交、持续验证。
4. 无步数上限：在数百轮迭代、数千次工具调用中持续优化，直到验收标准通过再给结论。
"#;

/// 全局视角阶段（读-析-应：建立代码库地图）
const GLM_GLOBAL_SCAN: &str = r#"【全局视角 · Global Scan】
在修改任何东西之前建立代码库地图：
1. glob 全项目结构，grep 任务关键词定位边界；
2. 读取入口与关键路径（read 用 offset/limit 分块）；
3. 输出：模块边界、调用链、改动影响面、边界与错误语义清单。
不要修改文件。"#;

/// 关键思维终审指令
const GLM_FINAL_REVIEW: &str = r#"【关键思维终审 · Critical Thinking Review】
对本次工程化循环的最终产物做关键思维终审（这是 GLM-5 agentic engineering
的收口环节——反复审视推理、挑出错漏才算完成）：
1. 对照验收标准逐项核验（用工具重新读取实际改动内容）；
2. 构造反例：边界输入、并发/时序、错误路径、发布后回退；
3. 修复发现的问题（写工具可用）；修复后复验一次；
4. 输出结构化的最终交付：改动清单（文件:摘要）、验证证据、遗留风险与建议。"#;

pub async fn run<F>(input: AgentLoopInput, mut on_event: F) -> Result<AgentLoopOutput, String>
where
    F: FnMut(AgentEvent) + Send,
{
    let mut events: Vec<AgentEvent> = Vec::new();
    let mut phases: Vec<crate::ai::workflow::PhaseResult> = Vec::new();

    // 1. 全局视角（读-析-应）
    let scan = run_phase(
        clone_for_phase(&input),
        10,
        None,
        Some(GLM_GLOBAL_SCAN.to_string()),
        false,
        &mut on_event,
    )
    .await?;
    phases.push(scan.clone());
    emit(
        &mut events,
        AgentEvent::new(AgentEventKind::AssistantText {
            content: format!("🗺️ 【DSG · 全局视角】\n{}\n", scan.content),
        }),
        &mut on_event,
    );

    // 2. 工程化主循环（无步数上限 + 长程自审）
    let main = run_phase(
        clone_for_phase(&input),
        0,
        Some(GLM_ENGINEERING_PREAMBLE.to_string()),
        None,
        true,
        &mut on_event,
    )
    .await?;
    phases.push(main);

    // 3. 关键思维终审
    let review = run_phase(
        clone_for_phase(&input),
        20,
        None,
        Some(GLM_FINAL_REVIEW.to_string()),
        false,
        &mut on_event,
    )
    .await?;
    phases.push(review);

    let mut output = assemble_output(
        &input,
        &phases,
        events,
        est_tokens(&input.user_message) + est_tokens(GLM_ENGINEERING_PREAMBLE),
    );
    let done = AgentEvent::new(AgentEventKind::Done {
        content: output.final_content.clone(),
        total_iterations: output.total_iterations,
        total_tool_calls: output.total_tool_calls,
        reasoning_content: None,
    });
    output.events.push(done.clone());
    on_event(done);
    Ok(output)
}
