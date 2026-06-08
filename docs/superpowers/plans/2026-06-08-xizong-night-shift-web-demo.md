# Xizong Night Shift Web Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first deployable static Web vertical slice for `胸痛夜班：STEMI 复诊链`, including a playable battle loop, local tests, and GitHub Pages Actions deployment.

**Architecture:** Use a dependency-free static app under `site/`. Keep deterministic game behavior in small ES modules under `site/src/`, visual layout in HTML/CSS, and verification scripts/tests outside the site folder. Deploy the static `site/` folder directly through GitHub Pages Actions.

**Tech Stack:** HTML, CSS, vanilla ES modules, Node.js built-in test runner, GitHub Actions Pages.

---

### Task 1: Project Skeleton And Deployment

**Files:**
- Create: `.gitignore`
- Create: `package.json`
- Create: `.github/workflows/deploy-pages.yml`
- Create: `scripts/verify-site.mjs`

- [ ] **Step 1: Create site verification script**

`scripts/verify-site.mjs` should assert `site/index.html`, `site/styles.css`, and required `site/src/*.js` files exist once later tasks create them.

- [ ] **Step 2: Create package scripts**

`package.json` should expose `test`, `build`, and `check`. `build` runs the site verification script. `check` runs tests then build.

- [ ] **Step 3: Create GitHub Pages workflow**

Workflow should run on push to `main`, run `npm test`, run `npm run build`, upload `site/`, and deploy with official Pages actions.

- [ ] **Step 4: Create ignore rules**

Ignore Node logs, dependency folders, build outputs, temp files, and OS metadata.

### Task 2: Battle Engine Test First

**Files:**
- Create: `tests/battle-engine.test.js`
- Create: `site/src/game-data.js`
- Create: `site/src/battle-engine.js`

- [ ] **Step 1: Write failing tests**

Tests should cover:
- ECG reveals ST elevation and lowers uncertainty.
- Aspirin before dissection is excluded increases bleeding risk.
- Nitroglycerin during RV infarct or hypotension worsens stability.
- PCI after STEMI diagnosis stabilizes the patient and creates an A/S outcome.

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/battle-engine.test.js`  
Expected: fail because modules do not exist yet.

- [ ] **Step 3: Implement minimal game data and engine**

Create card definitions, initial case state, `playCard`, `getAvailableCards`, and `gradeCase`.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `node --test tests/battle-engine.test.js`  
Expected: all tests pass.

### Task 3: Playable Static UI

**Files:**
- Create: `site/index.html`
- Create: `site/styles.css`
- Create: `site/src/app.js`

- [ ] **Step 1: Build clinical night-shift strategy layout**

Use the first-batch visual direction: left queue, central patient board, right vitals/orders, bottom hand cards, debrief panel.

- [ ] **Step 2: Connect UI to BattleEngine**

Render cards from data, let players click cards, update vitals, logs, reports, risk meters, and outcome.

- [ ] **Step 3: Add deterministic restart and debrief**

Player can reset the case, see grade, explanation, mistakes, and exam points.

- [ ] **Step 4: Keep generated image text out of UI**

Use visual assets only as background/illustration references where practical; all medical terms and numbers should be rendered by frontend text.

### Task 4: Verification And Git Setup

**Files:**
- Modify: local Git metadata only if `.git` does not exist.

- [ ] **Step 1: Run tests**

Run: `npm test`  
Expected: Node test runner reports all tests passing.

- [ ] **Step 2: Run build verification**

Run: `npm run build`  
Expected: site verifier passes.

- [ ] **Step 3: Initialize Git if needed**

If `.git` does not exist, run `git init -b main`, add remote `https://github.com/feibo123132/yixuegaming.git`, and prepare the first commit.

- [ ] **Step 4: Report push command**

If authentication blocks push, provide exact PowerShell commands for the user.
