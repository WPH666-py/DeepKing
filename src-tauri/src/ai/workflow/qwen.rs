// ═══════════════════════════════════════════════════════════════════
// DSQ 工作流引擎 — Qwen Code 原装工作流（Planning + Agent Team）
//
// 上游：github.com/QwenLM/qwen-code（Apache-2.0）
//   - packages/core：Agent 会话与循环；规划(planning)、团队/并行子智能体
//     编排、MCP 工具、持久化会话。
//   - AGENTS.md（随仓 vendor/qwen-code/AGENTS.md）：Qwen Code 的真实开发
//     工作流 = 技能编排 —— /feat-dev（调研 → 设计 → 测试计划 → 预演 →
//     实现 → 验证 → 自我审计 → 代码审查 → 迭代）、/bugfix（先复现）、
//     /review（证据导向审查）、test-engineer（独立验证）、
//     "Simplicity First"（最小代码解决当前问题）。
//
// DeepKing 集成方式：调研(investigate) → 设计+测试计划(design) →
// 实现(implement，主阶段) → 验证(verify，失败则修复重跑) →
// 自我审计(self-audit，两次连续 clean pass) —— 全部运行在 DeepSeek 运行时上。
// 原版源码随仓保存于 vendor/qwen-code/。
// ═══════════════════════════════════════════════════════════════════

use crate::ai::agent_loop::{AgentEvent, AgentEventKind, AgentLoopInput, AgentLoopOutput};
use crate::ai::workflow::{assemble_output, clone_for_phase, emit, est_tokens, run_phase, text_call};

/// 调研阶段（Qwen Code /feat-dev 的 investigate：先摸清代码库）
const QWEN_INVESTIGATE: &str = r#"【调研阶段 · investigate】
先摸清目标代码库（未开始任何修改）：
1. glob 列出项目结构，grep 找到任务相关的入口/关键文件；
2. 读取关键文件理解现有模式与约定；
3. 输出调研结论：入口点、关键文件清单、可复用模式、潜在风险。
不要修改任何文件。"#;

/// 设计与测试计划（Qwen Code /feat-dev 的 design + test plan）
const QWEN_DESIGN_SYSTEM: &str = r#"You are the design step of Qwen Code's /feat-dev skill (QwenLM/qwen-code).
Given the task and the investigation summary, output:
```
【设计文档】implementation plan: files to create/modify, responsibilities, data flow
【测试计划】behavioral verification: what to run, expected results
【验收标准】checklist
```
Keep it concrete and minimal — Simplicity First: minimum code that solves the problem, nothing speculative."#;

/// 实现阶段的纪律（Qwen AGENTS.md Working Principles 原文要点 +
/// core/turn.ts 循环检测 + plan-mode 只读纪律 + fork 子智能体报告格式）
const QWEN_IMPLEMENT_PREAMBLE: &str = r#"
## Qwen Code 原装实现纪律（Simplicity First）
- 最小代码解决当前问题，不做投机性扩展、不为单次使用做抽象；
- 不提供未被要求的功能/配置；不为不可能场景写错误处理；
- 若写了 200 行而 50 行能完成，请重写；问自己：资深工程师会觉得过度设计吗？
- 镜像现有项目风格：先读相似文件，再写一致代码。
- 计划模式（plan mode）纪律：调研阶段只读（shell 仅限只读命令）；
  进入实现阶段后（enter_plan_mode 之后）才允许改文件/执行状态修改命令；
  退出计划模式前说明验收标准（对齐 plan-mode-shell-policy 的 read-only 分类）。
- 循环检测（loopDetection）：同一工具调用若连续重复（或整体调用数越过阈值），
  停止原路径并换方案——不要原地打转；重复的工具调用 ID 视为断路器。
- 委托子智能体时使用 Qwen fork-subagent 报告格式：Scope / Result / Key files /
  Files changed / Verification / Issues（子智能体结论直接回传）。
- 实现完成后进行构建/类型检查，避免回归。
"#;

