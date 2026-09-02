# PROVENANCE — QwenLM/qwen-code (vendor snapshot)

- **Upstream repository:** https://github.com/QwenLM/qwen-code
- **License:** Apache-2.0 (see `vendor/qwen-code/LICENSE`; upstream LICENSE contains the standard Apache 2.0 text plus boilerplate attributed to "Copyright 2025 Google LLC" and "Copyright 2025 Qwen" — Qwen Code derives from Google Gemini CLI v0.8.2)
- **Commit (HEAD of `main` at fetch time):** `867bb94a1f317e6fae04c2f5b78961b42e030311`
  - Source of SHA: https://github.com/QwenLM/qwen-code/commits/main.atom (first `<entry>`: `fix(cli): prune channels for removed workspaces (#10796)`, updated 2026-09-02T13:39:30Z). The `api.github.com` commits endpoint was rate-limited (HTTP 403) during this fetch, so the Atom feed of `main` was used; it reflects the same head commit.
- **Fetch date:** 2026-09-02
- **Fetch method:** `web_fetch` only (curl / Invoke-WebRequest blocked by task). Files below were saved **verbatim** from `https://raw.githubusercontent.com/QwenLM/qwen-code/main/<path>`, preserving exact bytes as returned by the fetch tool (including upstream license header comments and trailing source content).

## Saved files

| Local path (relative to `vendor/qwen-code/`) | Upstream path (`packages/core/src/…`) | Size (bytes) |
|---|---|---|
| `LICENSE` | `LICENSE` | 11,362 |
| `AGENTS.md` | `AGENTS.md` | 15,180 |
| `README.md` | `README.md` | 11,082 |
| `core/src/index.ts` | `packages/core/src/index.ts` | 27,312 |
| `core/src/core/turn.ts` | `packages/core/src/core/turn.ts` | 29,094 |
| `core/src/core/plan-mode-shell-policy.ts` | `packages/core/src/core/plan-mode-shell-policy.ts` | 10,319 |
| `core/src/core/plan-mode-entry-policy.ts` | `packages/core/src/core/plan-mode-entry-policy.ts` | 1,194 |
| `core/src/agents/forkedAgent.ts` | `packages/core/src/agents/forkedAgent.ts` | 28,625 |
| `core/src/tools/agent/fork-subagent.ts` | `packages/core/src/tools/agent/fork-subagent.ts` | 17,123 |

### Selection rationale

The three `api.github.com/contents/…` listing calls (`core/`, `agents/`, `subagents/`) all returned **HTTP 403 "API rate limit exceeded"** for the unauthenticated egress IP, so directory listings could not be consumed. Key-file candidates were instead traced through the repository's own root barrel (`core/src/index.ts`, fetched verbatim), which enumerates every module: `core/turn.js` (agent loop), `core/plan-mode-shell-policy.js` and `core/plan-mode-entry-policy.js` (planning mode), `agents/forkedAgent.js` (forked execution primitive), `tools/agent/fork-subagent.js` (fork/team orchestration). These are the smallest files containing the loop/planning/team logic; index barrels and test files were deliberately avoided. Two fetch attempts for `tools/agent/agent.ts` and `tools/team-plan-approval.ts` failed transiently (`TypeError: fetch failed`) on both attempts, so the corresponding logic is covered via `fork-subagent.ts` (spawn directive, tool allowlist, worktree isolation) and `plan-mode-shell-policy.ts` / `plan-mode-entry-policy.ts`. No saved file was truncated: each fetch returned the complete upstream file (ending at its closing brace / EOF marker).

## Technical summary — Qwen Code agent workflow

