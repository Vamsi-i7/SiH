# Role-Gated UI Shell & Navigation Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the entire post-login application shell (`Sidebar`, `Topbar`, `AppLayout`, `Breadcrumb`) into a **strict role-gated GovTech Bento navigation system**, ensuring that **Learners**, **Trainers**, and **Admins** each receive a purpose-built, prestigious navigation experience tailored exclusively to their responsibilities and workflows.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Lucide Icons, `next-intl` (English + Hindi), Vitest.

**Spec Reference:** `docs/superpowers/specs/2026-09-07-role-gated-ui-shell-design.md` and `PRD.md` (Sections 5, 6, 9, 10, 11).

---

## Global Constraints

- **Non-animated GovTech Bento Aesthetic**: Zero framer-motion loops, zero WebGL/3D canvas; rely on tactile hover states, clean borders (`border-[#BF9B7A]/30`), and high-contrast dark slate/espresso focus cards (`#2d1f17`).
- **Color Palette**:
  - Warm Canvas: `#F2E6D8` and `#FAF6F0`
  - Primary Deep Moss: `#555934`
  - Sand / Ochre: `#BF9B7A`
  - Earth Brown: `#8C5B3E`
  - High-Contrast Slate / Focus: `#2d1f17`
  - Amber Accent: `#F8C858`
- **Sub-Page Integrity**: Preserve existing sub-page content structures while elevating the navigation and surrounding shell experience.
- **Zero Regressions**: Must pass `npx tsc --noEmit`, `npm run lint`, and all 167+ Vitest unit tests.

---

## Proposed Changes

```
src/
├── components/
│   └── layout/
│       ├── roleNavigation.ts         [NEW: Role-specific navigation definitions & helpers]
│       ├── roleNavigation.test.ts    [NEW: Unit tests for role navigation filtering]
│       ├── Sidebar.tsx               [MODIFY: Role-gated sidebar with cadre card & footer]
│       ├── Sidebar.test.tsx          [NEW: Unit tests verifying role navigation filtering]
│       ├── Topbar.tsx                [MODIFY: Role-specific status strips & rich GovTech styling]
│       ├── Topbar.test.tsx           [NEW: Unit tests verifying role topbar badges]
│       ├── Breadcrumb.tsx            [MODIFY: Role-aware breadcrumb roots]
│       └── AppLayout.tsx             [MODIFY: Role-aware canvas & layout framing]
```

---

## Tasks

### Task 1: Role Navigation Data Structure & Helpers

**Files:**
- Create: `src/components/layout/roleNavigation.ts`
- Test: `src/components/layout/roleNavigation.test.ts`

- [ ] **Step 1: Write unit tests for role navigation filtering**
  - Verify that `getNavigationForRole('learner')` returns only learner items (`/dashboard`, `/skill-gap`, `/assignments`, `/pathways`, `/profile`).
  - Verify that `getNavigationForRole('trainer')` returns only faculty studio items (`/dashboard`, `/documents`, `/mcq-generator`, `/review-queue`, `/assignments`).
  - Verify that `getNavigationForRole('admin')` returns only executive items (`/dashboard`, `/skill-gap`, `/assignments`).
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `roleNavigation.ts`**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 2: Role-Gated Sidebar with Cadre Identity Card & Status Footer

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/Sidebar.test.tsx`

- [ ] **Step 1: Write unit test for `Sidebar.tsx`**
  - Verify Learner sidebar renders SSS / FOD cadre info and does not render `/documents` or `/review-queue`.
  - Verify Trainer sidebar renders NSSTA Faculty info, `/documents`, and `/review-queue`.
  - Verify Admin sidebar renders MoSPI Executive info.
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `Sidebar.tsx`**
  - Add active persona identity card at the top of the sidebar.
  - Render strictly role-filtered navigation items with active route highlighting (`#555934`).
  - Add role-specific status footer (CAPI offline sync for learners, Vector DB status for trainers, Cabinet protocol for admins).
  - Preserve collapse/expand functionality.
- [ ] **Step 4: Run test to verify it passes**

---

### Task 3: Role-Aware Topbar with Quick Status Strips & Enhanced Switcher

**Files:**
- Modify: `src/components/layout/Topbar.tsx`
- Create: `src/components/layout/Topbar.test.tsx`

- [ ] **Step 1: Write unit test for `Topbar.tsx`**
  - Verify Learner topbar renders Karma Points pill (`+550 KP`) and CAPI sync indicator.
  - Verify Trainer topbar renders QA Triage pending pill (`14 QA Pending`).
  - Verify Admin topbar renders National Readiness index pill (`72.4%`).
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `Topbar.tsx`**
  - Integrate role-specific status pill strip.
  - Upgrade the persona switcher dropdown with distinct role chips (`LEARNER`, `TRAINER`, `ADMIN`).
  - Add quick action shortcuts per role (e.g. "Ingest Manual" for trainer, "Ministerial PDF" for admin).
- [ ] **Step 4: Run test to verify it passes**

---

### Task 4: Role-Aware Breadcrumb & AppLayout Framing

**Files:**
- Modify: `src/components/layout/Breadcrumb.tsx`
- Modify: `src/components/layout/AppLayout.tsx`

- [ ] **Step 1: Update `Breadcrumb.tsx`**
  - Prepend role-aware root labels (e.g., `Learner Workspace`, `NSSTA Faculty Studio`, `Executive Command`).
- [ ] **Step 2: Update `AppLayout.tsx`**
  - Set rich GovTech page canvas (`bg-[#F2E6D8]/40`), subtle borders (`border-[#BF9B7A]/25`), and pass active role context.
- [ ] **Step 3: Verify TypeScript (`npx tsc --noEmit`) and ESLint (`npm run lint`)**

---

### Task 5: Automated & End-to-End Visual Verification

- [ ] **Step 1: Run full Vitest test suite (`npx vitest run`)**
- [ ] **Step 2: Launch browser subagent to verify all 4 personas**
  - Switch to Amit Sharma (Learner): Confirm learner sidebar, Karma points pill, SSS cadre card.
  - Switch to Sunita Devi (Learner - Rural): Confirm Hindi labels and CAPI offline status.
  - Switch to Dr. Priya Verma (Trainer): Confirm NSSTA Faculty sidebar, QA pending pill, absence of learner course menus.
  - Switch to Rajesh Kumar (Admin): Confirm Executive Command sidebar, national readiness pill, ministerial export.
- [ ] **Step 3: Capture screenshots and update `walkthrough.md`**

---

## Verification Plan

### Automated Tests
- `npx vitest run`: All 167+ tests passing.
- `npx tsc --noEmit`: 0 TypeScript compiler errors.
- `npm run lint`: 0 ESLint errors or warnings.

### Manual / Browser Verification
- Verify that switching personas in the Topbar immediately updates both the Sidebar and the Topbar status strips.
- Verify that learners never see trainer QA tools in the sidebar.
- Verify that trainers never see personal learner course pathways in the sidebar.
