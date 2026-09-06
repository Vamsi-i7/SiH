# Learner Layout & Multi-Deck Workspace Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Learner layout into an ultra-premium, interactive GovTech learning workspace by de-cluttering the clumsy topbar and sidebar, replacing the flat continuous scroll with horizontal card decks and interactive view tabs, and ensuring every single button and feature is 100% interactive and operational with rich modals (Drill Player, Manual Reader, Karma Ledger, CAPI Sync Station, and Officer Dossier).

**Architecture:** 
- **Sleek Learner Navigation & Shell**: De-clutter Topbar and Sidebar into compact, high-contrast, elegant capsules. Remove bulky card blocks in favor of sleek, interactive badges that trigger modal views.
- **Multi-Deck Workspace with View Tabs**: Replace the single vertical scroll with 5 dedicated operational view tabs (`Operational Deck`, `Field Manuals Shelf`, `Competency Gaps`, `Karmayogi Pathways`, `CAPI Field Station`).
- **Horizontal Card Carousels**: Implement smooth-scrolling, snap-aligned card decks (`HorizontalDrillsCarousel`, `MoSPIFieldManualsShelf`, `KarmayogiPathwaysTrack`) equipped with tactile `<` and `>` smooth DOM scrolling controls.
- **100% Functional Buttons & Interactive Modals**: Every action button launches a dedicated, fully functional interactive experience:
  1. `LearnerDrillModal`: Real interactive MCQ field scenario player with option selection, immediate rule evaluation, MoSPI explanation, score computation, and Karma points crediting.
  2. `ManualReaderModal`: Interactive digital SOP handbook reader with searchable chapters, sample survey schedules, and bookmarking.
  3. `LearnerKarmaLedgerModal`: Karma points ledger with breakdown, badge showcase, and 4-day learning streak.
  4. `CAPIConnectivityModal`: Local IndexedDB inspection of 38 cached schedules, offline network disconnect simulation, and multi-step sync progress animation.
  5. `OfficerDossierModal`: Official MoSPI civil service identity card and FRAC baseline metrics.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Lucide Icons, `next-intl` (English + Hindi), Vitest.

**Design System (UI/UX Pro Max Synthesis):**
- **GovTech Bento Precision**: Non-animated, fast, accessible design using MoSPI palette:
  - Canvas: `#FAF6F0` (warm parchment) with `#F2E6D8` card backgrounds
  - Primary: `#555934` (Deep Forest Moss)
  - Secondary: `#BF9B7A` (Sand Ochre border & badges)
  - Tertiary / Accent: `#8C5B3E` (Earth Brown) & `#F8C858` (Gold Amber)
  - Dark Focus: `#2d1f17` (Deep Slate / Espresso)
- **Breathing Room & Compact Controls**: Consistent 36px/40px touch targets, refined typography, subtle 1px ochre borders (`border-[#BF9B7A]/25`), zero bulky padding.

---

## Proposed Changes

```
src/
├── components/
│   ├── layout/
│   │   ├── Topbar.tsx                             [MODIFY: Refine learner topbar capsules, connect modals]
│   │   └── Sidebar.tsx                            [MODIFY: De-clutter officer card & compact CAPI footer]
│   └── dashboard/
│       └── learner/
│           ├── LearnerDashboard.tsx               [MODIFY: Introduce tabbed view decks, search & modal handlers]
│           ├── HorizontalDrillsCarousel.tsx       [NEW: Horizontal scrollable deck for field & desk drills]
│           ├── HorizontalDrillsCarousel.test.tsx  [NEW: Unit tests for drills carousel]
│           ├── MoSPIFieldManualsShelf.tsx         [MODIFY: Upgraded to horizontal book shelf with < > scroll & reader]
│           ├── KarmayogiPathwaysTrack.tsx         [NEW: Horizontal milestone progression track]
│           ├── CAPIFieldStationTab.tsx            [NEW: Dedicated CAPI schedule inspector & sync deck]
│           ├── LearnerKpiStrip.tsx                [MODIFY: Connect KPI clicks to switch view tabs]
│           ├── LearnerHeroBento.tsx               [MODIFY: Wire all drill/sync buttons to active modal triggers]
│           ├── PriorityGapsCard.tsx               [MODIFY: Wire "Bridge Gap" to launch targeted drill modal]
│           └── modals/
│               ├── LearnerDrillModal.tsx          [NEW: Interactive MCQ drill player with feedback & Karma points]
│               ├── LearnerDrillModal.test.tsx     [NEW: Unit tests for drill modal logic]
│               ├── ManualReaderModal.tsx          [NEW: Interactive handbook reader with chapters & search]
│               ├── ManualReaderModal.test.tsx     [NEW: Unit tests for manual reader modal]
│               ├── LearnerKarmaLedgerModal.tsx    [NEW: Karma ledger, breakdown & badges showcase]
│               ├── CAPIConnectivityModal.tsx      [NEW: CAPI cache inspector & sync simulator]
│               └── OfficerDossierModal.tsx        [NEW: Civil service dossier & FRAC profile card]
```

