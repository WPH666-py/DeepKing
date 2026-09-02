# Provenance — GLM-5 / GLM-4.5 vendor snapshot

- Fetch date: **2026-09-02**
- Fetch method: `web_fetch` only (no curl / Invoke-WebRequest). Files were taken from the
  `main` branch at the commit SHAs below and saved verbatim (text-decoded).
- Total upstream fetches: 12 (within the ≤12 target).

## Upstream sources

| # | URL | Purpose |
|---|-----|---------|
| 1 | `https://raw.githubusercontent.com/zai-org/GLM-5/main/LICENSE` | GLM-5 license |
| 2 | `https://raw.githubusercontent.com/zai-org/GLM-5/main/README_zh.md` | GLM-5 repo README (zh) |
| 3 | `https://raw.githubusercontent.com/zai-org/GLM-5/main/skills/glm-master-skill/SKILL.md` | master skill |
| 4 | `https://api.github.com/repos/zai-org/GLM-4.5/contents/?ref=main` | repo listing (root) |
| 5 | `https://api.github.com/repos/zai-org/GLM-5/commits/main` | GLM-5 HEAD SHA |
| 6 | `https://api.github.com/repos/zai-org/GLM-4.5/commits/main` | GLM-4.5 HEAD SHA |
| 7 | `https://api.github.com/repos/zai-org/GLM-4.5/contents/example?ref=main` | attempted listing (HTTP 403, rate limited) |
| 8 | `https://raw.githubusercontent.com/zai-org/GLM-4.5/main/LICENSE` | retry attempt (transient failure) |
| 9 | `https://raw.githubusercontent.com/zai-org/GLM-4.5/main/LICENSE` | GLM-4.5 license |
| 10 | `https://github.com/zai-org/GLM-4.5/tree/main/example` | HTML tree page (truncated) |
| 11 | `https://data.jsdelivr.com/v1/packages/gh/zai-org/GLM-4.5@main` | full file-tree listing (chose `example/claude_code/`) |
| 12 | `https://raw.githubusercontent.com/zai-org/GLM-4.5/main/example/claude_code/README.md` | agentic runtime example |

## Commit SHAs (HEAD of `main` at fetch time)

- **zai-org/GLM-5** — `008de4dbcc220032eb9b80a9a9802afad46a4053`
  (2026-09-01, "Create wechat.png")
- **zai-org/GLM-4.5** — `170f20b2c10659008fdbc909d478bc2a75bc3627`
  (2026-02-01, "requirement changed (#141)")

## Licenses

- GLM-5: **Apache License 2.0** — appendix copyright notice: `Copyright 2026 Z.AI Co., Ltd`
- GLM-4.5: **Apache License 2.0** — appendix copyright notice: `Copyright 2025 Zhipu AI`

## Saved files (all under `vendor\glm-5\`)

| Local path | Upstream path | Source |
|---|---|---|
| `LICENSE` | `LICENSE` | GLM-5 |
| `README_zh.md` | `README_zh.md` | GLM-5 |
| `skills\glm-master-skill\SKILL.md` | `skills/glm-master-skill/SKILL.md` | GLM-5 |
| `glm45\LICENSE` | `LICENSE` | GLM-4.5 |
| `glm45\example\claude_code\README.md` | `example/claude_code/README.md` | GLM-4.5 |

## Technical summary — GLM's agentic-engineering workflow

GLM-5's own framing is "from vibe coding to agentic engineering": the family is explicitly
built for complex systems engineering and long-horizon agent tasks, not single-shot
responses. README_zh.md documents the trajectory: GLM-5 is a 744B/40B-active MoE trained on
28.5T tokens with DeepSeek sparse attention (DSA) plus the in-house async-RL infra
`slime`; GLM-4.5 was the prior 355B/32B generation. Agentic capability rises per release —
GLM-5.1 is described as "designed for longer time-scale agent work": it decomposes vague
problems, designs experiments, interprets results, pinpoints bottlenecks, re-examines its
own reasoning and dynamically adjusts strategy across hundreds of iterations and thousands
of tool calls ("the longer it runs, the better the result"). GLM-5.2 adds a stable 1M-token
context and configurable thinking effort (`reasoning_effort`, `high`/`max`); evaluation is
via CC-Bench-V2 (frontend/backend/long-horizon), SWE-bench Pro, Terminal-Bench and
Vending Bench 2 (a one-year simulated business — long-horizon planning and resource
management).

The `glm-master-skill/SKILL.md` is deliberately documentation-only. It is a frontmatter
(`name`, `description`, `metadata.openclaw` env/bins requirements) catalog that maps intent
to official GLM skills — GLM-OCR (`glmocr`, `glmocr-table`, `glmocr-formula`,
`glmocr-handwriting`, `sdk`), GLM-Image (`glm-image-gen`) and GLM-V (`glmv-caption`,
`glmv-prompt-gen`, `glmv-resume-screen`, `glmv-grounding`, `glmv-doc-based-writing`,
`glmv-pdf-to-ppt`, `glmv-pdf-to-web`, `glmv-prd-to-app`, `glmv-web-replication`). It
executes no scripts or subprocesses; the agent-side workflow it prescribes is: (1) match the
user's intent to a skill in the catalog; (2) install through `npx clawhub@latest install
<skill-name>`; (3) on rate-limit, wait or clone from GitHub source; (4) open that skill's
official `SKILL.md` and follow its instructions. Downstream skills need `ZHIPU_API_KEY` as
an environment variable (limited-scope, never hardcoded). Skills are thus loaded as
directory-based `SKILL.md` instruction files, installed by package manager, and read by the
agent at task time — no local execution.

The GLM-4.5 run/session loop is visible in `example/claude_code/README.md`: GLM-4.5 is
served by SGLang (`--tool-call-parser glm45`, `--reasoning-parser glm45` so tool calls and
reasoning are emitted as structured tokens; EAGLE speculative decoding; port 8000) and
reached through Claude Code + Claude Code Router (`ccr`). Configuration flows
`config.example.json → config.json → ~/.claude-code-router/config.json → ccr restart`, then
`ccr code` starts the session (10-minute API timeout). The transcript shows the agent loop:
natural-language user request → explicit tool calls — `List(.)`, `Read(README.md)`,
`Read(inference/trans_infer_cli.py)`, `Read(requirements.txt)` — then a synthesized answer, a
read-analyze-respond cycle with tool results (path count, line counts) fed back into model
context. Companion files `inference/api_request.py` and `inference/trans_infer_cli.py` are
the non-agentic serve/query utilities the agent reads.
