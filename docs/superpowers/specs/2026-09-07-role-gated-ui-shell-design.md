# Role-Gated UI Shell & Navigation Architecture Design

**Date:** 2026-09-07  
**Status:** Ready for Review  
**Target:** MoSPI StatVidya Workforce Intelligence Platform  

---

## 1. Executive Summary

StatVidya currently serves three distinct governance layers:
1. **Learners** (Field Investigators e.g. Sunita Devi, Junior Statistical Officers e.g. Amit Sharma)
2. **Trainers** (NSSTA Faculty & Course Directors e.g. Dr. Priya Verma)
3. **Administrators** (Additional Director Generals e.g. Rajesh Kumar)

While the `/dashboard` route dispatches to role-specific dashboard views, the outer platform shell (`Sidebar`, `Topbar`, `AppLayout`, `Breadcrumb`) currently presents a monolithic, uniform navigation menu where learners see trainer curation tools, trainers see learner course menus, and admins see a generic menu.

This design implements a **Strict Role-Gated UI Shell**:
- Tailors the `Sidebar`, `Topbar`, `Breadcrumb`, and `AppLayout` completely per role.
- Adopts the **rich, non-animated GovTech Bento aesthetic** from the user's reference designs (warm cream `#FAF6F0`/`#F2E6D8`, sand `#BF9B7A`, deep moss `#555934`, earth brown `#8C5B3E`, high-contrast dark slate/espresso `#2d1f17`, and amber `#F8C858`).
- Preserves all underlying page content structures while elevating the entire navigation and surrounding shell experience.

---

## 2. Role-Gated Navigation Matrix

| Component | Learner Shell | Trainer Shell | Admin Shell |
| :--- | :--- | :--- | :--- |
| **Topbar Title & Identity** | MoSPI Capacity Building Workspace | NSSTA Faculty Studio | MoSPI Executive Command • ADG Desk |
| **Topbar Status Badges** | Karma Points (`+550 KP`), CAPI Sync Pill, Hindi/English Toggle | Pending QA Triage (`14 Items`), Faculty Accreditation | National Readiness (`72.4%`), Flagged ROs (`2 ROs`), Ministerial PDF |
| **Sidebar Profile Card** | Officer Name, Cadre (SSS / FOD), Verified Badge | Course Director, NSSTA Faculty, Greater Noida Campus | Additional Director General, MoSPI Headquarters |
| **Primary Nav Items** | 📊 Workspace (`/dashboard`)<br>🎯 FRAC Gaps (`/skill-gap`)<br>📝 Field Drills (`/assignments`)<br>🗺️ Karmayogi Pathways (`/pathways`)<br>👤 Official Profile (`/profile`) | 📋 Faculty Desk (`/dashboard`)<br>📚 MoSPI Manuals (`/documents`)<br>⚙️ AI MCQ Studio (`/mcq-generator`)<br>🛡️ QA Triage Queue (`/review-queue`)<br>📊 Trainee Error Analytics (`/assignments`) | 🏛️ Workforce Dashboard (`/dashboard`)<br>📈 Outcome Correlation (`/dashboard#correlation`)<br>🏢 Regional Office Health (`/dashboard#regional-offices`)<br>👥 Cadre Directory (`/skill-gap`)<br>📋 Statutory Assessments Audit (`/assignments`) |
| **Sidebar Footer** | CAPI Offline DB Sync Status + Statutory MoSPI Emblem | Vector DB Status (`6 Manuals, 1,276 Chunks`) + NSSTA Crest | Cabinet Secretariat Protocol Sync + National Emblem |
| **Breadcrumb Root** | Learner Workspace | NSSTA Faculty Studio | Executive Command |

---

## 3. Detailed Component Specifications

### 3.1 `src/components/layout/Sidebar.tsx`
- **Role Detection**: Consumes active persona from cookie / props via `resolveUserRole`.
- **Dynamic Cadre Header**: Displays the active user's name, designation, and cadre badge with role-tailored color accents:
  - Learner: Deep Moss (`#555934`)
  - Trainer: Earth Brown (`#8C5B3E`)
  - Admin: Deep Slate / Gold (`#2d1f17` + `#F8C858`)
- **Filtered Navigation List**: Renders strictly the navigation items relevant to the role.
- **Collapsible State**: Supports 64px collapsed icon-only rail and 260px expanded state with smooth, non-animated transition.
- **Tactile Active Indicator**: Active routes highlighted in `#555934` with high contrast text and subtle rounded pill geometry.

### 3.2 `src/components/layout/Topbar.tsx`
- **Top Branding Bar**:
  - Displays MoSPI Government of India seal and role context banner.
  - Role-specific contextual indicators:
    - *Learner*: Karma Points counter pill, CAPI offline indicator, and quick Hindi/English toggle.
    - *Trainer*: QA Triage queue counter badge (`14 QA Pending`) and quick "Ingest Manual" CTA.
    - *Admin*: National readiness index (`72.4%`), Priority Flagged ROs badge (`2 flagged`), and "Ministerial Briefing PDF" action.
- **Enhanced Persona Switcher**:
  - Displays current persona with clear role chip (`LEARNER`, `TRAINER`, `ADMIN`).
  - Dropdown lists all 4 personas (`Amit Sharma`, `Sunita Devi`, `Dr. Priya Verma`, `Rajesh Kumar`) with designation, department, and instant role-switching synchronization.
- **Notification Center**: Filtered by active role so trainers see QA notifications, learners see assessment results, and admins see regional gap alerts.

### 3.3 `src/components/layout/AppLayout.tsx` & `Breadcrumb.tsx`
- Background canvas updated to warm GovTech page tone (`#F2E6D8`/`#FAF6F0`) with subtle border lines (`border-[#BF9B7A]/25`).
- Breadcrumbs dynamically prepend role root (`Learner Workspace` / `NSSTA Faculty Studio` / `Executive Command`).
- Zero heavy animations; instant, crisp responsive layouts.

---

## 4. Verification Plan

1. **Automated Unit Tests**:
   - `Sidebar.test.tsx`: Verify navigation items render strictly for each role (Learner does not see `/review-queue`; Trainer does not see `/pathways`; Admin sees executive tools).
   - `Topbar.test.tsx`: Verify role badges (Karma points for learner, QA counter for trainer, readiness for admin).
   - Full test suite: Verify all 167 existing vitest tests continue to pass.
2. **TypeScript & Lint**:
   - `npx tsc --noEmit` (0 errors)
   - `npm run lint` (0 warnings, 0 errors)
3. **End-to-End Browser Verification**:
   - Verify all 4 personas using browser subagent.
   - Confirm complete sidebar, topbar, and menubar adaptation upon persona switch.
