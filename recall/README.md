# Recall — One Context for All Your Tools (and AI-to-AI)

**Recall** lets you stop re-explaining your project to every AI (Cursor, Copilot, Trae, Antigravity, etc.). It has both **human docs** and **coded, machine-readable context** so AIs can read and update state without re-scanning the whole repo.

**Recall is universal:** copy the `recall/` folder into **any** project (any repo, any stack). Run `recall:init` or `recall:snapshot` once to bootstrap; the same workflow works everywhere.

---

## The problem

You use many tools. Every new chat = explain again what you're building, what's pending, and where things live. That’s slow and things can collapse if each AI re-interprets the whole codebase differently.

---

## Solution: one context, human + machine

1. **Human-readable** (for you and for AIs that prefer prose):
   - `CONTEXT.md` — what the project is, stack, rules, where things live.
   - `PENDING.md` — current focus, next steps, notes for next session.

2. **Machine-readable** (so AI-to-AI stays consistent):
   - `context.json` — structured context (one-liner, stack, currentFocus, pendingTasks, keyPaths, rules, snapshot).
   - `schema.json` — JSON Schema so any AI can validate and safely update `context.json`.

3. **Scripts** (so AIs don’t have to “read the entire code”):
   - **Generate snapshot:** `npm run recall:snapshot` (or `node recall/scripts/generate-snapshot.mjs`)  
     Builds a fingerprint: key dirs/files (app, lib, docs), recent git commits. Writes it into `context.json` under `snapshot`.  
     **Use this:** “Run `npm run recall:snapshot` then read `recall/context.json`” instead of “read the whole repo.”
   - **Update context:** `npm run recall:update -- --focus "Implement FAQ"` or `--pending "Add Redis rate limit"` or `--change "Fixed landing CTA"`.  
     Updates `currentFocus`, `pendingTasks`, or `recentChanges` in `context.json` so the *next* AI sees what this one did.
   - **Init (universal):** `npm run recall:init` (or `node recall/scripts/init.mjs`)  
     In a **new** project (or after copying `recall/` into another repo), run this once. It creates `context.json` from `package.json` + folder scan (no project-specific defaults). Then run `recall:snapshot` to add keyFiles and commits.

---

## Universal use: Recall in any project

1. **Copy** the entire `recall/` folder into your project root (any repo).
2. **Add npm scripts** to that project’s `package.json`:
   ```json
   "recall:init": "node recall/scripts/init.mjs",
   "recall:snapshot": "node recall/scripts/generate-snapshot.mjs",
   "recall:update": "node recall/scripts/update-context.mjs"
   ```
3. **Bootstrap:** Run `npm run recall:init` (creates `context.json` from package.json + dirs). Then `npm run recall:snapshot` to add keyFiles and recent commits.
4. **Edit** `recall/CONTEXT.md` and `recall/context.json` (oneLiner, rules) for that project. From then on, same workflow: any AI reads `context.json`, runs snapshot when needed, runs update when handing off.

Scripts detect project root as the parent of `recall/`, so they work in any repo.

---

## How AIs should use Recall

**When starting a session:**

1. Read `recall/context.json` (and optionally `recall/CONTEXT.md`).
2. If context feels stale, run `npm run recall:snapshot` and re-read `recall/context.json`.
3. Use `context.json.keyPaths` and `context.json.snapshot.keyFiles` to know where to look; don’t assume “read entire codebase.”

**When finishing a task or handing off:**

1. Update context so the next AI (or human) knows the new state:
   - `npm run recall:update -- --focus "Next: add FAQ section" --change "Landing CTA updated"`.
   - Or edit `recall/context.json` (keep it valid per `recall/schema.json`) and/or `recall/PENDING.md`.

---

## Files in this folder

| File | Purpose |
|------|--------|
| `PROBLEM.md` | Why Recall exists. |
| `README.md` | This file. |
| `CONTEXT.md` | Human “read this first” — project summary, stack, rules. |
| `PENDING.md` | Current focus + next steps (template). |
| `schema.json` | JSON Schema for `context.json` (AI-to-AI contract). |
| `context.json` | **Machine-readable context** + optional `snapshot` from generate-snapshot. |
| `scripts/init.mjs` | **Universal bootstrap:** creates context.json from package.json + folder scan; run via `npm run recall:init` in any project. |
| `scripts/generate-snapshot.mjs` | Builds codebase fingerprint; run via `npm run recall:snapshot`. Works in any repo. |
| `scripts/update-context.mjs` | Updates focus/pending/change in context.json; run via `npm run recall:update`. |

---

## Cursor / Copilot / Trae / Antigravity

In any tool, you can say:

- *“Before answering, read `recall/context.json` and `recall/CONTEXT.md`. If you need a fresh codebase summary, run `npm run recall:snapshot` and use the `snapshot` in context.json.”*
- *“When we’re done, run `npm run recall:update -- --focus \"...\" --change \"...\"` so the next session knows what we did.”*

That way **AI-to-AI** understanding goes through one structured file and one snapshot, instead of re-scanning everything and risking collapse.
