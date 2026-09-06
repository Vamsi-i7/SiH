# Admin Layout & Executive Governance Workspace Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the Admin Layout (`role === 'admin'`) with de-cluttered topbar/sidebar capsular status indicators, horizontal carousels (Zonal Health & Policy Directives), 5 multi-deck workspace tabs, and 100% interactive modals/actions for every single button.

**Architecture:** 
1. Build reusable executive modals in `src/components/dashboard/admin/modals/` (`MinisterialBriefingModal`, `NationalCadreRosterModal`, `CommissionSweepModal`, `RegionalDetailModal`, `NationalReadinessModal`, `FlaggedRegionsModal`).
2. Update `OfficerDossierModal.tsx` to dynamically support the executive admin persona (`Rajesh Kumar`, ISS Cadre Batch 1998, Level 14 Senior SAG).
3. De-clutter Topbar and Sidebar for the `admin` role with interactive capsule pills and clickable executive profile triggers.
4. Implement horizontal scrolling decks: `HorizontalZonalHealthCarousel.tsx` (7 zones) and `HorizontalPolicyDirectivesCarousel.tsx` (5 statutory circulars).
5. Upgrade `AdminDashboard.tsx` with 5 multi-deck tabs (`overview`, `zonal_ro`, `scrutiny_correlation`, `policy_circulars`, `governance_orders`) eliminating single vertical scroll monotony.
6. Replace all placeholder `alert(...)` calls in `AdminCabinetDrawer.tsx` and `DepartmentBreakdownTable.tsx` with rich modals and real CSV generation.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Vitest.

---

## Global Constraints
- **GovTech Bento Palette**: `#FAF6F0` (warm canvas), `#F2E6D8` (secondary), `#555934` (Deep Forest Moss), `#BF9B7A` (Sand Ochre), `#8C5B3E` (Earth Brown), `#2d1f17` (Deep Slate), `#F8C858` (Gold Accent).
- **Zero TypeScript Errors**: All code must pass `npx tsc --noEmit`.
- **Zero ESLint Warnings**: All code must pass `npm run lint`.
- **Zero Test Regressions**: All 187 existing tests must continue to pass; add new tests for new components and modals.
- **Button Interactivity Guarantee**: Every button, pill, badge, and tab must execute a concrete action (open modal, switch tab, toggle flag, or download data).

---

## Proposed File Changes & Task Structure

### Task 1: Executive Modals (`MinisterialBriefingModal`, `NationalCadreRosterModal`, `CommissionSweepModal`, `RegionalDetailModal`, `NationalReadinessModal`, `FlaggedRegionsModal`)
**Files:**
- Create: `src/components/dashboard/admin/modals/MinisterialBriefingModal.tsx`
- Create: `src/components/dashboard/admin/modals/NationalCadreRosterModal.tsx`
- Create: `src/components/dashboard/admin/modals/CommissionSweepModal.tsx`
- Create: `src/components/dashboard/admin/modals/RegionalDetailModal.tsx`
- Create: `src/components/dashboard/admin/modals/NationalReadinessModal.tsx`
- Create: `src/components/dashboard/admin/modals/FlaggedRegionsModal.tsx`
- Create: `src/components/dashboard/admin/modals/AdminModals.test.tsx`
- Modify: `src/components/dashboard/learner/modals/OfficerDossierModal.tsx`

**Interfaces:**
- `MinisterialBriefingModal`: Preview official briefing with printable formatting, NSC watermark, and PDF download trigger.
- `NationalCadreRosterModal`: Table of 4,850 officers across zones with search, level filter, and working `exportToCsv()` function.
- `CommissionSweepModal`: Interactive order generator with target zone checkboxes, mandate deadline, and digital signature sign-off.
- `RegionalDetailModal`: Deep-dive audit for any selected Regional Office (FOD Bihar, FOD UP East, etc.) with error distribution and intervention dispatch.
- `NationalReadinessModal`: Cadre-by-cadre readiness breakdown (ISS, SSS, FOD) with progress towards 75% target.
- `FlaggedRegionsModal`: Critical alert triage with 1-click NSSTA emergency intervention assignment.

---

### Task 2: Horizontal Card Carousels & Decks
**Files:**
- Create: `src/components/dashboard/admin/HorizontalZonalHealthCarousel.tsx`
- Create: `src/components/dashboard/admin/HorizontalPolicyDirectivesCarousel.tsx`
- Create: `src/components/dashboard/admin/HorizontalAdminCarousels.test.tsx`

