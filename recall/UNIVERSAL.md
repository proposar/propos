# Use Recall in any project

Recall is **not** tied to one repo. Use the same flow in every project.

## 1. Copy Recall into a project

Copy the whole `recall/` folder to the **root** of any repo (Node, Next, React, Vue, backend-only, etc.).

## 2. Add scripts to that project’s package.json

```json
"recall:init": "node recall/scripts/init.mjs",
"recall:snapshot": "node recall/scripts/generate-snapshot.mjs",
"recall:update": "node recall/scripts/update-context.mjs"
```

If the project has no package.json, you can still run from repo root:

```bash
node recall/scripts/init.mjs
node recall/scripts/generate-snapshot.mjs
```

(Project root = folder that contains `recall/`.)

## 3. Bootstrap context (once per project)

```bash
npm run recall:init
npm run recall:snapshot
```

- **init** — Creates `recall/context.json` from `package.json` (name, description) and common dirs (app, src, lib, docs, …). Same script for every project.
- **snapshot** — Fills in key files and recent git commits. No need to “read entire code.”

## 4. Use the same workflow everywhere

- **Any AI:** Read `recall/context.json` (and optionally `recall/CONTEXT.md`) first.
- **When handing off:** Run `npm run recall:update -- --focus "..." --change "..."` so the next tool/session sees the new state.

One convention, all projects, all tools.