**Agent loop.** The turn-level loop is `Turn` (`core/turn.ts`): `Turn.run(model, req, signal)` is an async generator over `LlmChat.sendMessageStream`, yielding `ServerLlmStreamEvent`s (typed by `LlmEventType`: `Content`, `Thought`, `ToolCallRequest`, `ToolCallResponse`, `ToolCallConfirmation`, `Finished`, `LoopDetected`, `ChatCompressed`, `Retry`, `ModelFallback`, …). Each provider chunk is scanned for `functionCalls`; each call becomes a `ToolCallRequestInfo` (`callId`, `providerCallId`, `name`, `args`, `prompt_id`, `response_id`, `wasOutputTruncated`, optional `goalContext`) pushed onto `pendingToolCalls`. Streaming ends with `Finished` carrying `finishReason` and usage metadata; `MAX_TOKENS` truncation marks pending calls truncated. Retry/fallback/compression events reset pending state. Loop budgets: the harness evaluation uses `max_iterations=500` + `runtime_timeout_sec=7200` (README), forks cap at `FORK_DEFAULT_MAX_TURNS = 200`, and agent-path runs accept `max_turns` / `max_time_minutes` via `RunConfig` into `AgentHeadless`. Duplicate provider tool-call ids are blocked by a circuit breaker (`createDuplicateProviderToolCallResponse`, `findRepeatedDuplicateProviderToolCall`).

**Tool-result feedback.** Executed tools produce `ToolCallResponseInfo` (`responseParts`, `resultDisplay`, `errorType`, `executionStatus`, `persistedOutputFiles`, `terminateTurn`, artifacts) — function responses are appended to chat history so the model sees outputs next turn. `AgentEventEmitter` (`AgentEventType.TOOL_CALL` / `TOOL_RESULT`) lets callers track touched/written files; `loopDetectionService` (`DEFAULT_MAX_TOOL_CALLS_PER_TURN`, `GLOBAL_DUPLICATE_THRESHOLD`, `shouldHaltOnTurnToolCallCap`) detects repeated loops and emits `LoopDetected`.

**Planning mode.** `enter_plan_mode` is an execution boundary: `findPlanModeEntryBatchBoundaryIndex` skips sibling tool calls in the same batch (`PLAN_MODE_ENTRY_SIBLING_SKIP_MESSAGE`), and `getPlanModeLifecyclePrefix` binds mode reminders. In `ApprovalMode.PLAN`, `plan-mode-shell-policy.ts` evaluates each shell/monitor command: `evaluatePlanModeShellPolicy` classifies it (`classifyShellCommandSafety(InDirectory)`) as read-only / state-modifying / unknown; state-modifying commands are blocked (`WRITE_BLOCK_MESSAGE`), unknown ones require a one-shot `ProceedOnce` approval (`hideAlwaysAllow`, `hideModify`, `skipIdeDiff`, warnings). `validatePlanModeShellContext` / `validatePlanModeShellApproval` re-validate a snapshot (`approvalModeRevision`, permission evaluation, exact args/invocation) and invalidate stale approvals (`STALE_APPROVAL_MESSAGE`) — the plan is produced via read-only investigation, executed only after `exit_plan_mode` approval returns to normal mode.

**Team / parallel orchestration.** Sub-agents spawn through the `agent` tool (`AgentTool`), with `subagent_type: "fork"` (`FORK_SUBAGENT_TYPE`) for parallel workers: `fork-subagent.ts` builds the child directive (`buildChildMessage` — `<fork-boilerplate>` rules, tool restriction allowlist, 500-word `Scope:/Result:/Key files:/Files changed:/Verification:/Issues:` report), selects parent history by real user turns (`selectForkHistory`, `forkTurns`), and closes open function calls with placeholders (`buildForkedMessages`). Forks run detached in the background registry (parent notified on completion; headless mode waits), permissions bubble via `BUBBLE_APPROVAL_MODE`, nested forks are rejected via an `AsyncLocalStorage` marker, and `isolation: 'worktree'` adds worktree confinement notices. `agents/forkedAgent.ts` (`runForkedAgent`) provides two primitives: a shared-prompt-cache single-turn path (`CacheSafeParams`, `createForkedChat`, NO_TOOLS) and an isolated multi-turn `AgentHeadless` path (YOLO approval override, `MAX_TURNS`/`MAX_TIME`), returning `ForkedAgentResult { status: completed|failed|cancelled, terminateReason: GOAL|CANCELLED|…, filesTouched, filesWritten }`; early completion after the first successful write aborts the loop deterministically.
