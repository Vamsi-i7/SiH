# Phase 6 Design Spec — Admin Intelligence, Outcome Correlation & i18n Polish

| Field | Value |
|---|---|
| Phase | **Phase 6 (Final MVP Phase)** |
| Target Milestone | SIH 26101 Hackathon Demo |
| Date | 2026-09-06 |
| Status | **Approved Design** |

---

## 1. Scope & Goals

Phase 6 completes the StatVidya MVP by implementing the **Admin Workforce Intelligence** subsystem (PRD FR-ADMIN-1 through FR-ADMIN-5), **MoSPI Field Outcome Correlation** (Strategic Lever 2), **write-back priority training flags** with Supabase Realtime broadcasts, and full **bilingual polish**.

### PRD Requirements Covered
- **FR-ADMIN-1**: Organization overview: total officials, average readiness, trend direction (computed from seeded data)
- **FR-ADMIN-2**: AI-generated narrative summary of the top gap trend
- **FR-ADMIN-3**: Role/department breakdown table with drill-down to individual profiles
- **FR-ADMIN-4**: Admin write-back action: flag department/role for priority training (persists in `training_priorities`)
- **FR-ADMIN-5**: Training → outcome correlation view: competency level vs. simulated survey-quality metric (`SYNTHETIC_DEMO_DATA`)
- **FR-I18N-1–3**: 100% bilingual dictionary coverage (`en.json` / `hi.json`) with seamless language toggle

---

## 2. Architecture & Routing

### Sub-Route Structure
```
/admin/analytics                          → AdminOverviewPage (server component)
  ├── Macro Stat Cards (Total Officials, Avg Readiness, Critical Gaps, Trend)
  ├── Department Breakdown Summary (readiness bars, gap counts)
  ├── Active Training Priorities (Realtime-subscribed live list)
  └── Flag Department CTA → <FlagDepartmentModal />

/admin/analytics/departments/[dept]       → DepartmentDrilldownPage
  ├── Department Header & Aggregate Metrics
  ├── Individual Officials Table (name, designation, readiness %, verified/self-assessed badge)
  └── Direct links to individual official profiles (/profile)

/admin/analytics/correlation              → OutcomeCorrelationPage
  ├── <ScatterChart /> (Bespoke SVG)
  │   ├── X-Axis: Assessed Competency Level (L1–L5)
  │   ├── Y-Axis: Simulated Field Scrutiny Error Rate (%)
  │   ├── Regression line with slope annotation
  │   └── "Simulated" watermark overlay
  ├── Metric selector: Listing Error Rate, Recall Period Inconsistency, Outlier Rejection
  ├── Regression Insight narrative box
  └── <ProvenanceBadge provenance="SYNTHETIC_DEMO_DATA" />
```

---

## 3. Data Flow & Services

### `src/services/adminService.ts`
- `getWorkforceOverview(orgId)` — aggregates headcount, computes macro readiness index using `computeReadinessIndex()`, counts critical gaps across all users
- `getDepartmentBreakdown(orgId)` — groups users by department, calculates per-department average readiness, critical gap counts, and trend
- `getDepartmentOfficials(orgId, department)` — returns individual `WorkforceReadinessProfile` records for all users in a department
- `flagDepartment(orgId, userId, { department, roleId?, reason })` — inserts into `training_priorities` table, writes to `audit_log`
- `getTrainingPriorities(orgId)` — queries active (unresolved) priority training flags

### Supabase Realtime Integration
- Subscription to `training_priorities` table (already in `supabase_realtime` publication from migration `001`)
- Optimistic UI updates on insert; broadcast received by all connected admin/trainer sessions

### `src/data/surveyScrutinyMetrics.ts`
Synthetic dataset based on MoSPI scrutiny inspection guidelines:
1. **Schedule 0.0 Listing Error Rate (%)** vs. Boundary Demarcation competency
2. **Recall Period Inconsistency Rate (%)** vs. HCES Data Collection competency
3. **Outlier Rejection Rate (%)** vs. Data Scrutiny competency
- Each series has 8–12 data points with regression line metadata (slope, R², p-value, narrative insight)

---

## 4. UI Components (Bespoke SVG)

### `<ScatterChart />`
- Pure SVG implementation (zero external chart dependencies)
- Responsive `viewBox` scaling
- Data points with hover tooltips (department name, level, error rate)
- Linear regression trendline (least-squares fit computed inline)
- Semi-transparent "SIMULATED DATA" watermark across the plot area
- Accessible aria labels and data table fallback

### `<BarChart />`
- Horizontal bar chart for department readiness comparison
- Color-coded by readiness thresholds (green ≥70%, amber 50–69%, red <50%)

### `<SparkLine />`
- Mini inline SVG polyline showing 6-month readiness trend

### `<FlagDepartmentModal />`
- Accessible dialog for admins to select department, specify reason, and submit priority training flag

---

## 5. API Endpoints

### `POST /api/admin/flag-department`
- **Auth**: Verified admin role only (403 for learner/trainer)
- **Input**: `{ department: string, roleId?: string, reason: string }`
- **Output**: `{ success: true, priority: TrainingPriority }`
- **Side effects**: DB insert + audit log record + Realtime event

---

## 6. Testing Plan

1. **Unit tests** (`adminService.test.ts`):
   - Workforce aggregation with empty/single/multi user datasets
   - Department grouping and average readiness computation
   - Linear regression line calculation accuracy (slope, intercept, R²)
2. **API Route test**:
   - `/api/admin/flag-department` auth guarding and validation
3. **Build verification**:
   - `npx next build` cleanly passes with 0 errors
