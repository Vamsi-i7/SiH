# Phase 6 Design Spec — Admin Intelligence, Outcome Correlation & i18n Polish

| Field | Value |
|---|---|
| Phase | **Phase 6 (Final MVP Phase)** |
| Architecture Base | **Active v2.0 (Next.js 15 App Router + Firebase Auth + Cloud Firestore + Firebase Storage)** |
| Target Milestone | SIH 26101 Hackathon Demo |
| Date | 2026-09-06 |
| Status | **Approved Design (v2.1 Refined)** |

---

## 1. Scope & Architectural Foundation

Phase 6 completes the StatVidya MVP by implementing the **Admin Workforce Intelligence** subsystem (PRD FR-ADMIN-1 through FR-ADMIN-5), **MoSPI Field Outcome Correlation** (Strategic Lever 2), **write-back priority training flags** with Cloud Firestore realtime listeners, and full **bilingual polish**.

### Architectural Alignment
- **Stack**: Next.js 15 App Router + React 19 + TypeScript + Firebase Auth + Cloud Firestore + Firebase Storage.
- **Multi-Tenancy & Authorization**: Firestore Security Rules (`firestore.rules`) ensuring strict `organizationId` isolation.
- **Audit Logging**: Automatic Cloud Firestore audit trail recording all administrative write-backs to `auditLogs`.
- **Realtime Replication**: `trainingPriorities` real-time listeners via Cloud Firestore `onSnapshot`.

---

## 2. PRD Requirements Covered

- **FR-ADMIN-1**: Organization overview: total officials, average readiness, trend direction (computed from seeded database records).
- **FR-ADMIN-2**: AI-generated narrative summary of the macro gap trend.
- **FR-ADMIN-3**: Role/department breakdown table with drill-down to individual profiles.
- **FR-ADMIN-4**: Admin write-back action: flag department/role for priority training (persists in `trainingPriorities`, broadcasted via Cloud Firestore real-time listeners).
- **FR-ADMIN-5**: Training → outcome correlation view: competency level vs. simulated survey-quality metric, tagged `SYNTHETIC_DEMO_DATA` with prominent "Simulated" watermark and methodology disclosure.
- **FR-I18N-1–3**: 100% bilingual dictionary coverage (`en.json` / `hi.json`) with seamless language toggle and automated CI guardrails.

---

## 3. Detailed Data Contracts & Types

### 3.1 `src/data/surveyScrutinyMetrics.ts`
Carries explicit `ProvenanceType = 'SYNTHETIC_DEMO_DATA'` and structured methodology documentation:

