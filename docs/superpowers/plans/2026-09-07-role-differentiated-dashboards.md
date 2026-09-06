# Role-Differentiated Dashboards (Learner, Trainer, Admin) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform StatVidya's dashboard from a single, generic view into 3 distinct, role-differentiated dashboard layouts (**Learner**, **Trainer**, **Admin**) strictly grounded in `PRD.md` (Sections 4, 5, 6, 9.4.5, 10, 11) and styled with the rich, non-animated GovTech Bento aesthetic from the user's reference designs.

**Architecture:** A top-level `RoleDashboardRouter` inspects the active user persona's role (`learner` | `trainer` | `admin`) and dispatches to 3 dedicated, purpose-built dashboard components (`LearnerDashboard`, `TrainerDashboard`, `AdminDashboard`). Each dashboard is composed of specialized widgets matching its PRD functional requirements and user journey.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, `next-intl` (English + Hindi), Vitest.

**Spec Reference:** `PRD.md` Sections 5, 6, 9.4.5, 10, 11 (FR-COMP-1..6, FR-CONTENT-1..11, FR-ADMIN-1..5, FR-TRUST-1, FR-OFFLINE-1..4).

---

## Global Constraints

- **Zero heavy animations**: No WebGL, 3D Canvas, bouncing orbs, or framer-motion loops. Rely exclusively on CSS grid, subtle borders (`border-[#BF9B7A]/30`), rich contrast focus cards, and tactile hover states (`hover:scale-102`).
- **Color Palette**: Locked StatVidya GovTech palette:
  - Deep Moss: `#555934`
  - Warm Cream: `#FAF6F0` (card surface) and `#F2E6D8` (page canvas)
  - Sand / Ochre: `#BF9B7A`
  - Earth Brown: `#8C5B3E`
  - Deep Espresso / Slate: `#2d1f17` (used for high-contrast focus cards)
  - Amber Accent: `#F8C858`
- **Data Provenance**: Every metric, competency, and question card must display a valid provenance badge (`FR-TRUST-1`).
- **Zero TypeScript / ESLint Regressions**: Must pass `npx tsc --noEmit`, `npm run lint`, and all Vitest unit tests.

---

## File Structure Map

```
src/
├── components/
│   └── dashboard/
│       ├── RoleDashboardRouter.tsx                [NEW: Dispatches by user.role / persona]
│       ├── learner/
│       │   ├── LearnerDashboard.tsx               [NEW: Layer 1 Learner view]
│       │   ├── LearnerKpiStrip.tsx                [NEW: 5-card pastel KPI strip]
│       │   ├── LearnerHeroBento.tsx               [NEW: Officer Card + Dark Slate Field Schedule]
│       │   ├── PriorityGapsCard.tsx               [NEW: FRAC Activity-linked severity gaps]
│       │   ├── LearnerCoursesTable.tsx            [NEW: Tabular module progression]
│       │   └── MoSPIFieldManualsShelf.tsx         [NEW: Editorial official manuals shelf]
│       ├── trainer/
│       │   ├── TrainerDashboard.tsx               [NEW: Layer 2 Trainer view]
│       │   ├── TrainerKpiStrip.tsx                [NEW: Ingestion & QA throughput metrics]
│       │   ├── TrainerReviewTriageCard.tsx        [NEW: Live low-confidence question deck]
│       │   ├── TraineeErrorHeatmap.tsx            [NEW: Curriculum failure rate histogram]
│       │   ├── IngestedDocumentsLedger.tsx        [NEW: Tabular document & chunking ledger]
│       │   └── TrainerPublishingBar.tsx           [NEW: Action bar for question bank sync]
│       └── admin/
│           ├── AdminDashboard.tsx                 [NEW: Layer 3 Admin view]
│           ├── AdminKpiStrip.tsx                  [NEW: National macro governance KPIs]
│           ├── AdminAiNarrativeBox.tsx            [NEW: AI executive narrative summary]
│           ├── OutcomeCorrelationChart.tsx        [NEW: PRD Lever 2 Scrutiny Error Chart]
│           ├── DepartmentBreakdownTable.tsx       [NEW: Division health + Flag write-back]
│           └── AdminCabinetDrawer.tsx             [NEW: Ministerial export buttons]
└── app/(app)/dashboard/
    └── DashboardClient.tsx                        [MODIFY: Delegate to RoleDashboardRouter]
```

