# Rules.md

## StatVidya — Development Rules, Constraints & Boundaries

| Field | Value |
|---|---|
| Companion docs | PRD.md, Architecture.md, Phases.md, Design.md, memory.md |
| Purpose | Codify what we do, what we avoid, and where every boundary is — libraries, error handling, AI, naming, security |
| Status | **Active v3.0 — Firebase Architecture (Auth, Firestore, Storage, Security Rules)** |

> **Read this before writing any code.** Every rule here exists because of a specific architectural decision in **PRD.md** and **Architecture.md**. If a rule conflicts with an ad-hoc implementation shortcut, the rule wins until it is formally amended.

---

## Table of Contents

1. [General Principles](#1-general-principles)
2. [What We Do](#2-what-we-do)
3. [What We Avoid](#3-what-we-avoid)
4. [Library & Dependency Rules](#4-library--dependency-rules)
5. [TypeScript & Code Style](#5-typescript--code-style)
6. [Error Handling & Boundaries](#6-error-handling--boundaries)
7. [Security & Firestore Rules](#7-security--firestore-rules)
8. [AI Boundaries & Multi-Provider Rules](#8-ai-boundaries--multi-provider-rules)
9. [Data & Provenance Rules](#9-data--provenance-rules)
10. [Testing Rules](#10-testing-rules)
11. [Git & Workflow Rules](#11-git--workflow-rules)
12. [Performance Rules](#12-performance-rules)

---

## 1. General Principles

1. **Server Enforces, Client Suggests**:
   - Any value that affects a competency level, assessment score, or audit record is computed and written server-side via Firebase Auth token verification and Security Rules.
   - Client-side checks are UI/UX conveniences, never security boundaries.
2. **Offline is a First-Class State, Not an Error**:
   - The application must handle offline operation gracefully via IndexedDB + Firestore offline persistence. Never throw an unhandled exception or display a generic network error modal when connectivity drops.
3. **Structural Provenance Over Convention**:
   - Every domain-data record (competencies, roles, activities, courses, questions) must carry a `provenance` field enforced at the TypeScript type level.
4. **Zero-Trust Multi-Tenancy**:
   - All database documents holding user data must include `organization_id`. Every Firestore Security Rule policy must strictly isolate queries by organization.
5. **Unified Firebase Platform Topology**:
   - Large PDFs stream directly to Firebase Storage (`storage.rules`).
   - Real-time document data and transactional mutations live in Cloud Firestore (`firestore.rules`).
   - Authentication and identity management run through Firebase Authentication.

---

## 2. What We Do

### 2.1 Architecture & Structure

- **Follow Next.js 15 App Router Conventions**:
  - Route handlers live in `app/api/.../route.ts`.
  - Pages live in `app/.../page.tsx`.
  - Layouts live in `app/.../layout.tsx`.
- **Maintain Clear Component Boundaries**:
  - Distinguish Server Components (default) from Client Components (`'use client'`). Use Client Components only when requiring browser APIs, React hooks (`useState`, `useEffect`), or interactive event listeners.
- **Keep Services Framework-Agnostic**:
  - Service files in `services/` must not import React hooks or Next.js routing APIs. They are pure TypeScript modules consumed by components or Edge Functions.
- **Co-locate Page-Specific Components**:
  - If a component is used only on a specific page, place it in that route's directory or subfolder. Shared components belong in `components/ui/`, `components/layout/`, or `components/charts/`.

### 2.2 Data & State

- **Cloud Firestore is the Source of Truth**:
  - Derived values (gap severity, readiness index) are calculated fresh via service formulas or database views to prevent state drift.
- **Offline Writes Queue Locally**:
  - Assessment submissions generated while offline are written immediately to IndexedDB (`pending_assessments`) using a deterministic `local_id` UUID, and auto-synced upon reconnect.
- **Enforce Provenance at the Schema Level**:
  - All seed records must have a non-null `provenance` enum value: `VERIFIED_OFFICIAL`, `PROPOSED_FRAMEWORK`, `PROPOSED_METHODOLOGY`, or `SYNTHETIC_DEMO_DATA`.

### 2.3 i18n & Accessibility

- **All UI Strings via Localization**:
  - Never hardcode user-visible strings in JSX. Use dictionary keys from `en.json` and `hi.json`.
- **Bilingual Parity**:
  - Every new string added to `en.json` must be accompanied by its verified Hindi equivalent in `hi.json` in the same commit.
- **Field-First Touch Targets**:
  - Interactive buttons and inputs must maintain a minimum touch target of 48px to accommodate field tablets held in outdoor environments.

### 2.4 Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Components | PascalCase | `RadarChart.tsx`, `ProvenanceBadge.tsx` |
| Services | camelCase | `competencyService.ts`, `storageService.ts` |
| Hooks | camelCase, `use` prefix | `useOfflineStatus.ts`, `useCompetencies.ts` |
| Types / Interfaces | PascalCase | `CompetencyRecord`, `AssessmentResult` |
| Enums | PascalCase | `Provenance.VerifiedOfficial` |
| Firestore Collections | camelCase, plural | `competencyRecords`, `auditLogs` |
| Firestore Fields | camelCase | `organizationId`, `isOfflineSync` |
| Environment Variables | UPPER_SNAKE_CASE | `NEXT_PUBLIC_FIREBASE_API_KEY`, `FIREBASE_ADMIN_PRIVATE_KEY` |

---

## 3. What We Avoid

### 3.1 Absolute Don'ts

| ❌ Don't | Why |
|---|---|
| Don't expose AI API keys or `FIREBASE_ADMIN_PRIVATE_KEY` in client code or `.env` | Catastrophic security breach; credentials get leaked in bundle. All privileged operations route through Firebase Cloud Functions or Next.js server actions. |
| Don't write to `competency_records` or `assessment_results` from the client | Server-side only. Client tampering must never fabricate competency scores or levels. |
| Don't omit `organization_id` on any multi-tenant database entity | Violates tenant isolation and breaks security rules. |
| Don't omit `provenance` on any domain data entity | Breaks government trust and PRD FR-TRUST-1 compliance. |
| Don't use `any` in TypeScript | Use `unknown` and narrow with type guards, or define a concrete interface. |
| Don't route large PDF uploads through Next.js server memory | Wastes bandwidth, chokes server memory, and incurs unnecessary egress charges. Stream directly to Firebase Storage. |
| Don't hardcode strings in JSX | Prevents complete Hindi localization for field investigators. |

### 3.2 Architectural Anti-Patterns

- **No Redux or heavyweight state libraries**: TanStack Query + React Context is clean and sufficient for this scale.
- **No micro-frontends**: StatVidya is a unified Next.js 15 application shell.
- **No client-side AI calls**: The browser never connects directly to Gemini, Anthropic, or OpenAI.
- **No monolithic utility dumps**: Keep utilities domain-focused (`formatUtils.ts`, `idbUtils.ts`).

---

## 4. Library & Dependency Rules

### 4.1 Approved Dependencies

| Category | Approved Library | Rationale |
|---|---|---|
| **Framework** | Next.js 15 + React 19 | SSR/SSG hybrid, Edge middleware, server components |
| **Language** | TypeScript 5.5+ | Enforced static types with strict compiler options |
| **Styling** | Tailwind CSS v4 | Native `@theme inline`, OKLCH colors, zero config file |
| **UI Primitives** | shadcn/ui + Radix UI | Accessible, unstyled primitives, customizable |
| **PWA / Service Worker** | `@serwist/next` | Workbox-based service worker built specifically for Next.js App Router |
| **Offline Storage** | `idb` | Lightweight, typed wrapper around browser IndexedDB |
| **Database Client** | `firebase`, `firebase-admin` | Native connection to Cloud Firestore, Auth & Realtime |
| **Object Storage SDK** | `firebase/storage` | Managed zero-egress document and PDF storage |
| **PDF Extraction** | `pdf.js` + `tesseract.js` | Client-side chunking and OCR fallback for scanned training manuals |
| **Charts** | Recharts + Bespoke SVG | Recharts for scatter/trendlines; bespoke SVG for radar charts and progress rings |
| **Icons** | Lucide React | Clean, modern, accessible vector iconography |
| **Testing** | Vitest + Testing Library | Fast unit and component test runner |

### 4.2 Explicitly Banned Libraries

- `axios` (native `fetch` is standard)
- `moment.js` (use native `Intl` or lightweight `date-fns`)
- `styled-components` / `emotion` (Tailwind CSS v4 is the exclusive styling system)
- Full `lodash` bundle (use vanilla TypeScript or tree-shaken helpers)

---

## 5. TypeScript & Code Style

### 5.1 tsconfig Rules

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 5.2 Style Standards

- **Maximum function length**: ~40 lines. Extract sub-helpers for complex logic.
- **Maximum file length**: ~300 lines for components, ~500 for services.
- **No magic numbers**: Always extract calculation coefficients (e.g., `PRIORITY_WEIGHT = { critical: 3, important: 2, desirable: 1 }`) into named constants referencing the PRD.
- **Named exports only**: Use named exports across all components and utilities. (Next.js route pages export default as required by the framework).

---

## 6. Error Handling & Boundaries

### 6.1 Layered Error Strategy

| Layer | Implementation |
|---|---|
| **Next.js Pages** | Wrap routes in `error.tsx` displaying localized fallback UI with a retry affordance. |
| **Service Modules** | Throw structured `AppError` instances with error code, translatable message, and debug context. |
| **Firebase Functions** | Return HTTP 4xx/5xx with structured JSON `{ error: { code, message } }`. Never expose database stack traces. |
| **Offline Sync** | Failed network submissions stay in IndexedDB with incremented `attempts` count and exponential backoff retry. |
| **AI Invocations** | Wrap external AI requests in automated fallback chain: Gemini → Claude → GPT → Rule-based engine. |

### 6.2 AppError Interface

```typescript
export interface AppError {
  code: string;           // e.g., "ASSESSMENT_SYNC_FAILED", "STORAGE_UPLOAD_ERROR"
  message: string;        // Localized, user-safe message
  context?: Record<string, unknown>; // Internal debugging metadata
  retryable: boolean;     // Drives UI retry button display
}
```

---

## 7. Security & Firestore Rules

1. **Firestore Security Rules are Mandatory**:
   - Every collection must enforce strict access control in `firestore.rules`.
   - Reads and writes are filtered by `request.auth != null` and tenant boundaries.
2. **Deny Client Writes on Critical Entities**:
   - Collections `competencyRecords`, `assessmentResults`, and `auditLogs` reject direct client writes. Mutations execute solely through Firebase Admin SDK in trusted contexts.
3. **Immutable Audit Trails**:
   - `auditLogs` is strictly append-only. Any attempt to update or delete documents is rejected by `firestore.rules`.
4. **Secrets Separation**:
   - `NEXT_PUBLIC_FIREBASE_*` variables are exposed to the browser. Never place admin private keys in variables with this prefix.
5. **Session Verification via Auth Tokens**:
   - Protected routes validate Firebase ID tokens / auth state before rendering protected layouts.

---

## 8. AI Boundaries & Multi-Provider Rules

### 8.1 Ethical & Regulatory Boundaries

- **Human-in-the-Loop Mandatory**: AI generates candidate MCQs, but a human trainer **must review and approve** every question before it enters the official Question Bank.
- **No Automated Competency Promotion**: Assessment grading and competency promotions are strictly deterministic mathematical formulas. AI is never permitted to adjust an official's competency level.
- **Grounded Explanations**: Gap narration and admin summaries must be strictly grounded in database records. Hallucinated numbers or fabricated performance metrics are strictly forbidden.
- **Confidence Tagging**: Every AI-generated question must include a confidence tag (`HIGH`, `MEDIUM`, `LOW`) to facilitate trainer triage.

### 8.2 Fallback Execution Order

```
1. Google Gemini 2.5 Flash / Firebase AI Logic
   ↓ (on rate-limit, timeout, or error)
2. Anthropic Claude 3.5 Sonnet
   ↓ (on failure)
3. OpenAI GPT-4o-mini
   ↓ (if all cloud providers are unreachable)
4. Local Rule-Based Question Generator (`services/questionGenerator.ts`)
```

---

## 9. Data & Provenance Rules

### 9.1 Provenance Hierarchy

| Label | Definition | Usage Context |
|---|---|---|
| `VERIFIED_OFFICIAL` | Sourced directly from official government gazettes, MoSPI mandates, or FRAC documentation | FRAC Roles, Core Activities, Ministry Cadres |
| `PROPOSED_FRAMEWORK` | StatVidya team's proposed competency definitions and level descriptors | Competency descriptions, L1–L5 behavioral rubrics |
| `PROPOSED_METHODOLOGY` | Mathematical formulas and algorithms created by StatVidya | Gap severity formula, readiness index weighting |
| `SYNTHETIC_DEMO_DATA` | Simulated data generated for hackathon demonstration | Course catalog, survey quality outcome correlations |

### 9.2 Data Validation Rules

- Every domain object must compile with a valid `provenance` field.
- The UI must render a `<ProvenanceBadge>` on every component presenting domain data.
- Seed data scripts must validate 100% provenance coverage prior to executing database insertions.

---

## 10. Testing Rules

### 10.1 Formula Verification (Non-Negotiable)

The following core algorithms must have 100% test coverage via Vitest:
1. `severityScore(target, current, priority)`: Must verify that a Critical gap ($\Delta=1$) ranks higher than a Desirable gap ($\Delta=2$).
2. `severityBucket(score)`: High ($\ge 6$), Moderate ($3-5$), Proficient ($\le 2$).
3. `readinessIndex(userCompetencies, roleRequirements)`: Must return 100% when all requirements are satisfied.
4. `adaptiveBranching(answers)`: Must converge to correct L1–L5 levels across simulated learner patterns.
5. `recommendationRanking(courses, userGaps)`: Must prioritize courses addressing the highest severity gaps.

---

## 11. Git & Workflow Rules

- **Branch Naming**: `feature/phase{N}-{feature-name}` (e.g., `feature/p1-firebase-auth`).
- **Commit Messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat(auth): integrate simulated Parichay SSO persona switcher [FR-AUTH-2]`
  - `fix(offline): resolve IndexedDB sync retry idempotency [FR-OFFLINE-2]`
  - `docs(arch): update to Firebase-only topology`
- **Release Gating**: Merges to `main` require all Vitest suites to pass and TypeScript compilation with zero errors.

---

## 12. Performance Rules

- **Lighthouse Performance Score**: $\ge 90$ on desktop and mobile.
- **Initial Dashboard Load Time**: $< 3.0$ seconds on simulated 4G mobile network.
- **PWA Cached Shell Load Time**: $< 1.5$ seconds in offline mode.
- **Large Document Uploads**: Chunks must not exceed memory bounds; direct streaming to Firebase Storage.
- **Bundle Budget**: Initial client JavaScript bundle $< 250$ KB gzipped.

---

*End of rules.md. Companion document: Architecture.md.*