```typescript
import { type ProvenanceType } from '@/lib/types';

export interface SurveyScrutinyDataPoint {
  id: string;
  departmentCode: string; // e.g. "FOD-UP-E", "FOD-KL"
  departmentName: string; // e.g. "FOD Uttar Pradesh East", "FOD Kerala"
  competencyLevel: number; // 1 to 5 (L1 - L5)
  errorRatePercent: number; // e.g. 18.4, 4.2
  sampleSize: number; // e.g. 450 schedules audited
}

export interface OutcomeCorrelationSeries {
  id: string;
  metricName: string;
  metricNameHi: string;
  competencyId: string;
  competencyName: string;
  yAxisLabel: string;
  yAxisLabelHi: string;
  xAxisLabel: string;
  xAxisLabelHi: string;
  regressionSlope: number; // e.g. -3.2 (% error reduction per competency level)
  pValue: number; // e.g. 0.008
  rSquared: number; // e.g. 0.89
  narrativeInsight: string;
  narrativeInsightHi: string;
  methodologyNote: string;
  provenance: ProvenanceType; // strictly 'SYNTHETIC_DEMO_DATA'
  dataPoints: SurveyScrutinyDataPoint[];
}

export const SYNTHETIC_SURVEY_OUTCOMES: OutcomeCorrelationSeries[] = [
  {
    id: 'listing-error-rate',
    metricName: 'Schedule 0.0 Listing Error Rate (%)',
    metricNameHi: 'अनुसूची 0.0 प्रविष्टि त्रुटि दर (%)',
    competencyId: 'comp-boundary-demarcation',
    competencyName: 'Census Boundary Demarcation & Listing',
    yAxisLabel: 'Listing Error Rate (%)',
    yAxisLabelHi: 'सूचीकरण त्रुटि दर (%)',
    xAxisLabel: 'Boundary Demarcation Competency Level (L1–L5)',
    xAxisLabelHi: 'सीमा निर्धारण कौशल स्तर (L1–L5)',
    regressionSlope: -3.2,
    pValue: 0.008,
    rSquared: 0.89,
    narrativeInsight: 'Each +1 level in Boundary Demarcation corresponds to a 3.2% reduction in Schedule 0.0 listing scrutiny errors.',
    narrativeInsightHi: 'सीमा निर्धारण में प्रत्येक +1 स्तर अनुसूची 0.0 सूचीकरण संवीक्षा त्रुटियों में 3.2% की कमी दर्शाता है।',
    methodologyNote: 'Simulated based on NSS 78th Round Scrutiny Guidelines and FOD Regional Inspection Reports (PRD §9.4.5).',
    provenance: 'SYNTHETIC_DEMO_DATA',
    dataPoints: [
      { id: 'p1', departmentCode: 'FOD-BR', departmentName: 'FOD Bihar (Q1 2025)', competencyLevel: 1.2, errorRatePercent: 19.8, sampleSize: 520 },
      { id: 'p2', departmentCode: 'FOD-UPE', departmentName: 'FOD UP East', competencyLevel: 2.1, errorRatePercent: 15.4, sampleSize: 610 },
      { id: 'p3', departmentCode: 'FOD-OD', departmentName: 'FOD Odisha', competencyLevel: 2.8, errorRatePercent: 11.2, sampleSize: 480 },
      { id: 'p4', departmentCode: 'FOD-MH', departmentName: 'FOD Maharashtra', competencyLevel: 3.6, errorRatePercent: 6.8, sampleSize: 740 },
      { id: 'p5', departmentCode: 'FOD-KL', departmentName: 'FOD Kerala (Post-StatVidya)', competencyLevel: 4.8, errorRatePercent: 1.9, sampleSize: 580 }
    ]
  },
  // Series 2: Recall Period Inconsistency vs. HCES Data Collection
  // Series 3: Outlier Rejection Rate vs. Data Scrutiny
];
```

### 3.2 `src/services/adminService.ts`

```typescript
export interface DepartmentSummary {
  department: string;
  officialCount: number;
  avgReadiness: number; // 0 - 100
  criticalGapCount: number;
  trendDirection: 'up' | 'down' | 'stable';
  isPriorityFlagged: boolean;
}

export interface WorkforceOverview {
  totalOfficials: number;
  avgReadiness: number;
  criticalGaps: number;
  trendDirection: 'up' | 'down' | 'stable';
  activePrioritiesCount: number;
}

export interface LinearRegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  points: Array<{ x: number; y: number }>;
  isComputable: boolean; // false when dataPoints.length < 2
}

/**
 * Calculates least-squares linear regression line.
 * Handles edge case where points < 2 by returning isComputable: false.
 */
export function calculateLinearRegression(
  points: Array<{ x: number; y: number }>
): LinearRegressionResult {
  if (!points || points.length < 2) {
    return { slope: 0, intercept: 0, rSquared: 0, points: [], isComputable: false };
  }
  // Standard least-squares formula implementation
  // ...
}
```

### 3.3 Write-Back API: `POST /api/admin/flag-department`

- **Endpoint**: `/api/admin/flag-department`
- **Request Headers**: Firebase Auth ID token / Session cookie
- **Request Body**:
  ```json
  {
    "department": "NSSO FOD UP East",
    "roleId": "optional-uuid",
    "reason": "Critical 15.4% listing error rate detected in recent Schedule 0.0 audit."
  }
  ```
- **Security Validations**:
  1. Authenticated session check (`getAuthenticatedUser()`).
  2. Role verification: `role === 'admin'` (returns 403 Forbidden for learner/trainer).
  3. Tenant isolation: `organizationId` is extracted strictly from the authenticated user's session claims, never accepted from the request body.
- **Database Operations**:
  - `addDoc(collection(db, 'trainingPriorities'), ...)`
  - Firestore audit trail automatically records the action.
- **Response**: `201 Created` with `{ success: true, priority: TrainingPriority }`.

---

## 4. Sub-Route & Page Layouts

### Route 1: `/admin/analytics` (Overview Dashboard)
- **Top Bar**: Summary KPI Cards with trend indicators (Total Officials, Avg Readiness, Critical Gaps, Active Priority Flags).
- **Main Section**:
  - Left/Center: **Department Breakdown Table** with horizontal `<BarChart />` micro-visualizations, critical gap counts, and "Flag for Priority Training" quick-action button.
  - Right: **Active Training Priorities Feed** — subscribed to Cloud Firestore real-time listener for live updates when an admin flags any department.