---

## Proposed Tasks

### Task 1: Create Role Router & Core Type Helpers

**Files:**
- Create: `src/components/dashboard/RoleDashboardRouter.tsx`
- Modify: `src/lib/types.ts`
- Test: `src/components/dashboard/RoleDashboardRouter.test.tsx`

**Interfaces:**
- Consumes: `user` object from `DashboardProps` containing `role`, `user_metadata`, `app_metadata`.
- Produces: `<RoleDashboardRouter user={user} />` rendering `LearnerDashboard`, `TrainerDashboard`, or `AdminDashboard`.

- [x] **Step 1: Write the failing unit test**
  Test role detection: learner renders learner container, trainer renders trainer container, admin renders admin container.
- [x] **Step 2: Run test to verify it fails**
  Run `npx vitest run src/components/dashboard/RoleDashboardRouter.test.tsx`.
- [x] **Step 3: Implement `RoleDashboardRouter.tsx`**
  Resolve role from user metadata, cookie fallback, and render the appropriate container.
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit**

---

### Task 2: Build Layer 1 — Learner Dashboard (Cadre Officers)

**Files:**
- Create: `src/components/dashboard/learner/LearnerDashboard.tsx`
- Create: `src/components/dashboard/learner/LearnerKpiStrip.tsx`
- Create: `src/components/dashboard/learner/LearnerHeroBento.tsx`
- Create: `src/components/dashboard/learner/PriorityGapsCard.tsx`
- Create: `src/components/dashboard/learner/LearnerCoursesTable.tsx`
- Create: `src/components/dashboard/learner/MoSPIFieldManualsShelf.tsx`
- Test: `src/components/dashboard/learner/LearnerDashboard.test.tsx`

**Key PRD Requirements Implemented:**
- **FR-COMP-1 & 2**: Severity formula `(Target - Current) * Weight` (`HIGH 🔴`, `MODERATE ⚠️`, `PROFICIENT ✅`).
- **FR-COMP-4**: Explicit **FRAC Activity** attribution on each gap card.
- **FR-PROFILE-2**: Distinguishes 🛡️ *Verified* vs ✍️ *Self-Assessed* levels.
- **FR-PWA-1 & Lever 1**: Prominent CAPI offline sync indicator and Hindi-first toggle for Sunita Devi (Field Investigator).
- **FR-REC-1**: Ranked iGOT Karmayogi course recommendations with Karma Points.
- **Visual Style**: Pastel 5-card KPI strip (Image 2) + Asymmetric Bento with Dark Slate Field Schedule (Image 1).

- [x] **Step 1: Write the failing unit test**
  Verify readiness calculation, gap ordering by severity, and Hindi translation string rendering.
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement Learner subcomponents & container**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit**

---

### Task 3: Build Layer 2 — Trainer Dashboard (NSSTA Faculty Studio)

**Files:**
- Create: `src/components/dashboard/trainer/TrainerDashboard.tsx`
- Create: `src/components/dashboard/trainer/TrainerKpiStrip.tsx`
- Create: `src/components/dashboard/trainer/TrainerReviewTriageCard.tsx`
- Create: `src/components/dashboard/trainer/TraineeErrorHeatmap.tsx`
- Create: `src/components/dashboard/trainer/IngestedDocumentsLedger.tsx`
- Create: `src/components/dashboard/trainer/TrainerPublishingBar.tsx`
- Test: `src/components/dashboard/trainer/TrainerDashboard.test.tsx`

**Key PRD Requirements Implemented:**
- **FR-CONTENT-7**: Live Question Review Deck sorted low-confidence first with Approve, Edit, Reject, and Bulk-Approve actions.
- **FR-CONTENT-6**: Competency tag validation.
- **FR-CONTENT-8**: Immediate sync to active question bank.
- **FR-CONTENT-11**: Trainee error signal heatmap highlighting curriculum failure points (Schedule 0.0, Multipliers, CAPI Sync).
- **Visual Style**: Image 1 bold metrics + Image 1 focused inspection card + Image 2 document extraction ledger.