---

## Tasks

### Task 1: Interactive Modals for Topbar & Sidebar Capsules (Dossier, Karma, CAPI)

**Files:**
- Create: `src/components/dashboard/learner/modals/OfficerDossierModal.tsx`
- Create: `src/components/dashboard/learner/modals/LearnerKarmaLedgerModal.tsx`
- Create: `src/components/dashboard/learner/modals/CAPIConnectivityModal.tsx`
- Modify: `src/components/layout/Topbar.tsx`
- Modify: `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Implement `OfficerDossierModal.tsx`**
  - Render official civil service card: Officer photo/monogram, Cadre code (`MOSPI-SSS-2022-8419`), Designation, Posting Station (`RO Patna / FOD Headquarters`), Reporting Authority, Security Clearance, and FRAC Competency Baseline (`71% Qualified`).
  - Provide "Export Service Dossier" and "Close" buttons.
- [ ] **Step 2: Implement `LearnerKarmaLedgerModal.tsx`**
  - Render Karma ledger: Total points (`+550 KP`), Level badge (`Level 3 - Senior Scrutiny Associate`), Weekly learning streak (`🔥 4 Days`), Points breakdown (`+150 Demarcation Drill`, `+200 PLFS Coding`, `+200 Scrutiny Assessment`), and Badges grid (`Field Demarcation Ace`, `GPS Accuracy Hawk`, `Zero Query Return`).
- [ ] **Step 3: Implement `CAPIConnectivityModal.tsx`**
  - Render CAPI local status: 38 cached schedules in encrypted IndexedDB.
  - Interactive "Simulate Field Offline Disconnect" toggle switch (switches state to simulate rural field areas without connectivity).
  - Interactive "Force Cloud Sync Now" button with multi-step progress bar (Encrypting -> Handshaking with MoSPI Server -> 38 forms uploaded -> Synchronized!).
- [ ] **Step 4: Refine `Topbar.tsx` for Learner**
  - Replace clunky pills with sleek, compact status capsules.
  - Wire Karma Points pill click to open `LearnerKarmaLedgerModal`.
  - Wire CAPI Active indicator click to open `CAPIConnectivityModal`.
  - Keep Language switcher and Persona switcher working smoothly.
- [ ] **Step 5: Refine `Sidebar.tsx` for Learner**
  - Replace the heavy profile block with a sleek, compact horizontal officer badge that opens `OfficerDossierModal` on click.
  - Replace the bulky footer with a sleek 1-line interactive CAPI quick-sync pill with a working sync button that triggers sync with feedback.
- [ ] **Step 6: Run tests to verify Topbar and Sidebar tests pass**
  - Run: `npx vitest run src/components/layout/`

---

### Task 2: Interactive Drill Player Modal (`LearnerDrillModal`)

**Files:**
- Create: `src/components/dashboard/learner/modals/LearnerDrillModal.tsx`
- Create: `src/components/dashboard/learner/modals/LearnerDrillModal.test.tsx`

- [ ] **Step 1: Write unit tests for `LearnerDrillModal.test.tsx`**
  - Test modal renders drill title, scenario prompt, and MCQ options.
  - Test selecting an option enables the "Submit Verification" button.
  - Test submitting an answer reveals the MoSPI manual explanation and correctness banner.
  - Test completing the drill triggers Karma Points reward callback.
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `LearnerDrillModal.tsx`**
  - Support multiple real MoSPI survey scenarios:
    - *Scenario 1 (Schedule 0.0)*: How to handle a newly constructed apartment complex not marked on the 2021 Census Enumeration Block map.
    - *Scenario 2 (PLFS Coding)*: Classifying a seasonal agricultural worker temporarily engaged in rural MNREGA road construction (Activity Status 51 vs 81).
    - *Scenario 3 (ASHE Valuation)*: Treating leased machinery under enterprise gross fixed capital formation rules.
  - Rich interactive state: Radio selection, instant evaluation ("Correct / Incorrect"), detailed citation from official MoSPI Field Manual, Next Question button, and Completion Summary granting Karma Points with a celebratory toast!
- [ ] **Step 4: Run test to verify it passes**
  - Run: `npx vitest run src/components/dashboard/learner/modals/LearnerDrillModal.test.tsx`

---

### Task 3: Interactive Handbook Reader Modal (`ManualReaderModal`)

**Files:**
- Create: `src/components/dashboard/learner/modals/ManualReaderModal.tsx`
- Create: `src/components/dashboard/learner/modals/ManualReaderModal.test.tsx`

- [ ] **Step 1: Write unit tests for `ManualReaderModal.test.tsx`**
  - Test modal renders manual title, division badge, and chapter list.
  - Test clicking a chapter updates the active chapter reading pane.
  - Test search input filters sections in real time.
  - Test "Download PDF" and "Copy Citation" buttons trigger user notifications.
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `ManualReaderModal.tsx`**
  - Two-pane reader interface:
    - Left pane: Chapter index (e.g. Chapter 1: Introduction & Frame; Chapter 2: Concepts & Definitions; Chapter 3: Canvassing Procedures; Chapter 4: Common Field Errors).
    - Right pane: Rich formatted text with highlighted statutory definitions, callout boxes for "Critical Field Rules", and an interactive "Mark Chapter Read" button that updates reading progress.
    - Header actions: Keyword search bar, "Download Official PDF" button (triggers download simulation toast), and "Close".
- [ ] **Step 4: Run test to verify it passes**
  - Run: `npx vitest run src/components/dashboard/learner/modals/ManualReaderModal.test.tsx`

---

### Task 4: Horizontal Card Carousels & Decks

**Files:**
- Create: `src/components/dashboard/learner/HorizontalDrillsCarousel.tsx`
- Create: `src/components/dashboard/learner/HorizontalDrillsCarousel.test.tsx`
- Modify: `src/components/dashboard/learner/MoSPIFieldManualsShelf.tsx`
- Create: `src/components/dashboard/learner/KarmayogiPathwaysTrack.tsx`
- Create: `src/components/dashboard/learner/CAPIFieldStationTab.tsx`

- [ ] **Step 1: Implement `HorizontalDrillsCarousel.tsx`**
  - Horizontal scrolling container (`overflow-x-auto snap-x scrollbar-none`) with refs.
  - Interactive `<` (Scroll Left) and `>` (Scroll Right) controls that execute `containerRef.current.scrollBy({ left: -340, behavior: 'smooth' })`.
  - 5 rich field drill cards with Category tags, Duration, Difficulty level, XP points, and working **"Start Drill"** button that invokes `onStartDrill(drillId)`.
- [ ] **Step 2: Upgraded `MoSPIFieldManualsShelf.tsx` to Horizontal Book Deck**
  - Convert from static vertical stack to a sleek horizontal book carousel with `<` and `>` scroll controls.
  - Cards styled like authoritative MoSPI publications with hardcover spine styling, Ministry emblem, page count, and reading progress.
  - Working **"Read Online / SOP Viewer"** button -> triggers `onOpenManual(manualId)`.
  - Working **"Download PDF"** button -> triggers instant download progress toast.
- [ ] **Step 3: Implement `KarmayogiPathwaysTrack.tsx`**
  - Horizontal progression timeline showing 4 career milestones:
    - Milestone 1: *Induction & Statistical Cadre Foundations* (Completed 100%)
    - Milestone 2: *Field Operations & Demarcation Mastery* (85% In Progress)
    - Milestone 3: *Advanced Data Scrutiny & Microdata Validation* (Recommended)
    - Milestone 4: *National Accounts & Macro-Aggregation* (Aspirational)
  - Milestone cards show required competencies, linked iGOT courses, and working launch buttons.
- [ ] **Step 4: Implement `CAPIFieldStationTab.tsx`**
  - Dedicated interactive tab for field operations:
    - Overview card of 38 cached schedules.
    - Filter pills: "All (38)", "PLFS Household (24)", "ASHE Enterprise (14)", "Flagged Queries (3)".
    - Schedule list with status ("Ready to Transmit", "Encrypted Locally", "Validation Passed").
    - Working "Transmit Batch to Server" button with live animation.
- [ ] **Step 5: Write unit tests for `HorizontalDrillsCarousel.test.tsx`**
  - Test carousel renders 5 drill cards with titles and difficulty.
  - Test clicking `<` and `>` calls scrollBy.
  - Test clicking "Start Drill" fires the `onStartDrill` callback.
- [ ] **Step 6: Run tests to verify carousel passes**
  - Run: `npx vitest run src/components/dashboard/learner/HorizontalDrillsCarousel.test.tsx`

---

### Task 5: Integrate Multi-Deck Workspace in `LearnerDashboard.tsx`

**Files:**
- Modify: `src/components/dashboard/learner/LearnerDashboard.tsx`
- Modify: `src/components/dashboard/learner/LearnerHeroBento.tsx`
- Modify: `src/components/dashboard/learner/PriorityGapsCard.tsx`
- Modify: `src/components/dashboard/learner/LearnerKpiStrip.tsx`
- Modify: `src/components/dashboard/learner/LearnerDashboard.test.tsx`

- [ ] **Step 1: Add Interactive View Tabs to `LearnerDashboard.tsx`**
  - Implement workspace tabs:
    1. 📌 `overview` — "Operational Deck" (Hero Bento, Horizontal Drills Carousel, Priority Gaps, Quick Manuals)
    2. 📚 `manuals` — "Field Manuals & SOP Shelf" (Full horizontal book shelf + digital reader)
    3. 🎯 `competencies` — "FRAC Competency Gaps" (Gap cards + matrix + direct drill bridge)
    4. 🎓 `pathways` — "Karmayogi Pathways" (Horizontal milestone progression track + enrolled courses)
    5. 📡 `capi` — "CAPI Field Station" (38 cached schedules inspector & sync diagnostics)
  - Support switching tabs via state without page reloads.
- [ ] **Step 2: Add Real-Time Search / Filter Bar**
  - Header search input allowing officers to search for drills, manuals, or competencies across all decks in real time.
- [ ] **Step 3: Connect All Modals in `LearnerDashboard.tsx`**
  - Connect state for:
    - `activeDrillId`: opens `LearnerDrillModal` when clicking "Start Drill" on any drill card, "Bridge Gap" on any competency card, or "Practice Now" on the hero bento.
    - `activeManualId`: opens `ManualReaderModal` when clicking "Read Online" on any manual card.
    - `karmaModalOpen`: opens `LearnerKarmaLedgerModal` when clicking Karma Points in KPI strip or Topbar.
    - `capiModalOpen`: opens `CAPIConnectivityModal` when clicking CAPI status in Hero Bento, Topbar, or Sidebar.
    - `dossierModalOpen`: opens `OfficerDossierModal` when clicking officer badge in Hero Bento or Sidebar.
- [ ] **Step 4: Update `LearnerDashboard.test.tsx`**
  - Verify all existing 5 tests continue to pass (preserving all required test strings).
  - Add tests verifying workspace tab switching and modal trigger rendering.
- [ ] **Step 5: Run Vitest across all dashboard tests**
  - Run: `npx vitest run src/components/dashboard/learner/`

---

### Task 6: Full Verification & Visual Inspection

- [ ] **Step 1: Run full TypeScript check**
  - Run: `npx tsc --noEmit`
- [ ] **Step 2: Run ESLint**
  - Run: `npm run lint`
- [ ] **Step 3: Run entire Vitest test suite**
  - Run: `npx vitest run` (Must pass all 178+ tests with 0 failures)
- [ ] **Step 4: Run browser subagent visual verification**
  - Navigate to `http://localhost:3000/dashboard` as Amit Sharma.
  - Verify sleek de-cluttered topbar and sidebar.
  - Test clicking Karma Points capsule -> verify `LearnerKarmaLedgerModal` opens and displays breakdown.
  - Test clicking CAPI capsule -> verify `CAPIConnectivityModal` opens and test offline disconnect toggle.
  - Test clicking officer badge -> verify `OfficerDossierModal` opens.
  - Test clicking `<` and `>` buttons on the Horizontal Drills Carousel -> verify cards slide smoothly.
  - Test clicking "Start Drill" -> verify `LearnerDrillModal` opens, select an answer, verify feedback, and check Karma reward.
  - Test clicking "Read Online" on a manual card -> verify `ManualReaderModal` opens, switch chapters, and test search.
  - Test switching workspace tabs (`Field Manuals Shelf`, `Competency Gaps`, `Karmayogi Pathways`, `CAPI Field Station`) -> verify smooth instant tab switching.
  - Switch to Sunita Devi (Rural Field Investigator) -> verify full Hindi localization across the horizontal decks and modals.
- [ ] **Step 5: Capture recording and screenshots for `walkthrough.md`**