- **Header Actions**: Direct link button `[ 📊 View Outcome Correlation Engine → ]` leading to `/admin/analytics/correlation`.

### Route 2: `/admin/analytics/departments/[dept]` (Department Drilldown)
- **Breadcrumb**: `Home > Admin Analytics > [Department Name]`
- **Header**: Department aggregate metrics (Headcount, Average Readiness %, Priority Flag status).
- **Data Table**: Official-by-official list with:
  - Official Name, Designation & Cadre
  - Current Readiness Index % (with micro `<ProgressRing />`)
  - Top Unresolved Gap
  - Evidence status (🛡️ Assessment-Verified vs ✍️ Self-Assessed)
  - Action: "View Full Profile" (links directly to `/profile?userId=...`)

### Route 3: `/admin/analytics/correlation` (Outcome Correlation Engine)
- **Breadcrumb**: `Home > Admin Analytics > Outcome Correlation`
- **Metric Tabs**: Switch between 3 MoSPI field scrutiny metrics (Schedule 0.0 Listing, HCES Recall Period, Outlier Rejection).
- **Visual Container**:
  - `<ScatterChart />` with linear regression trendline, interactive hover tooltips showing department audit details.
  - **Watermark**: SVG `<text>` "SIMULATED DEMO DATA — NOT REAL OUTCOMES" rendered at 45° angle with 8% opacity.
  - **Methodology Card**: Explains how field scrutiny error rates from MoSPI guidelines correlate with FRAC competency mastery.
  - `<ProvenanceBadge provenance="SYNTHETIC_DEMO_DATA" />` visibly anchored in header.
  - **Zero/Single Data State**: Graceful fallback banner if filtered dataset contains fewer than 2 points.

---

## 5. UI Components (Bespoke SVG)

1. **`<ScatterChart />`**:
   - Pure SVG implementation (zero charting dependencies).
   - Dynamic `viewBox` coordinates with responsive scaling.
   - Computes linear regression using `calculateLinearRegression()`. If `!isComputable`, displays clear "Insufficient data points to compute trend line" fallback.
   - SVG "SIMULATED DATA" watermark overlay.
2. **`<BarChart />`**:
   - Clean horizontal progress bars for department readiness comparisons with semantic color thresholds (≥70% emerald, 50–69% amber, <50% rose).
3. **`<SparkLine />`**:
   - Lightweight inline SVG curve visualizing 6-month historical readiness trend.
4. **`<FlagDepartmentModal />`**:
   - Accessible dialog supporting department selection, role scoping, and reason notes with validation.

---

## 6. Standing i18n Guardrail

To prevent translation regressions in Phase 6 and future releases:
- Implement `scripts/check-i18n.ts` (executable via `npm run test:i18n` and in CI).
- Automatically scans all `.tsx` files in `src/app` and `src/components` for raw JSX text nodes not wrapped in `useTranslations()` / translation keys.
- Ensures 100% key parity between `src/messages/en.json` and `src/messages/hi.json`.

---

## 7. Verification & Testing Strategy

### 7.1 Unit Tests (`src/services/adminService.test.ts`)
1. **Workforce Aggregation**: Validates accurate computation of `totalOfficials`, `avgReadiness`, and `criticalGaps`.
2. **Department Grouping**: Correctly groups multi-cadre users and calculates per-department averages.
3. **Linear Regression Edge Cases**:
   - N = 0 data points → returns `{ isComputable: false }`.
   - N = 1 data point → returns `{ isComputable: false }`.
   - N ≥ 2 points → validates accurate mathematical slope, intercept, and R² calculation.

### 7.2 API Authorization & Security Tests (`src/app/api/admin/flag-department/route.test.ts`)
1. **Role Enforcement**: Authenticated `learner` or `trainer` receives `403 Forbidden`.
2. **Authentication Gate**: Unauthenticated request receives `401 Unauthorized`.
3. **Cross-Tenant Isolation**: Admin session with `organization_id = Org_A` cannot write or query records for `Org_B`. The `organization_id` written to PostgreSQL is strictly derived from the verified session claims.

### 7.3 Build & Integration Verification
- `npx next build` compiles cleanly with 0 TypeScript and ESLint errors.
- Realtime subscription verified across simultaneous browser tabs.
