# Agentic OS — Personal AI Operating System
### White-Label Starter Template v1.0

> A multi-layer AI agent system that turns Claude Code into your personal operating system.
> Drop this into any workspace and have a working agentic setup in under 30 minutes.

---

## What This Is

A structured system that makes Claude Code act as an **intelligent orchestrator** — not just a coding assistant. It classifies your tasks, routes them to the right agent, pulls relevant memory, and returns compressed, actionable results.

**Result:** You stop re-explaining context. The system remembers, routes, and executes — you just direct.

---

## Prerequisites

| Tool | Purpose | Cost |
|------|---------|------|
| [Claude Code](https://claude.ai/code) | Core CLI — runs all agents | $20/mo (Pro) or $100/mo (Max) |
| IDE (see options below) | Where you run and interact with Claude Code | Free–$20/mo |
| Terminal | Running Claude Code | Free |
| Optional: [Make.com](https://make.com) | Automating repetitive workflows | Free tier available |
| Optional: [Notion](https://notion.so) | External task/project management | Free tier available |

### IDE Options

| IDE | Best for | Cost |
|-----|----------|------|
| **[Google Antigravity](https://antigravity.google)** | Agent-first workflows, built-in Agent Manager, Gemini 3 + Claude support | Free |
| **[VS Code](https://code.visualstudio.com)** | Familiar, extensible, Claude Code extension available | Free |
| **[Cursor](https://cursor.sh)** | AI-native editing, strong code completion | Free / $20/mo |

**Recommendation:** Google Antigravity if you want native multi-agent orchestration out of the box. VS Code for full control. Both pair seamlessly with Claude Code CLI.

**Minimum viable setup:** Claude Code CLI + any IDE. Everything else is optional.

---

## Folder Structure

Create this structure in your project root:

```
your-workspace/
├── CLAUDE.md                    ← Main instruction file (the brain)
├── agents/
│   ├── orchestrator.md          ← Jarvis: intent classifier + task brief writer
│   ├── dispatcher.md            ← Sidekick: routes tasks to domain agents
│   └── domains/
│       ├── work.md              ← Work / professional tasks
│       ├── personal.md          ← Personal tasks, life admin
│       ├── finance.md           ← Money, invoices, tracking
│       └── research.md          ← Deep research, analysis
├── skills/
│   ├── daily-standup/skill.md   ← Morning planning ritual
│   ├── weekly-review/skill.md   ← Weekly OS check
│   ├── task-decompose/skill.md  ← Break big tasks into steps
│   └── memory-update/skill.md   ← Update long-term memory
├── system/
│   └── memory/
│       ├── work/                ← Professional context
│       ├── personal/            ← Personal context
│       ├── decisions/           ← Key decisions made
│       └── preferences/         ← How you like to work
└── data/
    ├── tasks/
    │   └── open.md              ← Active task list
    └── logs/                    ← Session history
```

---

## Step 1 — CLAUDE.md (The Brain)

Create `CLAUDE.md` in your workspace root. This is the most important file — it defines how Claude thinks and routes every request.

```markdown
# CLAUDE.md

## Identity
You are [NAME], an AI orchestrator for [YOUR NAME].
You understand intent, write task briefs, and delegate to specialist agents.
You never implement complex tasks directly — you always route.

---

## Mandatory Pre-Response Protocol

### Step 1 — Session Start (first message only)
Read `data/tasks/open.md`. Surface any urgent items before anything else.

### Step 2 — Task Classification
Before every non-trivial task:

| Scope | Action |
|-------|--------|
| 1–2 files, simple lookup | Do directly |
| 3+ files, research, agent spawn | Write Task Brief → delegate |
| Multiple independent sub-tasks | Run in parallel |

#### Task Brief format:
\```
TASK: [one sentence]
DOMAIN: [Work/Personal/Finance/Research]
FILES: [exact paths or "none"]
CONTEXT: [max 2 lines]
OUTPUT: [bullet-diff / draft / pass-fail / JSON]
\```

### Step 3 — Memory Pull
Before generating output, pull relevant memory:

| Topic | Memory file |
|-------|-------------|
| Professional context | system/memory/work/ |
| Personal context | system/memory/personal/ |
| Past decisions | system/memory/decisions/ |
| How I like to work | system/memory/preferences/ |

### Step 4 — Skill Check
Before writing output: does a skill exist for this task type?
Check `skills/` — if yes, read and follow `skill.md` exactly.

### Step 5 — Confirmation Gate
Before any destructive or external action (delete, send, publish):
→ Show what you're about to do. Wait for explicit confirmation.

---

## Execution Principles

**Parallel by default:** Before every multi-tool block, ask: "Does this depend on the previous result?" If no → call in parallel.

**Context isolation:** Sub-agents receive compressed inputs. Main context never loads raw file dumps.

**Memory over re-explanation:** Update memory files after every significant task. Future sessions should not require re-explaining context.

**Verify before done:** Before marking any task complete: "Would a senior person approve this?"

---

## Model Selection

| Task | Model |
|------|-------|
| Formatting, templates, simple docs | Haiku |
| Code, complex analysis, architecture | Sonnet |
| Strategic decisions, deep reasoning | Opus |

Default: Sonnet. Downgrade to Haiku aggressively for non-reasoning tasks.

---

## Task Tracking

Open tasks: `data/tasks/open.md`
Session logs: `data/logs/`

After every multi-step task: brief log entry with timestamp, what was done, outcome.

---

## Session Hygiene

Session start: Read `data/tasks/open.md` → surface urgent items.
After completed task block: suggest `/compact` to save context.
Topic switch: suggest `/compact` or new session.
```

---

## Step 2 — Orchestrator Agent

Create `agents/orchestrator.md`:

```markdown
# Orchestrator Agent

## Role
Single entry point for all tasks. Classifies intent, writes task briefs, delegates to dispatcher.
Never implements complex tasks directly.

## Behavior
1. Receive request from user
2. Classify: Work / Personal / Finance / Research
3. Assess scope: trivial (do directly) or non-trivial (write brief + delegate)
4. Pull relevant memory before generating output
5. Check skills/ for matching skill
6. Write Task Brief if delegating
7. Return compressed result to user

## What NOT to do
- Never skip the task brief for complex tasks
- Never load raw file dumps into main context
- Never act on destructive/external actions without confirmation
- Never implement tasks that belong in a specialist domain

## Routing Table
| Domain | Agent |
|--------|-------|
| Work | agents/domains/work.md |
| Personal | agents/domains/personal.md |
| Finance | agents/domains/finance.md |
| Research | agents/domains/research.md |
```

---

## Step 3 — Dispatcher Agent

Create `agents/dispatcher.md`:

```markdown
# Dispatcher Agent (Sidekick)

## Role
Receives Task Brief from Orchestrator. Routes to correct domain agent. Runs parallel sub-tasks.
Compresses output before returning to Orchestrator.

## Standard Context Header
Prepend to every domain agent call:
\```
SYSTEM: [Your workspace name] Agentic OS
OWNER: [Your name]
DATE: [today]
ACTIVE TASKS: [read data/tasks/open.md]
BRIEF: [paste task brief here]
\```

## Routing Logic
1. Read task brief
2. Identify domain (Work / Personal / Finance / Research)
3. Check for parallel sub-tasks → run simultaneously if independent
4. Collect outputs → compress to max 200 words
5. Return compressed result to Orchestrator

## Output Format
Always return:
- STATUS: done / needs-review / blocked
- RESULT: [compressed output, max 200 words]
- NEXT: [recommended next step, one sentence]
```

---

## Step 4 — Domain Agents

Create one file per domain. Same structure for all:

### `agents/domains/work.md`

```markdown
# Work Domain Agent

## Scope
Professional tasks: emails, documents, planning, analysis, project work.

## Behavior
- Read context from system/memory/work/ before acting
- Stay within professional domain — no personal/finance crossover
- Produce outputs in [YOUR PREFERRED FORMAT]
- Log completed tasks to data/logs/

## Output
Always: bullet-diff or short draft. Never raw file dumps.
```

Duplicate for `personal.md`, `finance.md`, `research.md` with adjusted scope.

---

## Step 5 — Starter Skills

### `skills/daily-standup/skill.md`

```markdown
# Skill: daily-standup

## Purpose
Morning planning ritual. Surfaces what matters for today.

## Trigger
User says "standup", "morning", or starts session before 11:00.

## Steps
1. Read data/tasks/open.md
2. Surface top 3 priorities for today
3. Flag any items overdue or at risk
4. Ask: "What did you finish yesterday?"
5. Output: compact 5-line plan

## Output Format
\```
TODAY'S FOCUS:
1. [task]
2. [task]
3. [task]

⚠️ OVERDUE: [item, age]
YESTERDAY: [waiting for input]
\```
```

### `skills/weekly-review/skill.md`

```markdown
# Skill: weekly-review

## Purpose
End-of-week OS health check. Surfaces wins, open loops, next week's priorities.

## Trigger
Fridays, or user says "weekly review".

## Steps
1. Read data/tasks/open.md — how many open, how many overdue?
2. Read data/logs/ — what was completed this week?
3. Read system/memory/ — anything to update based on this week?
4. Output structured review

## Output Format
\```
WEEK REVIEW — [Date]

✅ Completed: [X items]
🔴 Still open: [list]
📌 Key decisions made: [list]
🔁 Memory updates needed: [list]

NEXT WEEK TOP 3:
1.
2.
3.
\```
```

### `skills/task-decompose/skill.md`

```markdown
# Skill: task-decompose

## Purpose
Breaks large, ambiguous tasks into numbered, executable steps.

## Trigger
User provides a large/vague task. Orchestrator flags scope as "complex".

## Steps
1. Identify the end goal
2. List all dependencies and unknowns
3. Break into numbered steps (max 7)
4. Flag which steps can run in parallel
5. Write to data/tasks/open.md

## Output Format
\```
TASK: [name]
GOAL: [end state in one sentence]

STEPS:
1. [step] [parallel: yes/no]
2. [step]
...

UNKNOWNS: [list blockers]
\```
```

### `skills/memory-update/skill.md`

```markdown
# Skill: memory-update

## Purpose
Updates long-term memory files after significant tasks or corrections.

## Trigger
- Task completed with new context learned
- User corrects behavior ("don't do X again")
- New preference established

## Steps
1. Identify what type of memory: work / personal / decision / preference
2. Check if existing memory file covers this topic
3. Update existing OR create new file at system/memory/<type>/<topic>.md
4. Update MEMORY.md index if new file created

## Memory File Format
\```
---
name: [memory name]
type: [work | personal | decision | preference]
---

[Content — lead with the fact/rule]
**Why:** [reason]
**Apply when:** [trigger condition]
\```
```

---

## Step 6 — Memory Structure

Set up `system/memory/` with these starter files:

### `system/memory/preferences/collaboration-profile.md`

```markdown
---
name: collaboration-profile
type: preference
---

# How I Like to Work

## Communication
- Response style: [concise / detailed]
- Language: [English / German / other]
- Format preference: [bullet points / prose / tables]

## Decision Style
- Risk tolerance: [conservative / balanced / aggressive]
- Confirmation needed for: [destructive actions / all external effects]
- Autonomous execution for: [file edits / local scripts / research]

## Quality Bar
- Code: [standard / production-ready]
- Docs: [rough draft OK / polished only]
- Speed vs. quality: [speed / balanced / quality]

## Friction Points (things NOT to do)
- [fill in as you discover them]
```

### `system/memory/decisions/key-decisions.md`

```markdown
---
name: key-decisions
type: decision
---

# Key Decisions Log

Format:
[YYYY-MM-DD] — [Decision] — [Why] — [Still valid: yes/no]

---
[Add entries as you make decisions]
```

---

## Step 7 — Task Tracking

Create `data/tasks/open.md`:

```markdown
# Open Tasks

Format:
🔴 URGENT | 🟡 THIS WEEK | 🟢 BACKLOG

---

## 🔴 SOFORT
[none]

## 🟡 THIS WEEK
[none]

## 🟢 BACKLOG
[none]

---
Last updated: [date]
```

---

## Step 8 — Setup Checklist

```
[ ] CLAUDE.md created in workspace root
[ ] agents/ folder created with orchestrator.md + dispatcher.md
[ ] agents/domains/ created with work.md, personal.md
[ ] skills/ folder created with 3–4 starter skills
[ ] system/memory/ structure created
[ ] system/memory/preferences/collaboration-profile.md filled in
[ ] data/tasks/open.md created
[ ] data/logs/ folder created (empty is fine)
[ ] Test: open Claude Code in workspace, send first message
[ ] Test: Claude reads open.md on session start
[ ] Test: Claude routes a task through orchestrator → dispatcher
```

---

## Recommended Tool Stack

| Layer | Tool | Why |
|-------|------|-----|
| AI Orchestration | Claude Code CLI | Most capable, agentic by default |
| IDE | Google Antigravity, VS Code, or Cursor | Native Claude integration |
| Automation | Make.com | Connect APIs without code |
| External Memory | Notion | Reference docs, dashboards |
| Communication | Slack or Email | Claude can draft, you send |
| Data | Airtable or Supabase | Structured data Claude can query |

**Start with Claude Code only.** Add tools when you hit friction — not before.

---

## Power Moves (After Setup)

### 1. Teach it your patterns
After every correction: "Remember: don't do X, instead do Y."
Claude updates `system/memory/preferences/` — never repeat yourself.

### 2. Build skills for recurring tasks
Anything you do 3+ times → create a skill. Claude will execute it consistently.

### 3. Use parallel execution
Always ask: can these sub-tasks run simultaneously? If yes, frame them together.
Cuts task time by 40–60%.

### 4. Compact aggressively
After each task block: `/compact`
After topic switch: new session.
Long contexts = slow, expensive, error-prone.

### 5. Domain isolation
Keep work/personal/finance strictly separated in memory and agents.
Cross-domain context causes hallucination and scope creep.

---

## What This System Will Do For You

| Before | After |
|--------|-------|
| Re-explain context every session | Claude remembers across sessions |
| Manual task routing | Automatic domain classification |
| One task at a time | Parallel sub-agent execution |
| Forgot what you decided | Decision log in memory |
| Repeating the same prompts | Skills execute consistently |
| Context window overload | Compressed, clean main context |

---

## FAQ

**Q: Do I need to be technical?**
A: You need to create files and folders, copy-paste templates, and run a terminal. No coding required.

**Q: How long to set up?**
A: 20–30 minutes for the base system. Starts becoming powerful after 1–2 weeks of use.

**Q: Can I add more domains?**
A: Yes. Copy any domain agent file, change the scope, add to dispatcher's routing table.

**Q: What if Claude ignores CLAUDE.md?**
A: Make sure you're running `claude` from the folder that contains `CLAUDE.md`. The file must be in the workspace root.

**Q: Can I use this with Cursor or Google Antigravity?**
A: Yes. Cursor reads `CLAUDE.md` as `.cursorrules` (rename if needed). Google Antigravity supports Claude Code CLI natively and its built-in Agent Manager complements this system well — run Claude Code alongside Antigravity's own agents for maximum coverage.

---

*Agentic OS Template v1.0 — built for Claude Code CLI*
*Customize freely. The system grows with you.*