**Interfaces:**
- `HorizontalZonalHealthCarousel`: Horizontal deck with `<` and `>` controls displaying 7 zones (Northern, Eastern, Central-East, Western, Southern, North-Eastern, Headquarters) with readiness progress bars, error indicators, and "Inspect RO" / "Dispatch Triage" callbacks.
- `HorizontalPolicyDirectivesCarousel`: Horizontal deck of 5 statutory reform tracks with status tags (*Enforced*, *In Review*, *Gazette Published*), compliance deadlines, and "Read Circular" actions.

---

### Task 3: De-clutter Topbar & Sidebar for Admin Role
**Files:**
- Modify: `src/components/layout/Topbar.tsx`
- Modify: `src/components/layout/Sidebar.tsx`
- Modify: `src/components/layout/Topbar.test.tsx`
- Modify: `src/components/layout/Sidebar.test.tsx`

**Details:**
- In `Topbar.tsx`:
  - Convert `National Readiness: 72.4%` badge into an interactive capsule button opening `NationalReadinessModal`.
  - Convert `2 Flagged ROs` badge into an interactive capsule button opening `FlaggedRegionsModal`.
  - Convert `Ministerial PDF` button from `alert(...)` to opening `MinisterialBriefingModal`.
- In `Sidebar.tsx`:
  - Ensure clicking the officer card for Rajesh Kumar opens `OfficerDossierModal` with executive MoSPI credentials.
  - Add interactive trigger to the admin footer (`Cabinet Protocol Sync`) with live toast feedback.

---

### Task 4: Upgrade `AdminCabinetDrawer` & `DepartmentBreakdownTable`
**Files:**
- Modify: `src/components/dashboard/admin/AdminCabinetDrawer.tsx`
- Modify: `src/components/dashboard/admin/DepartmentBreakdownTable.tsx`

**Details:**
- In `AdminCabinetDrawer.tsx`:
  - Replace `handleExportPDF` with `onOpenBriefingModal()`.
  - Replace `handleExportCSV` with `onOpenRosterModal()`.
  - Replace `handleCommissionRound` with `onOpenSweepModal()`.
- In `DepartmentBreakdownTable.tsx`:
  - Add "Inspect RO" button for each row opening `RegionalDetailModal`.
  - Keep "Flag Priority Training" button with dynamic flag count synchronization.

---

### Task 5: Multi-Deck Workspace in `AdminDashboard.tsx`
**Files:**
- Modify: `src/components/dashboard/admin/AdminDashboard.tsx`
- Modify: `src/components/dashboard/admin/AdminDashboard.test.tsx`

**Details:**
- Introduce 5 workspace tabs in `AdminDashboard.tsx`:
  - 🏛️ `overview`: Executive Command Center (Header + KPI Strip + Horizontal Zonal Health + AI Executive Briefing + Scrutiny Correlation + Cabinet Drawer).
  - 🗺️ `zonal_ro`: Regional Offices & Cadre Health (Zonal Health Cards + Full Searchable Department Breakdown Table with Inspect RO modals).
  - 📉 `scrutiny_correlation`: Econometric Outcome Regression (PRD §9.4.5 interactive scatter chart + series pills + narrative insight).
  - 📑 `policy_circulars`: National Policy Directives & Cabinet Circulars horizontal deck & statutory library.
  - 🏛️ `governance_orders`: Executive Orders & Cabinet Drawer with quick action triggers.
- Connect all callbacks and modals at the dashboard level so every button works seamlessly.

---

### Task 6: Visual Inspection & Verification
- Use `browser_subagent` to test `http://localhost:3000/dashboard` with the admin persona (`Rajesh Kumar`).
- Verify de-cluttered Topbar and Sidebar:
  - Click `National Readiness: 72.4%` capsule -> verify `NationalReadinessModal` opens.
  - Click `2 Flagged ROs` capsule -> verify `FlaggedRegionsModal` opens.
  - Click `Ministerial PDF` button in Topbar -> verify `MinisterialBriefingModal` opens.
  - Click Rajesh Kumar profile card in Sidebar -> verify `OfficerDossierModal` opens with executive details.
- Verify horizontal card carousels:
  - Click `<` and `>` on `HorizontalZonalHealthCarousel`.
  - Click "Inspect Zone" -> opens `RegionalDetailModal`.
  - Click "Read Circular" on `HorizontalPolicyDirectivesCarousel`.
- Verify cabinet drawer actions:
  - Click "Export" (Secretary Briefing Memo) -> opens `MinisterialBriefingModal`.
  - Click "Download" (National Cadre Roster) -> opens `NationalCadreRosterModal` and test CSV download.
  - Click "Order" (Commission Q3 Assessment Sweep) -> opens `CommissionSweepModal`.
- Verify all 5 workspace tabs (`overview`, `zonal_ro`, `scrutiny_correlation`, `policy_circulars`, `governance_orders`).
- Capture screenshots and record video session.
- Update `walkthrough.md`.
- Commit changes to `flow-currections` branch.