/// 验证阶段指令（Qwen Code /feat-dev 的 verify：跑测试/构建并修复）
const QWEN_VERIFY: &str = r#"【验证阶段 · verify】
基于实现结果进行行为验证：
1. 找到测试/构建入口（package.json scripts、Makefile、pytest 等），用 bash 运行；
2. 运行失败 → 读取报错 → 修复 → 重新运行；
3. 重复直到验证通过或连续两次失败（两次失败则切换到其他方案并说明原因）。
最后输出：运行了什么、结果如何、遗留问题。"#;

/// 自我审计阶段（Qwen Code AGENTS.md：两次连续 clean pass）
const QWEN_SELF_AUDIT: &str = r#"【自我审计 · self-audit】
按 Qwen Code 规则审计本次全部变更（读完整 diff，不预设目标地通读）：
1. 逐项核对测试计划与验收标准；
2. 审查每个改动与每条绿色测试证据时，预设它可能是错的（通过≠正确）；
3. 直到连续两次干净通过（clean pass）——一次干净通过只能证明这次通过；
4. 若第二轮仍无收敛（共约五轮），如实说明而不能声称完成；
5. 发现问题即修复并重跑验证。
最后输出审计结论与最终交付摘要。"#;

pub async fn run<F>(input: AgentLoopInput, mut on_event: F) -> Result<AgentLoopOutput, String>
where
    F: FnMut(AgentEvent) + Send,
{
    let mut events: Vec<AgentEvent> = Vec::new();
    let mut phases: Vec<crate::ai::workflow::PhaseResult> = Vec::new();

    // 1. 调研
    let investigate = run_phase(
        clone_for_phase(&input),
        12,
        None,
        Some(QWEN_INVESTIGATE.to_string()),
        false,
        &mut on_event,
    )
    .await?;
    phases.push(investigate.clone());
    emit(
        &mut events,
        AgentEvent::new(AgentEventKind::AssistantText {
            content: format!("🔎 【DSQ · 调研结论】\n{}\n", investigate.content),
        }),
        &mut on_event,
    );

    // 2. 设计 + 测试计划（纯文本规划）
    let design = text_call(
        &input.deepseek,
        QWEN_DESIGN_SYSTEM,
        &format!(
            "任务：\n{}\n\n调研结论：\n{}",
            input.user_message, investigate.content
        ),
    )
    .await?;
    emit(
        &mut events,
        AgentEvent::new(AgentEventKind::AssistantText {
            content: format!("📐 【DSQ · 设计与测试计划】\n{}\n", design),
        }),
        &mut on_event,
    );

    // 3. 实现（主阶段，无步数上限）
    let implement = run_phase(
        clone_for_phase(&input),
        0,
        Some(format!("{}\n【设计文档】\n{}", QWEN_IMPLEMENT_PREAMBLE, design)),
        None,
        true,
        &mut on_event,
    )
    .await?;
    phases.push(implement.clone());

    // 4. 验证 + 修复（失败诊断标志则多跑一轮；最多两轮）
    let mut verify = run_phase(
        clone_for_phase(&input),
        15,
        None,
        Some(QWEN_VERIFY.to_string()),
        false,
        &mut on_event,
    )
    .await?;
    let failed_indicators = ["失败", "FAIL", "FAILED", "error", "Error", "未通过", "不通过", "failing"];
    if failed_indicators.iter().any(|k| verify.content.contains(k)) {
        let round2 = run_phase(
            clone_for_phase(&input),
            15,
            None,
            Some(format!("{}（上一轮验证仍有失败项，继续修复至全部通过）", QWEN_VERIFY)),
            false,
            &mut on_event,
        )
        .await?;
        verify = round2;
    }
    phases.push(verify.clone());

    // 5. 自我审计（两次连续 clean pass）
    let audit = run_phase(
        clone_for_phase(&input),
        15,
        None,
        Some(QWEN_SELF_AUDIT.to_string()),
        false,
        &mut on_event,
    )
    .await?;
    phases.push(audit);

    let mut output = assemble_output(
        &input,
        &phases,
        events,
        est_tokens(&input.user_message) + est_tokens(&design),
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