- [x] **Step 1: Write the failing unit test**
  Verify question review actions (approve/reject transitions state and updates count).
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement Trainer subcomponents & container**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit**

---

### Task 4: Build Layer 3 — Admin Dashboard (Workforce Intelligence & Policy Command)

**Files:**
- Create: `src/components/dashboard/admin/AdminDashboard.tsx`
- Create: `src/components/dashboard/admin/AdminKpiStrip.tsx`
- Create: `src/components/dashboard/admin/AdminAiNarrativeBox.tsx`
- Create: `src/components/dashboard/admin/OutcomeCorrelationChart.tsx`
- Create: `src/components/dashboard/admin/DepartmentBreakdownTable.tsx`
- Create: `src/components/dashboard/admin/AdminCabinetDrawer.tsx`
- Test: `src/components/dashboard/admin/AdminDashboard.test.tsx`

**Key PRD Requirements Implemented:**
- **FR-ADMIN-1**: Macro organization headcount, average readiness, and trend computed via `adminService.ts`.
- **FR-ADMIN-2**: AI executive narrative summary of gap trends.
- **FR-ADMIN-5 & §9.4.5 (PRD Lever 2)**: Outcome Correlation Scatter Chart connecting Boundary Demarcation level (L1–L5) with Schedule 0.0 Listing Scrutiny Error Rate (%) across 7 Regional Offices (Bihar, UP East, Odisha, Maharashtra, Kerala) with `SYNTHETIC_DEMO_DATA` badge.
- **FR-ADMIN-4**: Live write-back action: **"Flag for Priority Training"** persisting priority state to the department table.
- **Visual Style**: Image 1 dark analytics card + Image 2 governance table.

- [x] **Step 1: Write the failing unit test**
  Verify linear regression coordinates calculation, department breakdown sorting, and priority flag write-back.
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement Admin subcomponents & container**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit**

---

### Task 5: Refactor DashboardClient & Topbar Integration

**Files:**
- Modify: `src/app/(app)/dashboard/DashboardClient.tsx`
- Verify: `src/components/layout/Topbar.tsx` (Persona switcher triggers instant dashboard morphing)

- [x] **Step 1: Wire `RoleDashboardRouter` into `DashboardClient.tsx`**
- [x] **Step 2: Verify zero TypeScript errors (`npx tsc --noEmit`)**
- [x] **Step 3: Verify zero ESLint errors (`npm run lint`)**
- [x] **Step 4: Run full test suite (`npx vitest run`)**
- [x] **Step 5: Commit**

---

### Task 6: Visual & End-to-End Browser Verification

- [x] **Step 1: Launch browser subagent to test Amit Sharma (Learner - Desk Officer)**: Verify pastel KPI strip, dark scrutiny calendar, FRAC gaps with activities, and courses table.
- [x] **Step 2: Switch to Sunita Devi (Learner - Field Investigator)**: Verify Hindi translation, CAPI offline sync status pill, and demarcation drills.
- [x] **Step 3: Switch to Dr. Priya Verma (Trainer - Faculty)**: Verify Question Triage Deck, approve/reject buttons, and document chunking ledger.
- [x] **Step 4: Switch to Rajesh Kumar (Admin - ADG)**: Verify PRD Lever 2 Scrutiny Error Correlation Chart, AI narrative box, and "Flag for Training" write-back action.
- [x] **Step 5: Capture high-res verification screenshots and update `walkthrough.md`**.

---

## Verification Plan

### Automated Tests
- `npx vitest run`: All existing 121 tests + new dashboard tests passing.
- `npx tsc --noEmit`: 0 TypeScript compiler errors.
- `npm run lint`: 0 ESLint warnings or errors.

### Manual / Browser Verification
- Test all 4 personas via Topbar switcher (`Amit Sharma`, `Sunita Devi`, `Dr. Priya Verma`, `Rajesh Kumar`).
- Confirm that the UI layout changes completely according to the 3 roles (`learner`, `trainer`, `admin`).
- Confirm that no heavy animations exist and the page loads instantly with crisp visual richness.
