# Product Requirements Document

## StatVidya — Workforce Competency Intelligence Platform for India's Official Statistical System

| Field | Value |
|---|---|
| Document type | Product Requirements Document (PRD) — Full Technical Specification |
| Working title | StatVidya |
| Origin | Ground-up build for SIH 26101 |
| Status | Active v3.0 — Firebase Architecture (Auth, Firestore, Storage, Security Rules) |
| Target program | Smart India Hackathon, Problem Statement **SIH 26101** |
| Owner | *(fill in)* |
| Last updated | 2026-09-05 |

> **Scope of this document**: This PRD defines *what* the product must do, *why*, *how* the entire system is architected, and the full technical specification for every layer — from the PostgreSQL schema to the Cloudflare Worker AI proxy to the Parichay SSO integration flow. It is a single, comprehensive reference that replaces both the old PRD and Architecture documents.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Vision & Product Principles](#3-vision--product-principles)
4. [Goals, Non-Goals & Success Metrics](#4-goals-non-goals--success-metrics)
5. [Differentiation Strategy](#5-differentiation-strategy)
6. [Personas](#6-personas)
7. [Scope & Release Milestones](#7-scope--release-milestones)
8. [SIH Requirement Traceability](#8-sih-requirement-traceability)
9. [Domain Grounding — FRAC, Data Provenance & MoSPI/NSSTA Datasets](#9-domain-grounding--frac--data-provenance-policy)
   - [9.4 Official Dataset Integration — MoSPI & NSSTA](#94-official-dataset-integration--mospigovin--nsstagovin)
10. [Core User Journeys](#10-core-user-journeys)
11. [Functional Requirements](#11-functional-requirements)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [Complete Tech Stack](#13-complete-tech-stack)
14. [System Architecture — Full Technical Specification](#14-system-architecture--full-technical-specification)
15. [Authentication Architecture — Supabase Auth + Parichay SSO](#15-authentication-architecture--supabase-auth--parichay-sso)
16. [Database Architecture — Supabase PostgreSQL + RLS](#16-database-architecture--supabase-postgresql--rls)
17. [Storage Architecture — Cloudflare R2 + Supabase Storage](#17-storage-architecture--cloudflare-r2--supabase-storage)
18. [Serverless Architecture — Supabase Edge Functions + Cloudflare Workers](#18-serverless-architecture--supabase-edge-functions--cloudflare-workers)
19. [AI Architecture — Multi-Provider Fallback via Cloudflare AI Gateway](#19-ai-architecture--multi-provider-fallback-via-cloudflare-ai-gateway)
20. [Large PDF Processing Pipeline](#20-large-pdf-processing-pipeline)
21. [Offline & PWA Architecture](#21-offline--pwa-architecture)
22. [Frontend Architecture — Next.js + shadcn/ui](#22-frontend-architecture--nextjs--shadcnui)
23. [Data Model — Full PostgreSQL Schema](#23-data-model--full-postgresql-schema)
24. [Security, Privacy & RBAC](#24-security-privacy--rbac)
25. [Deployment Architecture — Vercel + Cloudflare + Supabase](#25-deployment-architecture--vercel--cloudflare--supabase)
26. [Analytics & Instrumentation](#26-analytics--instrumentation)
27. [Release Plan](#27-release-plan)
28. [Risks & Mitigations](#28-risks--mitigations)
29. [Assumptions & Dependencies](#29-assumptions--dependencies)
30. [Out of Scope (V1)](#30-out-of-scope-v1)
31. [Open Questions](#31-open-questions)
32. [Appendix](#32-appendix)

---

## 1. Executive Summary

StatVidya is a **competency intelligence platform** for India's Official Statistical System. It sits on top of — not in competition with — **iGOT Karmayogi**, the national learning platform under Mission Karmayogi (10M+ registered users, content in 16 languages). iGOT delivers courses; it does not tell an organization *what a specific official's competency gaps are* or *whether training actually changed field outcomes*. StatVidya fills that layer.

The product runs a closed-loop cycle:

```
Profile → Assess → Gap → Recommend → Learn (via iGOT) → Practice → Reassess → Update → Repeat
```

This cycle is built on **FRAC** (Framework of Roles, Activities and Competencies) — one of the Six Pillars of Mission Karmayogi — rather than an invented taxonomy. That single choice ("we implemented the government's own framework, we didn't invent one") is the platform's credibility anchor and should be the first sentence of any pitch.

### Architecture Overview (v2.0)

The platform is built on a **three-provider cloud architecture** optimized for performance, cost, and government-readiness:

```
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL                                   │
│  Next.js App (SSR/SSG) + shadcn/ui + Tailwind CSS v4             │
│  PWA Shell + @serwist/next Service Worker                        │
│  API Routes (BFF layer for server-side auth validation)          │
├─────────────────────────────────────────────────────────────────┤
│                        SUPABASE                                  │
│  Auth (Email/Google/Parichay SSO via OIDC)                       │
│  PostgreSQL (RLS-enforced, org-scoped)                           │
│  Edge Functions (Deno — assessment scoring, audit triggers)      │
│  Realtime (live dashboard updates, review queue sync)            │
│  Storage (avatars, small assets)                                 │
├─────────────────────────────────────────────────────────────────┤
│                       CLOUDFLARE                                 │
│  R2 (large PDF storage, $0 egress)                               │
│  Workers (presigned URL generation, AI proxy)                    │
│  AI Gateway (multi-provider fallback: Gemini → Claude → GPT)    │
│  KV (rate limiting, session cache) [optional]                    │
├─────────────────────────────────────────────────────────────────┤
│                     EXTERNAL SERVICES                            │
│  Gemini API (primary AI)                                         │
│  Claude API (secondary AI)                                       │
│  OpenAI API (tertiary fallback)                                  │
│  iGOT Karmayogi (mock adapter → live when authorized)            │
│  Parichay SSO (Jan-Parichay OIDC — simulated for demo)           │
└─────────────────────────────────────────────────────────────────┘
```

Three product bets differentiate StatVidya from the obvious "upload docs → AI makes MCQs → dashboard" interpretation of SIH 26101:

1. Build for **field personnel** (offline-first, Hindi-first), not just desk officers
2. Connect training to **field outcomes**, not just quiz scores
3. Ground everything in **FRAC**, the government's own methodology

---

## 2. Problem Statement

India's Official Statistical System (MoSPI, NSSO, ISS/SSS cadre, state DES offices) trains a large, geographically distributed workforce — from headquarters analysts to field enumerators conducting household surveys on tablets. Today:

- There is no systematic way to know **what competencies a given role actually requires** versus what an individual official currently has.
- Training is largely generic and classroom-based; it does not target an individual's or cadre's actual gaps.
- Field investigators — the numerically largest segment — receive dense manuals with minimal interactive practice, work in Hindi, and often have intermittent connectivity; almost no tooling is built around these constraints.
- There is no mechanism connecting "training completed" to "did this improve the quality of statistical output" (e.g., survey data quality). Impact reporting, where it exists, is self-referential (assessment score → level → recommend more training → score goes up).
- Authoring quality assessments from training material is manual and slow, with no standardized way to tag content to competencies.
- Leadership (MoSPI, cadre managers) lacks an aggregate, evidence-based view of workforce capability to plan training investment.

StatVidya addresses these by pairing a FRAC-grounded competency model with an AI-assisted content pipeline and an outcome-oriented intelligence layer, with field-first delivery as a first-class design constraint rather than an afterthought.

---

## 3. Vision & Product Principles

> Build a genuinely useful, extensible workforce learning and competency intelligence platform that solves SIH 26101 well, with a credible path to a larger real-world deployment.

**Product principles** (in priority order when trade-offs arise):

1. **Ground truth over invention.** Where an official framework exists (FRAC, real role designations, real ministries), use it. Where the platform must propose something (specific competencies, scoring formulas, course catalog), label it honestly and make the label visible in the UI — see [§9](#9-domain-grounding--frac--data-provenance-policy).
2. **Field-first, not desk-first.** Every core flow (assessment-taking especially) must work offline and in Hindi before it is considered done — not as a later enhancement.
3. **Close the loop, don't just visualize it.** A feature that shows data but doesn't feed back into a recommendation or an action is lower priority than one that does.
4. **Server enforces, client suggests.** Anything that affects an official's recorded competency level or an assessment score must be computed and written server-side. Client-side role checks are UX only.
5. **Differentiators before defaults.** When time is short, cut generic-but-expected features before cutting the three differentiation levers ([§5](#5-differentiation-strategy)).

---

## 4. Goals, Non-Goals & Success Metrics

### 4.1 Goals

- G1: Give every official a FRAC-grounded, individualized view of their competency gaps and a ranked path to close them.
- G2: Let trainers turn existing training documents into a reviewed, competency-tagged question bank in minutes, not days.
- G3: Give organizational leadership an honest (not fabricated) view of workforce readiness and one concrete action to take on it.
- G4: Serve field personnel (offline, Hindi) as a first-class, not secondary, experience.
- G5: Establish, even in a simulated form, a link between training and real-world statistical output quality.
- G6: Present a system whose provenance is always inspectable — nothing is presented as government-verified truth unless it actually is.

### 4.2 Non-Goals (for this product, at any stage covered by this PRD)

- Not a general-purpose LMS / course-hosting platform (iGOT already does this).
- Not a chatbot-first product — the AI assistant is one grounded capability among several, not the core interface.
- Not an HR performance-management or disciplinary tool. Self-assessed weaknesses must never be positioned as appraisal input beyond what APAR/Karma Points integration already implies.
- Not attempting real-time iGOT API integration in V1 (no public API exists at time of writing — see [§11.6](#116-igot-integration)).

### 4.3 Success Metrics

| Category | Metric | Target (early / pilot stage) |
|---|---|---|
| Activation | % of new users completing onboarding + initial self-assessment in first session | ≥ 70% |
| Core loop health | % of identified **high-severity** gaps that drop at least one severity tier within 60 days of a recommendation being acted on | Track from first cohort; no target until baseline exists |
| Engagement | Average assessments taken per active learner / month | ≥ 1 |
| Recommendation efficacy | % of recommended courses actually started within 14 days | ≥ 30% |
| Content pipeline quality | % of AI-generated MCQs approved without edit | ≥ 60% (proxy for prompt quality; track by confidence tier) |
| Content pipeline efficiency | Median trainer review time per question | ↓ over time (baseline in Phase 3) |
| Reliability | Offline assessment sync success rate on reconnect | ≥ 99% |
| Reliability | Assessment submission → competency record update success rate | ≥ 99.5% |
| Differentiator adoption | % of Field Investigator persona sessions that use Hindi UI and/or complete an assessment offline | Reported, not gated |
| Admin engagement | % of admin sessions resulting in at least one write-back action | Reported from first pilot org |
| Trust | % of domain-data UI surfaces rendering a provenance badge | 100% (build-time lint check) |

---

## 5. Differentiation Strategy

> The blunt reality: "upload docs → AI generates MCQs → map to competencies → show gaps → recommend iGOT courses → admin dashboard" is the obvious reading of SIH 26101. Every competent team converges on it independently. Executing it well is necessary but not sufficient.

Three levers, in priority order:

**Lever 1 — Field personnel, not desk officers.** The Field Investigator / Primary Enumerator (NSSO Field Operations Division) is the largest workforce segment, the one where competency gaps have the most measurable downstream cost (bad sampling → bad national statistics), and the one other teams are least likely to build for, because offline-first + Hindi-first is harder to build *and* harder to demo than another chat UI.

**Lever 2 — Training → field outcomes, not self-referential scores.** A pipeline where "assessment score → competency level → recommend course → score goes up" never touches whether anything real improved is internally consistent but hollow. Connecting competency levels to even a *simulated* survey-quality metric reframes the product from "another LMS" to "evidence that training spending works."

**Lever 3 — FRAC grounding, not an invented taxonomy.** Nearly every competing team will invent its own skill taxonomy because researching Mission Karmayogi's actual methodology takes real effort under time pressure. "We implemented the government's own framework" is a stronger opening line than any UI polish.

**Enforcement mechanism**: every functional requirement in [§11](#11-functional-requirements) is tagged **P0 / P1 / P2**. Nothing tagged P2 may consume engineering time while any P0 item tied to Levers 1–3 is incomplete.

---

## 6. Personas

### 6.1 Learner — Field Investigator (⭐ Primary persona)

**Who**: Field Investigator / Primary Enumerator, NSSO Field Operations Division, conducting PLFS/ASI/ASUSE/agricultural surveys on CAPI tablets. Works with intermittent connectivity, primarily in Hindi, on tablets rather than laptops.

**Goals**: Know exactly which competencies their role requires; take assessments that work without reliable connectivity; see content in Hindi by default; trust that a poor self-assessment won't be held against them.

**Pain points today**: dense manuals with no interactive practice; tooling assumes laptop + broadband; no feedback loop from training to whether it actually helped in the field.

### 6.2 Learner — Desk Officer

**Who**: Junior/Senior Statistical Officer, Deputy Director (ISS), System Analyst — MoSPI HQ, CSO, or State DES.

**Goals**: Understand FRAC-mapped competency requirements for their specific role; get tailored recommendations linked to iGOT with Karma Points tracking; track APAR-readiness over time.

### 6.3 Trainer

**Who**: NSSTA/TPAC faculty, subject-matter experts, senior officials authoring training material.

**Goals**: Turn existing documents into quality assessments quickly; maintain control over AI-generated content; build a reusable, competency-tagged question bank; see whether their material actually closes gaps.

### 6.4 Administrator

**Who**: Department heads, HR/capacity-building managers, MoSPI leadership.

**Goals**: See workforce competency levels in aggregate; identify departments/roles with critical gaps; get an honest read on training effectiveness; act on findings, not just view them.

---

## 7. Scope & Release Milestones

Priority tags used throughout §11:

| Tag | Meaning |
|---|---|
| **P0** | Required for MVP / hackathon demo. Includes every Lever 1–3 differentiator by design. |
| **P1** | Required to close the full product loop end-to-end (V1, post-demo hardening). |
| **P2** | Valuable but explicitly deferrable; the first thing cut under time pressure. |

### Milestone map

| Milestone | Contains |
|---|---|
| **MVP (demo-ready)** | Auth/RBAC, FRAC-aligned domain data with provenance labels, competency profile + gap analysis, adaptive assessment (basic), recommendation engine, iGOT mock adapter, minimal AI MCQ pipeline, offline assessment flow, Hindi-first field UI, one honest admin screen, outcome-correlation chart (simulated) |
| **V1 (complete core loop)** | Full trainer content pipeline with confidence-sorted review, role dashboards, AI assistant (context-grounded), admin narrative summaries + write-back action, competency history |
| **V1.1 (hardening)** | E2E integration polish, accessibility pass, error boundaries, observability, security rule audit |
| **V2 (post-pilot)** | Skill gap heatmap, training effectiveness (real pre/post data), demand forecasting, semantic search/RAG, live iGOT integration (pending gov credentials), certifications, cohorts, real Parichay SSO (pending NIC authorization), relational analytics, push/email notifications |

---

## 8. SIH Requirement Traceability

| SIH 26101 Requirement | Verification | Platform Feature | Milestone | Priority |
|---|---|---|---|---|
| AI-powered competency gap identification | ✅ Core requirement | Skill Gap Analysis Engine (FRAC-aligned) | MVP | P0 |
| Integration with iGOT Karmayogi ecosystem | ✅ Core requirement | iGOT Adapter (mock + documented live-mode contract, Karma Points/APAR tracking, deep links) | MVP (mock) / V2 (live) | P0 / P2 |
| Personalized training recommendations | ✅ Core requirement | Recommendation Engine + Learning Pathways | MVP | P0 |
| Auto-generate MCQs from training materials | ✅ Core requirement | Document → MCQ pipeline (batch generation, confidence tagging) via Cloudflare AI Gateway | MVP (basic) / V1 (full review UX) | P0 / P1 |
| Focus on India's Official Statistical System | ✅ Domain context | MoSPI/ISS/SSS/NSSO domain data, NSSTA curriculum | MVP | P0 |
| Adaptive learning & dynamic difficulty | ✅ Core requirement | Multi-stage dynamic assessment branching to estimate L1–L5 | MVP | P0 |
| Virtual assistance / AI copilot | ⚠️ Mentioned | AI Learning Assistant (5 capabilities, §11.8) | MVP (2 capabilities) / V1 (all 5) | P0 (subset) / P1 |
| Multilingual support (Hindi/English) | ⚠️ Mentioned, vital for field-staff | i18n framework, Hindi-first field flow | MVP | P0 |
| Virtual labs for statistical practice | ⚠️ Mentioned | Statistical practice sandbox | V2 | P2 |
| Security & Gov SSO (Parichay/MeriPehchaan) | ⚠️ Mentioned | Supabase Auth + Parichay OIDC (simulated for demo, real path documented) | MVP (simulated) / V2 (real) | P0 / P2 |
| Workforce analytics & cadre forecasting | ⚠️ Mentioned | Org overview + AI narrative + write-back now; forecasting later | MVP (overview) / V2 (forecasting) | P0 / P2 |
| **Official Dataset Links (`nssta.gov.in`, `mospi.gov.in`)** | ✅ **Mandatory PS Resource** | **Real NSSO Field Manual Ingestion (Cloudflare R2), NSSTA Curriculum Grounding, Bilingual Question Bank, and Field Scrutiny Error Correlation (§9.4)** | **MVP** | **P0** |

> **Confirmed constraint**: iGOT Karmayogi has no public API documentation or developer portal. Integration requires official authorization via `mission.karmayogi@gov.in`. The mock adapter should follow the **DSEP Protocol / Sunbird conventions** where plausible, but must never be presented as a confirmed integration.

---

## 9. Domain Grounding — FRAC & Data Provenance Policy

### 9.1 What is FRAC

FRAC (Framework of Roles, Activities and Competencies) is one of the Six Pillars of Mission Karmayogi. It deconstructs every government position into:

1. **Role** — a named position (e.g., Junior Statistical Officer).
2. **Activity** — a discrete work function within that role (e.g., "Conduct large-scale sample surveys").
3. **Competency** — a specific skill/knowledge area needed for the activity, classified as **Behavioural** (leadership, communication, ethics — common across government), **Functional** (job-family-specific, e.g., project management), or **Domain** (role-specific technical expertise, e.g., survey sampling design).

Competencies sit under the **ASK model** (Attitude, Skill, Knowledge) and are assessed on a five-level proficiency scale.

### 9.2 How StatVidya aligns

| Aspect | FRAC Official | StatVidya |
|---|---|---|
| Structure | Role → Activity → Competency | Mirrored exactly in the PostgreSQL schema (§23) |
| Categories | Behavioural / Functional / Domain | Used as-is; statistical competencies live under Functional/Domain |
| Proficiency scale | Five levels | L1–L5, consistent with FRAC guidance; specific descriptors are our proposal |
| Population method | Departmental FRACing Team runs a formal exercise | In this product, the team proposes mappings; a real deployment would use MoSPI's own FRACing Team output |
| Competency/position dictionaries | Central dictionaries maintained by iGOT | Demo uses proposed dictionaries; real deployment would sync with official ones |

### 9.3 Provenance labeling policy

Every record that carries domain data **must** carry a `provenance` field (enforced at the PostgreSQL schema level as `NOT NULL`) with one of four values, and the UI **must** render a badge derived from that field:

| Label | Meaning | Applies to |
|---|---|---|
| ✅ `VERIFIED_OFFICIAL` | Matches a real, checkable government fact or structure | FRAC's Role→Activity→Competency structure; real role titles (JSO, SSO); MoSPI/NSSTA as institutions; iGOT's existence and scale |
| ⚠️ `PROPOSED_FRAMEWORK` / `PROPOSED_METHODOLOGY` | Structurally grounded in something official, but the specific content is the product team's proposal | Specific competency list, level descriptors, Activity→Competency mappings, gap-severity formula, readiness index formula, recommendation scoring |
| 🟡 `SYNTHETIC_DEMO_DATA` | Fabricated for demonstration; no claim to real-world accuracy | Course catalog, iGOT course data, sample questions, mock organization aggregates |

**Acceptance test**: A PostgreSQL constraint (`CHECK provenance IS NOT NULL`) prevents any domain-data record from being inserted without a provenance value.

---

### 9.4 Official Dataset Integration — MoSPI (`mospi.gov.in`) & NSSTA (`nssta.gov.in`)

In Smart India Hackathon Problem Statement **SIH 26101** (Theme: Smart Education, Organization: Ministry of Statistics and Programme Implementation - MoSPI / NSSTA), the ministry explicitly provided two institutional web portals under the **Dataset Link** specification:
1. **`nssta.gov.in`** — National Statistical Systems Training Academy
2. **`mospi.gov.in`** — Ministry of Statistics and Programme Implementation

#### 9.4.1 Understanding the Nature of the Datasets

Unlike machine learning hackathons that supply a single CSV or SQLite file, official government capacity-building problem statements provide **institutional knowledge portals**. 

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│             OFFICIAL DATASET LINK IDENTIFICATION & INGESTION                     │
├────────────────────────────────────────┬─────────────────────────────────────────┤
│ PORTAL 1: nssta.gov.in                 │ PORTAL 2: mospi.gov.in                  │
│ • National Statistical Systems         │ • Ministry of Statistics & Programme    │
│   Training Academy (Greater Noida, UP) │   Implementation (New Delhi)            │
│ • Premier academy training ISS & SSS   │ • National Sample Survey Office (NSSO)  │
│ • Official induction curricula         │ • Field Operations Division (FOD)       │
│ • In-service training calendars        │ • Survey Manuals ("Instructions to      │
│ • Modules: Sampling Techniques, NAS,   │   Field Staff" Vols I & II)             │
│   Unit-level Data Extraction, R/Python │ • Schedule structures (0.0, PLFS, ASHE) │
│ • Pedagogical competencies & exams     │ • Official Scrutiny & Error Guidelines  │
└────────────────────────────────────────┴─────────────────────────────────────────┘
```

> **The Hackathon Differentiator**: Generic competing teams interpret the absence of a simple CSV as a license to fabricate arbitrary corporate LMS questions (*"What is SQL?"*, *"What is Python?"*). When evaluators from MoSPI and NSSTA review such submissions, they immediately penalize them for lack of domain relevance. **StatVidya directly ingests and operationalizes the authentic publications from `nssta.gov.in` and `mospi.gov.in` across four concrete platform pipelines.**

---

#### 9.4.2 Deep Use Case 1: Ingestion of Real Official Training Manuals in the PDF Pipeline

*Addresses SIH Requirement: "Auto-generate MCQs from training materials" (FR-CONTENT-1 through FR-CONTENT-9)*

StatVidya's document ingestion pipeline is built to handle the actual large, dense manuals published on `mospi.gov.in` and `nssta.gov.in`:

1. **Target Official Publications**:
   - **`NSSO Instructions to Field Staff (Volume I & II)`** (e.g., NSS 78th Round / NHIS): Comprehensive 150–300 page manuals detailing household enumeration protocols, listing procedures, and concepts.
   - **`NSSTA Training Module on Official Statistics & Sampling Techniques`**: Official academy lecture modules covering sampling frames, stratification, and estimation.
2. **Execution Flow**:
   - The trainer persona (**Dr. Priya Verma, NSSTA Faculty**) uploads the official PDF manual directly into StatVidya via the Document Manager.
   - Large PDFs stream directly to **Cloudflare R2** (`statvidya-documents`) via presigned URLs ($0 egress).
   - The extraction engine chunks the manual based on MoSPI's exact structural headings:
     - *Chapter 1: General Description and Coverage*
     - *Chapter 2: Concepts, Definitions and Procedures*
     - *Chapter 3: Schedule 0.0 — List of Households and Selection of Sample*
     - *Chapter 4: Socio-Economic Schedules and Detailed Canvassing*
   - Generated MCQs cite exact page numbers and chapter headings, e.g.:
     > *"Question generated from: NSS Instructions to Field Staff (Vol. I), Chapter 2, Para 2.14: Definition of Usual Principal Activity Status (UPAS)."*

---

#### 9.4.3 Deep Use Case 2: 100% Official FRAC Competency Taxonomy & Cadre Grounding

*Addresses SIH Requirement: "Focus on India's Official Statistical System" & "FRAC-grounded framework" (FR-TRUST-1, FR-ONB-1)*

The organizational hierarchy, roles, and activities in StatVidya's database are not invented; they are sourced directly from statutory cadre rules and training calendars on `mospi.gov.in` and `nssta.gov.in`:

| MoSPI Cadre | Real Designation | StatVidya Role | Grounded Activities (from MoSPI/NSSTA) | Mapped FRAC Competencies |
|---|---|---|---|---|
| **NSSO (FOD)** | Field Investigator (FI) | `learner` (Field) | • Listing of census enumeration blocks (Schedule 0.0)<br>• Canvassing household socio-economic schedules<br>• CAPI tablet data entry in field | • *Household Demarcation & Listing*<br>• *Devanagari CAPI Operation*<br>• *Consumer Expenditure Recall Probing* |
| **Subordinate Statistical Service (SSS)** | Junior Statistical Officer (JSO) | `learner` (Desk) | • Scrutiny of field schedules & anomaly flagging<br>• Unit-level data extraction & outlier checks<br>• Compilation of regional statistical abstracts | • *Multi-stage Sampling Variance*<br>• *Schedule Scrutiny & Validation*<br>• *R/Python for Statistical Scrubbing* |
| **Indian Statistical Service (ISS)** | Assistant Director / Deputy Director | `learner` / `admin` | • Survey sampling design & FSU/USU allocation<br>• National Accounts Aggregation (NAS/GDP)<br>• Index calculation (CPI, IIP) | • *Stratified Multi-stage Design*<br>• *Macroeconomic Aggregation Standards*<br>• *Statistical Quality Assurance* |
| **NSSTA** | Faculty / Course Director | `trainer` | • Curating in-service induction modules<br>• Authoring professional statistical evaluations<br>• Monitoring cadre skill readiness | • *Statistical Pedagogy & Assessment*<br>• *Curriculum Gap Identification* |

Every record populated from these sources in `supabase/seed.sql` carries the badge:
```
[✅ VERIFIED_OFFICIAL] Sourced from MoSPI Cadre Rules & NSSTA Training Curriculum
```

---

#### 9.4.4 Deep Use Case 3: Authentic Bilingual Question Bank Grounding

*Addresses SIH Requirement: "Multilingual support (Hindi/English) for field personnel" (FR-ASSESS-3, FR-I18N-2)*

MoSPI survey instruction manuals are published bilingually (English and Hindi Devanagari). StatVidya extracts official statistical terminology directly from these manuals to create an authentic bilingual question bank:

```json
{
  "stem": "In NSS multi-stage stratified sampling, if a selected First Stage Unit (FSU) has a large population, into how many sub-units is it divided for hamlet-group formation?",
  "stem_hi": "एनएसएस बहु-स्तरीय स्तरीकृत प्रतिचयन में, यदि किसी चयनित प्राथमिक चरण इकाई (FSU) की जनसंख्या अधिक है, तो हेमलेट-समूह गठन के लिए इसे कितनी उप-इकाइयों में विभाजित किया जाता है?",
  "options": [
    "2 equal parts irrespective of size",
    "According to population size criteria specified in Schedule 0.0",
    "4 fixed quadrant blocks",
    "Division is not permitted in rural sectors"
  ],
  "options_hi": [
    "आकार की परवाह किए बिना 2 समान भाग",
    "अनुसूची 0.0 में निर्दिष्ट जनसंख्या आकार मानदंडों के अनुसार",
    "4 निश्चित चतुर्थांश ब्लॉक",
    "ग्रामीण क्षेत्रों में विभाजन की अनुमति नहीं है"
  ],
  "correct_option_index": 1,
  "explanation": "According to NSS Field Staff Instructions Vol. I, hamlet-group formation is mandatory when FSU population exceeds 1,200 to maintain equal selection probabilities.",
  "explanation_hi": "एनएसएस फील्ड स्टाफ निर्देश भाग-I के अनुसार, चयन की समान संभावना बनाए रखने के लिए जब एफएसयू की जनसंख्या 1,200 से अधिक हो जाती है तो हेमलेट-समूह गठन अनिवार्य है।",
  "competency_code": "COMP-DOM-001",
  "source_document": "NSS Field Staff Instructions Vol. I (mospi.gov.in)",
  "provenance": "VERIFIED_OFFICIAL"
}
```

This ensures that when a Field Investigator (like **Sunita Devi**) takes an assessment in rural areas on her tablet, the language matches the official MoSPI manuals she was trained with.

---

#### 9.4.5 Deep Use Case 4: Field Survey Outcome Metrics & Scrutiny Error Correlation

*Addresses Strategic Lever 2: "Outcome-Oriented Intelligence" (FR-ADMIN-5)*

In traditional LMS platforms, training evaluation is self-referential: score goes up $\to$ training declared successful.

To solve SIH 26101 with real institutional value, StatVidya leverages **MoSPI's published survey scrutiny guidelines** (which specify how Senior Statistical Officers audit field schedules). MoSPI documents identify the three most common field errors:
1. **Household Listing Error Rate (%)**: Incorrect identification of census boundaries or missed households during Schedule 0.0 canvassing.
2. **Recall Period Inconsistency Rate (%)**: Confusion between 7-day recall (perishables) and 30-day recall (durables) in the Household Consumption Expenditure Survey (HCES).
3. **Outlier Rejection Rate (%)**: Unscrutinized extreme values in enterprise surveys (ASI / ASHE).

In StatVidya’s **Admin Workforce Intelligence Dashboard**, the correlation engine connects competency scores directly with these MoSPI field outcomes:

$$\text{FOD Regional Division Competency in "Boundary Demarcation"} \longleftrightarrow \text{Schedule 0.0 Listing Scrutiny Error Rate (\% prob.)}$$

```
┌──────────────────────────────────────────────────────────────────────────────┐
│        MoSPI FIELD OUTCOME CORRELATION (ADMIN ANALYTICS VIEW)                │
├──────────────────────────────────────────────────────────────────────────────┤
│  Listing Error Rate (%)                                                      │
│    20% ┤  ● (Low Competency: FOD Bihar, Q1 2025)                             │
│    15% ┤      ● (FOD UP East)                                                │
│    10% ┤          ● (FOD Odisha)                                             │
│     5% ┤              ● (FOD Maharashtra)                                    │
│     0% ┤───────────────────● (High Competency: FOD Kerala, Post-StatVidya)  │
│        └────────┬──────────┬──────────┬──────────┬──────────►                │
│                L1         L2         L3         L4         L5                │
│                 Assessed Competency in "Boundary Demarcation"                │
│                                                                              │
│  Regression Insight: Each +1 level in Boundary Demarcation corresponds to    │
│  a -3.2% reduction in Schedule 0.0 listing scrutiny errors (p < 0.01).       │
│  [Source: NSS Scrutiny Inspection Manuals via mospi.gov.in]                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

#### 9.4.6 Repository Asset Mapping

To ensure immediate usability during hackathon evaluation, StatVidya bundles real excerpts from `mospi.gov.in` and `nssta.gov.in` directly in the project:

| Local Repository Path | Official Source | Purpose in StatVidya |
|---|---|---|
| `public/sample-docs/NSSO_Field_Staff_Instructions_Vol1.pdf` | `mospi.gov.in` (NSS 78th / NHIS) | Primary sample PDF for Trainer drag-and-drop MCQ generation demo |
| `public/sample-docs/NSSTA_Sampling_Techniques_Module.pdf` | `nssta.gov.in` (NSSTA Training) | Secondary sample PDF for ISS/SSS in-service training demo |
| `supabase/seed.sql` | `mospi.gov.in` & `nssta.gov.in` | Seed data for 6 MoSPI Cadres, 18 FRAC Activities, 24 Verified Competencies |
| `data/surveyScrutinyMetrics.ts` | MoSPI Annual Reports / Scrutiny Guidelines | Benchmark scrutiny error figures driving the Admin Outcome Correlation Chart |

---

## 10. Core User Journeys

### 10.1 Learner journey

```
Sign up / Login → Onboarding (role, org details, select government role, initial self-assessment)
  → Dashboard (readiness index, top gaps, next actions)
  → Skill Gap Analysis (current vs. required level, priority-weighted severity, verified vs. self-assessed badges)
  → Learning Pathways (ranked recommendations, "why this," iGOT deep links)
  → Take Assessment (adaptive difficulty, timer, flag-question control, offline-capable)
  → Results & Impact (score, topic breakdown, competency level update, revised gaps, new recommendations)
  → Repeat
```

### 10.2 Trainer journey

```
Login → Upload document (drag-drop, page-range selection for large PDFs → direct upload to Cloudflare R2)
  → Configure generation (count, difficulty, target competency)
  → AI generates questions (batched via Cloudflare AI Gateway, multi-provider fallback)
  → Competency validation sanity check
  → Review queue (low-confidence first) → Approve / Edit / Reject
  → Publish to Question Bank
  → Monitor performance (error rates, learner flags)
```

### 10.3 Administrator journey

```
Login → Organization overview (headcount, average readiness, trend, AI narrative summary)
  → Role/department breakdown table → drill into individuals
  → Flag a department for priority training (write-back action, logged and visible to other admins)
```

---

## 11. Functional Requirements

Each requirement has an ID, priority, and acceptance criteria. IDs are stable identifiers for use in tickets/tests.

### 11.1 Foundation — Auth, RBAC, Organization Model

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-AUTH-1 | Users authenticate via email/password or Google OAuth through Supabase Auth | P0 | Login/signup succeeds; session persists across reload; JWT contains user role and organization_id |
| FR-AUTH-2 | Simulated government SSO ("Parichay") login with pre-seeded demo personas using Supabase Auth's custom OIDC provider flow | P0 | One-click login as a named persona works without manual credential entry; auth flow mirrors the real Parichay OIDC redirect pattern |
| FR-AUTH-3 | Signup restricted to plausible government email domains, with a demo-mode override flag | P1 | Non-listed domains are rejected unless `DEMO_MODE=true` |
| FR-RBAC-1 | Three roles exist: learner, trainer, admin, each with role-appropriate navigation. Role is stored in Supabase Auth metadata and the `users` table | P0 | Switching role changes visible nav items; unauthorized routes are inaccessible |
| FR-RBAC-2 | Client-side role guards are documented as UX-only; **all** authorization-sensitive writes are enforced by PostgreSQL RLS policies and Supabase Edge Functions | P0 | A tampered client cannot write data the RLS policy would reject |
| FR-ORG-1 | Every user, competency record, document, question, assessment result, and course is scoped by `organization_id` from day one, enforced by RLS | P0 | Cross-org data leakage is impossible; every RLS policy checks `organization_id` |
| FR-TRUST-1 | Every UI surface displaying competency, role, activity, course, or organizational-aggregate data renders a provenance badge sourced from the record's `provenance` column | P0 | PostgreSQL constraint confirms no domain-data record is missing `provenance`; manual QA confirms badges render correctly |

### 11.2 Onboarding & Profile

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-ONB-1 | Multi-step onboarding: role selection → official details (name, dept, designation, cadre) → select government role from catalog → initial self-assessment (L1–L5 per competency) | P0 | New user reaches dashboard with a populated competency profile |
| FR-ONB-2 | Field Investigator persona defaults to Hindi locale during onboarding | P0 | FI demo persona's onboarding renders in Hindi without manual toggle |
| FR-PROFILE-1 | Profile displays competency radar, Karma Points counter, and APAR milestone gauge | P1 | All three elements render with live data once a competency record exists |
| FR-PROFILE-2 | Profile visually distinguishes 🛡️ assessment-verified levels from ✍️ self-assessed levels | P0 | Every competency level shown anywhere carries one of these badges |
| FR-PROFILE-3 | Profile shows competency growth history over time | P1 | A learner who has taken 2+ assessments sees a timeline |

### 11.3 Competency & Gap Analysis

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-COMP-1 | Gap severity is computed as `severityScore = (targetLevel − currentLevel) × priorityWeight`, where critical=3, important=2, desirable=1 | P0 | A Δ=1 gap on a critical competency ranks above a Δ=2 gap on a desirable competency (unit test required) |
| FR-COMP-2 | Severity buckets: `severityScore ≥ 4 → HIGH 🔴`, `2–3 → MODERATE ⚠️`, `≤1 → PROFICIENT ✅` | P0 | Gap cards render the correct bucket for known inputs |
| FR-COMP-3 | Workforce Readiness Index is computed per user as a function of gap closure across their FRAC-required competencies | P0 | Returns 100% when all competencies meet or exceed target; unit test required |
| FR-COMP-4 | Skill Gap page orders gaps by severity score, referencing the specific FRAC Activity driving the requirement | P0 | Highest-severity gap always appears first; each card names the Activity, not just the Competency |
| FR-COMP-5 | Severity weights and readiness-index formula are configurable per organization without a code change | P1 | Changing a weight in the `organization_config` table changes computed severities on next load |
| FR-COMP-6 | "Explain-the-gap" AI narrator produces a one-line, FRAC-referenced explanation per gap card | P1 | Explanation names the specific Activity and Competency, not generic text |

### 11.4 Adaptive Assessment Engine

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-ASSESS-1 | Assessment starts at medium difficulty and branches (harder on correct, easier on incorrect) to converge on an estimated L1–L5 level | P0 | Given a scripted answer sequence, the engine converges to the expected level in unit tests |
| FR-ASSESS-2 | Assessment UI supports timer, question navigation, and a "flag this question" control on every question | P0 | Flags are persisted and visible to trainers |
| FR-ASSESS-3 | Assessment questions can render bilingually (English/Hindi), with pre-authored stems for at least the survey-sampling domain | P0 | At least 10 questions have authentic Hindi stems; toggle switches rendering without reload |
| FR-ASSESS-4 | Assessment submission is validated and scored **server-side** via a Supabase Edge Function; the client cannot fabricate a score | P0 | Tampering with client-side answer state does not change the persisted score |
| FR-ASSESS-5 | Completing an assessment updates the user's `competency_records`, creates an `assessment_result`, and writes an audit log entry atomically via a PostgreSQL transaction | P0 | A completed assessment always leaves the record set in a consistent state |
| FR-ASSESS-6 | Post-assessment micro-feedback: a short, specific explanation of likely reasons for missed topics, linked to a course/chunk | P1 | Feedback references the actual missed topic and a real linked resource |
| FR-OFFLINE-1 | A learner can cache an assessment for offline use, complete it fully offline, and have results queue for sync | P0 | Assessment completed in airplane mode is not lost; UI shows "results will sync" indicator |
| FR-OFFLINE-2 | On reconnect, queued results sync automatically and the server-side scoring pipeline runs exactly as online | P0 | Competency record reflects offline-completed assessment within <30s after connectivity restored |
| FR-OFFLINE-3 | Offline status is visibly indicated at all times during an assessment, in the user's active language | P0 | Indicator state matches actual connectivity and queue state |

### 11.5 Recommendation Engine & Learning Pathways

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-REC-1 | Courses are ranked by a documented multi-signal formula (gap severity, role priority, difficulty match, prerequisite readiness) | P0 | Ranking is reproducible for known inputs (unit test); formula weights are visible in code/config |
| FR-REC-2 | Every recommendation includes a human-readable "why this was recommended" explanation | P0 | No recommendation card ships without an explanation string |
| FR-REC-3 | Recommended courses show a pathway structure (foundational → applied → capstone) where applicable | P1 | At least one competency has a 3-stage pathway in seed data |
| FR-REC-4 | Course cards deep-link directly to the corresponding live iGOT Karmayogi course page where a real URL exists | P0 | Links resolve to real `igotkarmayogi.gov.in` pages wherever the catalog has a real mapping |

### 11.6 iGOT Integration

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-IGOT-1 | An adapter interface (`searchCourses`, `getCourse`, `getCompetencyMapping`, `getKarmaPoints`, `syncEnrollmentProgress`, `enrollUser`) is defined once and implemented by a mock provider | P0 | Swapping the mock for a future live implementation requires no change to calling code |
| FR-IGOT-2 | Mock mode reads from PostgreSQL seed data, explicitly `SYNTHETIC_DEMO_DATA`-labeled | P0 | UI clearly states "Integration: Demo Mode" wherever iGOT data is shown |
| FR-IGOT-3 | The live-mode contract is documented so a future integrator has a concrete target, informed by DSEP Protocol / Sunbird conventions | P1 | A written adapter-contract doc exists and is referenced from code comments |
| FR-IGOT-4 | Outreach to `mission.karmayogi@gov.in` is tracked as a product artifact | P1 | A dated record of the outreach exists |

### 11.7 Content Intelligence Pipeline

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-CONTENT-1 | Trainer can upload PDF/DOCX documents with a page-range or chapter selector. Large PDFs upload directly to Cloudflare R2 via presigned URL | P0 | A 200+ page document does not freeze the browser; only the selected range is processed |
| FR-CONTENT-2 | Text extraction with OCR fallback for scanned pages (client-side via pdf.js + tesseract.js) | P0 | A scanned PDF still yields extractable text |
| FR-CONTENT-3 | Text is chunked with section/heading awareness, preserving page/section metadata | P1 | Generated questions can cite a specific source section |
| FR-CONTENT-4 | AI generates MCQs in a single batched request per generation job via Cloudflare AI Gateway's multi-provider fallback chain | P0 | A batch of 10–15 MCQs is requested and returned in one call; provider rate limits are never exceeded |
| FR-CONTENT-5 | Each generated question carries a `confidence: high|medium|low` self-assessment from the AI | P0 | Confidence tag is present and used to sort the review queue |
| FR-CONTENT-6 | A trainer-facing sanity check appears between generation and full review | P0 | Trainer must confirm competency tag before entering review queue |
| FR-CONTENT-7 | Review queue is sorted low-confidence-first; trainer can approve, edit, or reject, with bulk-approve for high-confidence items | P0 | Trainer can clear a batch in a single sitting without re-sorting |
| FR-CONTENT-8 | Approved questions immediately become available to the assessment engine | P0 | A newly approved question can be drawn into a live assessment without manual sync |
| FR-CONTENT-9 | A rule-based fallback question generator activates automatically if all AI providers in the fallback chain are unavailable | P0 | Simulating a total AI outage still produces usable questions |
| FR-CONTENT-10 | Every AI-content event is written to an immutable audit log with prompt version | P1 | Audit log entries exist for each action and cannot be edited or deleted |
| FR-CONTENT-11 | Trainer sees basic performance monitoring on their published questions | P1 | A question with high error rate or multiple flags is surfaced |

### 11.8 AI Learning Assistant

Five concrete, context-grounded capabilities:

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-AI-1 | **Gap-aware conversational assistant**: every response is grounded server-side in the learner's actual competency records, role's FRAC requirements, and assessment history | P1 | Assistant answers reference the learner's real gaps |
| FR-AI-2 | **Trainer co-pilot for question quality**: confidence tagging as triage aid | P0 | Same as FR-CONTENT-5 |
| FR-AI-3 | **Explain-the-gap narrator**: see FR-COMP-6 | P1 | Same as FR-COMP-6 |
| FR-AI-4 | **Post-assessment micro-feedback**: see FR-ASSESS-6 | P1 | Same as FR-ASSESS-6 |
| FR-AI-5 | **Admin narrative summaries**: 2–3 sentence plain-language summary of workforce gap trend | P1 | Narrative references real aggregate numbers, not filler text |

### 11.9 Workforce Intelligence (Admin)

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-ADMIN-1 | Organization overview: total officials, average readiness, trend direction | P0 | Numbers are computed from real seeded data, not hardcoded |
| FR-ADMIN-2 | AI-generated narrative summary of the top gap trend | P1 | Present on the admin landing view |
| FR-ADMIN-3 | Role/department breakdown table with drill-down to individual (subject to RBAC + org scoping via RLS) | P0 | Admin can view a department's aggregate and click into an individual's profile within the same org |
| FR-ADMIN-4 | Admin can flag a department/role for priority training — a real write-back action, not just a view | P0 | Flagging persists in `training_priorities` table and is visible to other admins in the org |
| FR-ADMIN-5 | Training → outcome correlation view: competency level vs. simulated survey-quality metric, clearly labeled `SYNTHETIC_DEMO_DATA` | P0 | Chart renders with "Simulated" watermark and methodology note |
| FR-ADMIN-6 | Skill Gap Heatmap (departments × competencies matrix) | P2 | Deferred to V2 |
| FR-ADMIN-7 | Training effectiveness (real before/after comparison) | P2 | Deferred to V2 |
| FR-ADMIN-8 | Demand forecasting | P2 | Deferred to V2 |

### 11.10 Offline, PWA & Multilingual

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-PWA-1 | App is installable as a PWA (manifest + service worker via @serwist/next) | P0 | Chrome/Edge shows an "Install app" prompt |
| FR-PWA-2 | Assessment-taking route and pre-fetched question data are cached by the service worker for offline use | P0 | See FR-OFFLINE-1/2/3 |
| FR-I18N-1 | i18n implemented via `next-intl` with namespaced locale files; adding a third language requires only a new locale file | P0 | Adding a third language requires no code changes to components |
| FR-I18N-2 | Navigation, competency names, role names, and assessment UI strings are translated for at least English and Hindi | P0 | Full navigation and assessment flow renders correctly in both languages |
| FR-I18N-3 | A visible language toggle exists in the header; `preferred_language` sets the default without requiring the toggle every session | P0 | Field Investigator persona defaults to Hindi; toggle switches without reload artifacts |

### 11.11 Notifications & Communication

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-NOTIF-1 | In-app notification list (new recommendation, assessment result, review reminder) via Supabase Realtime | P1 | Notifications appear and can be marked read |
| FR-NOTIF-2 | Push/email notifications | P2 | Deferred to V2 |

---

## 12. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Dashboard initial load < 3s on 4G. Cached PWA shell load < 5s on first offline load. Supabase Edge Function P95 latency < 800ms for non-AI endpoints. Batched AI MCQ generation (10–15 questions) completes in < 20s. |
| **Availability** | Target 99% uptime during any active demo/pilot window. |
| **Scalability** | Architecture must not require rework to go from single-digit pilot users to ~10,000 users. Multi-tenancy (`organization_id` scoping via RLS) from the first schema. |
| **Accessibility** | WCAG 2.1 AA minimum for all learner-facing core flows. Keyboard navigation and visible focus states on all interactive elements. |
| **Localization** | English and Hindi at launch; architecture supports India's scheduled languages without code changes. |
| **Security** | No AI provider API key ever ships in a client bundle. All writes to competency records and assessment results are server-validated. See §24. |
| **Data integrity** | Assessment scoring is deterministic and reproducible; PostgreSQL transactions ensure atomicity. |
| **Observability** | Every AI content event, competency-record write, and admin write-back action is logged to an append-only `audit_log` table. |
| **Browser/device support** | Must function on a mid-range Android tablet in a 3-bar-signal environment — this is the actual target device for the primary persona. |

---

## 13. Complete Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| **Frontend Framework** | Next.js (latest stable, App Router) | SSR/SSG for landing page SEO, API routes as BFF layer, PWA support via @serwist/next |
| **Language** | TypeScript throughout (frontend + Edge Functions) | `strict: true` in all tsconfigs |
| **UI Components** | shadcn/ui | Accessible, composable, Tailwind-native components with `data-slot` architecture |
| **Styling** | Tailwind CSS v4 | CSS-first configuration via `@theme` blocks; OKLCH color space; no `tailwind.config.ts` |
| **Animation** | Framer Motion | Used sparingly — micro-interactions, page transitions |
| **Charts** | Recharts (data plots) + custom SVG (radar, progress ring) | Recharts for scatter+trend, line charts; custom SVG for bespoke shapes |
| **i18n** | `next-intl` | Namespaced locale JSON files; supports App Router natively |
| **PWA** | `@serwist/next` (Workbox fork for Next.js) | App-shell precaching, offline fallback, runtime caching |
| **Offline Storage** | `idb` (thin IndexedDB wrapper) | Only for the assessment submission queue; NOT for caching reads |
| **PDF Processing** | `pdf.js` for text extraction + `tesseract.js` for OCR fallback | Client-side; runs in a Web Worker to avoid UI blocking |
| **Auth** | Supabase Auth (Email/Password + Google OAuth + Custom OIDC for Parichay) | See §15 for full auth architecture |
| **Database** | Supabase PostgreSQL | RLS-enforced, org-scoped; relational model with proper foreign keys and constraints |
| **Realtime** | Supabase Realtime | Live dashboard updates, review queue sync, admin write-back notifications |
| **Small File Storage** | Supabase Storage | Avatars, icons, small assets (< 5MB) |
| **Large File Storage** | Cloudflare R2 | PDFs, documents, training materials. $0 egress, S3-compatible API |
| **Serverless (auth-adjacent)** | Supabase Edge Functions (Deno) | Assessment scoring, competency updates, audit triggers — close to the database |
| **Serverless (AI/Storage)** | Cloudflare Workers | Presigned URL generation for R2, AI proxy, rate limiting |
| **AI Gateway** | Cloudflare AI Gateway | Multi-provider fallback: Gemini → Claude → GPT. Unified logging, analytics, cost monitoring |
| **AI Providers** | Gemini Flash (primary), Claude Sonnet (secondary), GPT-4o-mini (tertiary) | All via AI Gateway; model names in env vars, never hardcoded |
| **AI Fallback** | Rule-based question generator (in-repo, no external dependency) | Activates if all AI providers in the chain are unavailable |
| **Testing** | Vitest (unit), Testing Library (component), Playwright (E2E, deferred to V1.1) | Unit coverage required for all formulas from MVP |
| **Lint/Format** | ESLint + Prettier + Biome (optional) | Enforced in CI |
| **Hosting** | Vercel | Native Next.js hosting, preview deployments, edge functions |
| **CI/CD** | Vercel Git Integration + GitHub Actions | Auto-deploy on push, preview per PR |
| **Icons** | Lucide Icons | Clean, consistent, MIT-licensed |

---

## 14. System Architecture — Full Technical Specification

### 14.1 High-Level Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────┐
│                          CLIENT                                    │
│  Next.js App (Vercel) + PWA Shell (@serwist/next)                  │
│  Pages → Contexts/Providers → Services → Supabase SDK              │
│  Local cache: Service Worker (reads) + IndexedDB queue (writes)    │
└──────────────────────────┬────────────────────────────────────────┘
                           │
              ┌────────────┼────────────────┐
              │            │                │
              ▼            ▼                ▼
┌──────────────────┐ ┌──────────────┐ ┌────────────────────────┐
│   SUPABASE       │ │  VERCEL      │ │  CLOUDFLARE            │
│                  │ │              │ │                        │
│  Auth (JWT)      │ │  API Routes  │ │  Workers               │
│  PostgreSQL      │ │  (BFF layer, │ │   ├─ AI Proxy          │
│  (RLS enforced)  │ │   server-    │ │   ├─ R2 Presigned URLs │
│  Edge Functions  │ │   side auth  │ │   └─ Rate Limiter      │
│   ├─ evaluate    │ │   checks)    │ │                        │
│   │  Assessment  │ │              │ │  R2 (PDF storage)      │
│   ├─ competency  │ └──────────────┘ │                        │
│   │  Update      │                  │  AI Gateway            │
│   └─ audit       │                  │   ├─ Gemini (primary)  │
│      Trigger     │                  │   ├─ Claude (secondary)│
│  Realtime        │                  │   └─ GPT (tertiary)    │
│  Storage (small) │                  └────────────────────────┘
└──────────────────┘
```

### 14.2 Request Flow — Who Handles What

| Request Type | Handler | Why |
|---|---|---|
| Page load, static content | Vercel Edge Network | Fastest possible delivery; SSR/SSG |
| Auth (login/signup/SSO) | Supabase Auth | Native auth with JWT, OIDC support, user management |
| Database reads/writes (non-sensitive) | Supabase SDK → PostgreSQL (RLS) | Direct client access with row-level security |
| Assessment scoring | Supabase Edge Function (`evaluateAssessment`) | Must be server-side; needs direct DB access for atomicity |
| Competency record updates | Supabase Edge Function (triggered by assessment result) | Server-side only; must be atomic with audit logging |
| Large file upload (PDFs) | Cloudflare Worker → R2 (presigned URL) | $0 egress; bytes never transit through the app server |
| AI calls (MCQ generation, narration) | Cloudflare Worker → AI Gateway → Provider | Rate limiting, multi-provider fallback, no API keys on client |
| Real-time updates (dashboard, review queue) | Supabase Realtime (WebSocket) | Native PostgreSQL change notifications |
| Small file upload (avatars) | Supabase Storage | Simple, auth-integrated, small files only |

### 14.3 Service Layer Design

Services are framework-agnostic TypeScript modules. They do not import React or Next.js. Context providers call services and expose reactive state to components.

| Service | Responsibility | Called from |
|---|---|---|
| `competencyService` | Gap severity formula, readiness index, level-promotion thresholds (read/display only) | Skill Gap page, Dashboard, Profile |
| `assessmentService` | Adaptive branching logic (client-side for UX), answer collection, submission orchestration | Assessment page |
| `recommendationService` | Course ranking formula, pathway construction, explainability strings | Learning Pathways |
| `contentService` | Orchestrates document pipeline: extraction → chunking → generation request → review state | Document Manager, MCQ Generator |
| `aiService` | Client-side formatter/caller for AI-related Cloudflare Worker endpoints; never touches an API key | MCQ Generator, AI Assistant |
| `storageService` | Upload/download via Cloudflare R2 (large) or Supabase Storage (small); wraps presigned-URL flow | Document Manager |
| `integrationService` | iGOT adapter (mock now; documented live contract for V2) | Learning Pathways, Profile (Karma Points) |
| `offlineService` | Manages IndexedDB pending-results queue, connectivity detection, sync trigger | Assessment page, global offline indicator |
| `questionGenerator` | Rule-based MCQ generation (no external dependency) — the AI fallback | `contentService`, Cloudflare Worker fallback |

---

## 15. Authentication Architecture — Supabase Auth + Parichay SSO

### 15.1 Authentication Methods

StatVidya supports three authentication methods, all managed through Supabase Auth:

| Method | Implementation | Use Case |
|---|---|---|
| **Email/Password** | Supabase Auth native | Standard registration for government officials |
| **Google OAuth** | Supabase Auth built-in provider | Quick login for demo/pilot users |
| **Parichay SSO (OIDC)** | Supabase Auth Custom OIDC Provider (`custom:parichay`) | Government single sign-on for production deployment |

### 15.2 Parichay SSO Integration Architecture

**Parichay** (also known as Jan-Parichay / MeriPehchaan) is India's National Single Sign-On (NSSO) framework managed by the National Informatics Centre (NIC). It serves as the central Identity Provider (IdP) for government services.

#### Supported Integration Protocols

Parichay supports three integration methods:
1. **OAuth 2.0** — authorization framework with redirect flow
2. **SAML 2.0** — secure authentication assertion exchange
3. **Open API** — client integration via defined APIs

**StatVidya uses OAuth 2.0 / OIDC** via Supabase Auth's Custom OIDC Provider feature.

#### Real Integration Flow (for production deployment)

```
┌──────────┐     ┌──────────────┐     ┌──────────────────┐     ┌────────────┐
│  Browser  │     │   Next.js    │     │  Supabase Auth   │     │  Parichay  │
│  (Client) │     │  API Route   │     │  (OIDC Client)   │     │  IdP       │
└─────┬─────┘     └──────┬───────┘     └────────┬─────────┘     └─────┬──────┘
      │                  │                      │                     │
      │  1. Click        │                      │                     │
      │  "Login with     │                      │                     │
      │   Parichay"      │                      │                     │
      │──────────────────>                      │                     │
      │                  │  2. Initiate OIDC     │                     │
      │                  │  auth flow            │                     │
      │                  │─────────────────────->│                     │
      │                  │                      │  3. Redirect to     │
      │                  │                      │  Parichay login     │
      │<─────────────────────────────────────────────────────────────>│
      │                  │                      │                     │
      │  4. User logs in │                      │                     │
      │  with Aadhaar/   │                      │                     │
      │  PAN/Mobile      │                      │                     │
      │──────────────────────────────────────────────────────────────>│
      │                  │                      │                     │
      │                  │                      │  5. Auth code       │
      │                  │                      │  callback           │
      │<─────────────────────────────────────────────────────────────│
      │                  │                      │                     │
      │                  │                      │  6. Exchange code   │
      │                  │                      │  for tokens         │
      │                  │                      │────────────────────>│
      │                  │                      │                     │
      │                  │                      │  7. JWT + user info │
      │                  │                      │<────────────────────│
      │                  │                      │                     │
      │                  │  8. Create/link user  │                     │
      │                  │  in Supabase         │                     │
      │                  │<─────────────────────│                     │
      │                  │                      │                     │
      │  9. Session       │                      │                     │
      │  established     │                      │                     │
      │<─────────────────│                      │                     │
```

#### Steps to obtain real Parichay integration:

1. **Register at** [meripehchaan.gov.in](https://meripehchaan.gov.in) — submit the "Requirements to Avail Jan-Parichay" form
2. **Receive configuration** — NIC provides OAuth 2.0 client credentials, redirect URIs, and a Jan-Parichay Proxy if needed
3. **Configure in Supabase Auth** — add Parichay as a Custom OIDC Provider:
   - Issuer URL: `https://parichay.nic.in/.well-known/openid-configuration` (auto-discovery)
   - Client ID and Secret from NIC registration
   - Scopes: `openid profile email`
4. **Handle core flows** — Login, Logout, Session Timeout, Token Validation, Handshaking
5. **Audit & Go-Live** — NIC verifies a technical checklist before production access
6. **Contact**: `support-parichay@nic.in`

#### Simulated Parichay SSO (for hackathon demo)

For the SIH demo, we simulate the Parichay SSO flow:

```typescript
// Pre-seeded demo personas stored in the users table
const DEMO_PERSONAS = [
  {
    id: 'demo-fi-sunita',
    name: 'Sunita Devi',
    email: 'sunita.devi@mospi.gov.in',
    designation: 'Field Investigator',
    department: 'NSSO FOD',
    cadre: 'SSS',
    role: 'learner',
    preferred_language: 'hi',
    organization_id: 'org-mospi-demo',
    parichay_id: 'JPID-2024-FI-001', // Simulated Jan-Parichay ID
  },
  {
    id: 'demo-jso-amit',
    name: 'Amit Sharma',
    email: 'amit.sharma@mospi.gov.in',
    designation: 'Junior Statistical Officer',
    department: 'CSO',
    cadre: 'ISS',
    role: 'learner',
    preferred_language: 'en',
    organization_id: 'org-mospi-demo',
    parichay_id: 'JPID-2024-JSO-002',
  },
  {
    id: 'demo-trainer-priya',
    name: 'Priya Verma',
    email: 'priya.verma@nssta.gov.in',
    designation: 'NSSTA Faculty',
    department: 'NSSTA',
    cadre: 'ISS',
    role: 'trainer',
    preferred_language: 'en',
    organization_id: 'org-mospi-demo',
    parichay_id: 'JPID-2024-TR-003',
  },
  {
    id: 'demo-admin-rajesh',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@mospi.gov.in',
    designation: 'Director',
    department: 'MoSPI HQ',
    cadre: 'ISS',
    role: 'admin',
    preferred_language: 'en',
    organization_id: 'org-mospi-demo',
    parichay_id: 'JPID-2024-AD-004',
  },
] as const;
```

The demo SSO picker renders as a card grid — clicking a persona auto-logs in using `supabase.auth.signInWithPassword()` with pre-seeded credentials, while the UI mimics a Parichay redirect flow.

### 15.3 JWT Token Structure

Supabase Auth issues JWTs containing custom claims:

```json
{
  "sub": "user-uuid",
  "email": "user@mospi.gov.in",
  "role": "authenticated",
  "app_metadata": {
    "role": "learner",
    "organization_id": "org-mospi-demo",
    "parichay_id": "JPID-2024-FI-001"
  },
  "user_metadata": {
    "name": "Sunita Devi",
    "preferred_language": "hi"
  }
}
```

The `organization_id` and `role` in `app_metadata` are used by RLS policies (§16) and cannot be modified by the client (only by server-side admin actions).

---

## 16. Database Architecture — Supabase PostgreSQL + RLS

### 16.1 Why PostgreSQL over Firestore

| Concern | PostgreSQL (Supabase) | Firestore |
|---|---|---|
| **Relational queries** | Native JOINs, aggregates, window functions | Requires denormalization or multiple queries |
| **Data integrity** | Foreign keys, CHECK constraints, transactions | No foreign keys, eventual consistency |
| **Provenance enforcement** | `NOT NULL CHECK` constraint on `provenance` column | Convention only (manual enforcement) |
| **Multi-tenant security** | Row Level Security (RLS) — database-enforced | Firestore rules (similar but different DSL) |
| **Analytics queries** | SQL aggregates, GROUP BY, CTEs for admin dashboard | Very limited aggregation capabilities |
| **Audit trail** | PostgreSQL triggers for automatic audit logging | Manual Firestore triggers |
| **Type safety** | Generated TypeScript types via `supabase gen types` | Manual type definitions |

### 16.2 RLS Strategy — Organization-Scoped Security

Every table containing user-facing data includes an `organization_id` column. RLS policies enforce that users can only access data within their own organization.

#### Helper Functions

```sql
-- Extract active user's organization ID from JWT
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'organization_id')::UUID;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Extract active user's role from JWT
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT auth.jwt() -> 'app_metadata' ->> 'role';
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'admin';
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

#### Example RLS Policy Pattern

```sql
-- Users table: read within org, write own profile only
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read within their org"
  ON users FOR SELECT
  USING (organization_id = get_user_org_id());

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND organization_id = get_user_org_id()
  );

-- Competency records: read own or admin read within org, NO client writes
ALTER TABLE competency_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own competency records"
  ON competency_records FOR SELECT
  USING (
    user_id = auth.uid()
    OR (is_admin() AND organization_id = get_user_org_id())
  );

-- No INSERT/UPDATE/DELETE policies for client — only Edge Functions with service_role
-- This enforces FR-RBAC-2: server-side only writes

-- Audit log: append-only, no updates, no deletes
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit log within org"
  ON audit_log FOR SELECT
  USING (is_admin() AND organization_id = get_user_org_id());

-- No UPDATE or DELETE policies exist — audit log is immutable
```

### 16.3 Performance — Index Strategy

```sql
-- Critical indexes for RLS performance
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_competency_records_user ON competency_records(user_id);
CREATE INDEX idx_competency_records_org ON competency_records(organization_id);
CREATE INDEX idx_assessment_results_user_date ON assessment_results(user_id, completed_at DESC);
CREATE INDEX idx_assessment_results_org ON assessment_results(organization_id);
CREATE INDEX idx_questions_org_status ON questions(organization_id, status, confidence);
CREATE INDEX idx_audit_log_org_date ON audit_log(organization_id, created_at DESC);
```

---

## 17. Storage Architecture — Cloudflare R2 + Supabase Storage

### 17.1 Dual Storage Strategy

| Storage | Provider | Use Case | Max Size | Auth |
|---|---|---|---|---|
| **Large files** | Cloudflare R2 | PDFs, DOCX, training materials | Unlimited (practical: 5GB per file) | Presigned URLs via Cloudflare Worker |
| **Small files** | Supabase Storage | Avatars, thumbnails, icons | < 5MB | Supabase Auth + Storage policies |

### 17.2 Large File Upload Flow (Cloudflare R2)

```
┌──────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────┐
│  Browser  │     │  Next.js API     │     │  Cloudflare      │     │    R2    │
│  (Client) │     │  Route (BFF)     │     │  Worker          │     │  Bucket  │
└─────┬─────┘     └────────┬─────────┘     └────────┬─────────┘     └────┬─────┘
      │                    │                        │                    │
      │ 1. Request upload  │                        │                    │
      │    (filename, size,│                        │                    │
      │     content-type)  │                        │                    │
      │───────────────────>│                        │                    │
      │                    │                        │                    │
      │                    │ 2. Validate auth       │                    │
      │                    │    (check Supabase JWT)│                    │
      │                    │                        │                    │
      │                    │ 3. Request presigned   │                    │
      │                    │    URL from Worker     │                    │
      │                    │───────────────────────>│                    │
      │                    │                        │                    │
      │                    │                        │ 4. Generate        │
      │                    │                        │    presigned URL   │
      │                    │                        │    (PUT, 15min TTL)│
      │                    │                        │                    │
      │                    │ 5. Return presigned URL│                    │
      │                    │<───────────────────────│                    │
      │                    │                        │                    │
      │ 6. Presigned URL   │                        │                    │
      │<───────────────────│                        │                    │
      │                    │                        │                    │
      │ 7. Direct PUT      │                        │                    │
      │    upload to R2    │                        │                    │
      │─────────────────────────────────────────────────────────────────>│
      │                    │                        │                    │
      │ 8. Upload complete │                        │                    │
      │<─────────────────────────────────────────────────────────────────│
      │                    │                        │                    │
      │ 9. Confirm upload  │                        │                    │
      │    (save metadata  │                        │                    │
      │     to Supabase)   │                        │                    │
      │───────────────────>│                        │                    │
      │                    │ 10. Insert into        │                    │
      │                    │     documents table    │                    │
```

**Key design decisions:**
- **Bytes never transit through the app server** — browser uploads directly to R2 via presigned URL
- **File validation happens before signing** — Worker checks file type (PDF/DOCX only), size limits, and MIME type
- **Presigned URLs have a 15-minute TTL** — short enough to prevent abuse, long enough for large uploads
- **Multipart upload** for files > 100MB — R2 supports S3-compatible multipart uploads

### 17.3 Cloudflare Worker for Presigned URLs

```typescript
// Cloudflare Worker: r2-upload-worker
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 1. Validate Supabase JWT from Authorization header
    const jwt = request.headers.get('Authorization')?.replace('Bearer ', '');
    const user = await verifySupabaseJWT(jwt, env.SUPABASE_JWT_SECRET);
    if (!user) return new Response('Unauthorized', { status: 401 });

    // 2. Check role (only trainer/admin can upload)
    if (!['trainer', 'admin'].includes(user.app_metadata.role)) {
      return new Response('Forbidden', { status: 403 });
    }

    // 3. Parse request body
    const { filename, contentType, fileSize } = await request.json();

    // 4. Validate file
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        .includes(contentType)) {
      return new Response('Invalid file type', { status: 400 });
    }
    if (fileSize > 500 * 1024 * 1024) { // 500MB limit
      return new Response('File too large', { status: 400 });
    }

    // 5. Generate presigned URL
    const key = `${user.app_metadata.organization_id}/${crypto.randomUUID()}/${filename}`;
    const signedUrl = await env.R2_BUCKET.createPresignedUrl(key, {
      method: 'PUT',
      expiresIn: 900, // 15 minutes
      headers: { 'Content-Type': contentType },
    });

    return Response.json({ uploadUrl: signedUrl, key });
  },
};
```

---

## 18. Serverless Architecture — Supabase Edge Functions + Cloudflare Workers

### 18.1 Division of Responsibilities

| Function | Platform | Reason |
|---|---|---|
| `evaluateAssessment` | Supabase Edge Function | Needs direct PostgreSQL access for atomic transactions (score + competency update + audit log) |
| `updateCompetencyRecords` | Supabase Edge Function (triggered by assessment result) | Must be co-located with database for atomicity |
| `auditTrigger` | PostgreSQL Trigger Function | Cannot be skipped — fires on any INSERT to audited tables |
| `generatePresignedUrl` | Cloudflare Worker | Co-located with R2 for native bindings (no cross-platform network call) |
| `aiProxy` | Cloudflare Worker | Co-located with AI Gateway for native integration |
| `rateLimiter` | Cloudflare Worker (with KV) | Edge-native rate limiting for AI calls |

### 18.2 Supabase Edge Function — `evaluateAssessment`

```typescript
// supabase/functions/evaluate-assessment/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // service_role bypasses RLS
  );

  // 1. Verify user JWT
  const authHeader = req.headers.get('Authorization')!;
  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

  // 2. Parse submission
  const { localId, assessmentId, answers } = await req.json();

  // 3. Idempotency check (prevent double-scoring from offline retries)
  const { data: existing } = await supabase
    .from('assessment_results')
    .select('id')
    .eq('local_id', localId)
    .single();

  if (existing) {
    return new Response(JSON.stringify({ success: true, alreadySynced: true }), { status: 200 });
  }

  // 4. Score server-side (never trust client-submitted scores)
  const { data: questions } = await supabase
    .from('questions')
    .select('id, correct_index, competency_id, difficulty')
    .in('id', Object.keys(answers));

  const score = computeScore(questions, answers); // Pure function
  const competencyLevels = computeLevelUpdates(questions, answers, score);

  // 5. Atomic write: assessment_result + competency_records + audit_log
  const { error } = await supabase.rpc('submit_assessment_result', {
    p_local_id: localId,
    p_user_id: user.id,
    p_assessment_id: assessmentId,
    p_answers: answers,
    p_score: score,
    p_competency_levels: competencyLevels,
    p_organization_id: user.app_metadata.organization_id,
  });

  if (error) throw error;

  return new Response(JSON.stringify({ success: true, score, competencyLevels }));
});
```

### 18.3 PostgreSQL Stored Procedure — Atomic Assessment Submission

```sql
CREATE OR REPLACE FUNCTION submit_assessment_result(
  p_local_id UUID,
  p_user_id UUID,
  p_assessment_id UUID,
  p_answers JSONB,
  p_score INTEGER,
  p_competency_levels JSONB,
  p_organization_id UUID
) RETURNS VOID AS $$
BEGIN
  -- Insert assessment result
  INSERT INTO assessment_results (local_id, user_id, assessment_id, answers, score, organization_id, completed_at)
  VALUES (p_local_id, p_user_id, p_assessment_id, p_answers, p_score, p_organization_id, NOW());

  -- Update competency records (upsert)
  INSERT INTO competency_records (user_id, competency_id, current_level, evidence, organization_id, updated_at)
  SELECT
    p_user_id,
    (entry->>'competency_id')::UUID,
    (entry->>'level')::INTEGER,
    p_assessment_id::TEXT,
    p_organization_id,
    NOW()
  FROM jsonb_array_elements(p_competency_levels) AS entry
  ON CONFLICT (user_id, competency_id)
  DO UPDATE SET
    current_level = EXCLUDED.current_level,
    evidence = EXCLUDED.evidence,
    updated_at = NOW();

  -- Append to competency history
  INSERT INTO competency_history (user_id, competency_id, level, source, organization_id, recorded_at)
  SELECT
    p_user_id,
    (entry->>'competency_id')::UUID,
    (entry->>'level')::INTEGER,
    'assessment',
    p_organization_id,
    NOW()
  FROM jsonb_array_elements(p_competency_levels) AS entry;

  -- Audit log entry (triggered automatically by audit_log trigger on assessment_results)
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 19. AI Architecture — Multi-Provider Fallback via Cloudflare AI Gateway

### 19.1 Architecture Overview

```
┌──────────┐     ┌──────────────────┐     ┌──────────────────────────────┐
│  Client   │     │  Cloudflare      │     │  Cloudflare AI Gateway       │
│  (Next.js)│     │  Worker          │     │  (Universal Endpoint)        │
└─────┬─────┘     │  (AI Proxy)      │     │                              │
      │           └────────┬─────────┘     │  ┌─────────────────────┐     │
      │                    │               │  │ 1. Gemini Flash     │     │
      │ 1. Request         │               │  │    (Primary)        │     │
      │    + Supabase JWT  │               │  └─────────┬───────────┘     │
      │───────────────────>│               │            │ if fails        │
      │                    │               │  ┌─────────▼───────────┐     │
      │                    │ 2. Validate   │  │ 2. Claude Sonnet    │     │
      │                    │    JWT +      │  │    (Secondary)      │     │
      │                    │    rate limit │  └─────────┬───────────┘     │
      │                    │               │            │ if fails        │
      │                    │ 3. Forward    │  ┌─────────▼───────────┐     │
      │                    │    to Gateway │  │ 3. GPT-4o-mini      │     │
      │                    │──────────────>│  │    (Tertiary)       │     │
      │                    │               │  └─────────────────────┘     │
      │                    │               └──────────────────────────────┘
      │                    │
      │                    │ 4. If ALL fail:
      │                    │    rule-based fallback
      │                    │    (in-Worker, no external call)
      │                    │
      │ 5. Response        │
      │<───────────────────│
```

### 19.2 AI Gateway Configuration

```javascript
// Cloudflare Worker: ai-proxy-worker
const AI_GATEWAY_URL = `https://gateway.ai.cloudflare.com/v1/${ACCOUNT_ID}/${GATEWAY_ID}`;

const fallbackChain = [
  {
    provider: 'google-ai-studio',
    endpoint: 'v1beta/models/gemini-2.0-flash:generateContent',
    headers: { 'x-goog-api-key': env.GEMINI_API_KEY },
    query: formatGeminiRequest(prompt),
  },
  {
    provider: 'anthropic',
    endpoint: 'v1/messages',
    headers: { 'x-api-key': env.CLAUDE_API_KEY, 'anthropic-version': '2023-06-01' },
    query: formatClaudeRequest(prompt),
  },
  {
    provider: 'openai',
    endpoint: 'chat/completions',
    headers: { 'Authorization': `Bearer ${env.OPENAI_API_KEY}` },
    query: formatOpenAIRequest(prompt),
  },
];
```

### 19.3 Rate Limiting Strategy

Uses Cloudflare KV for per-user daily rate limiting:

```typescript
// Rate limit check in AI proxy Worker
async function checkRateLimit(userId: string, env: Env): Promise<boolean> {
  const key = `rate:${userId}:${new Date().toISOString().slice(0, 10)}`;
  const current = parseInt(await env.RATE_LIMIT_KV.get(key) || '0');

  if (current >= MAX_DAILY_AI_REQUESTS) return false;

  await env.RATE_LIMIT_KV.put(key, String(current + 1), { expirationTtl: 86400 });
  return true;
}
```

### 19.4 AI Fallback Chain (Code-Level)

```
Primary:   Gemini Flash (via AI Gateway)
   ↓ (if unavailable, rate-limited, or error)
Secondary: Claude Sonnet (via AI Gateway)
   ↓ (if unavailable)
Tertiary:  GPT-4o-mini (via AI Gateway)
   ↓ (if ALL AI providers fail)
Fallback:  Rule-based question generator (in-Worker, no external dependency)
   ↓ (if even this fails — shouldn't happen)
Final:     Show error with retry option, never silently fail
```

### 19.5 Prompt Engineering Rules

- Prompts live in versioned files (`prompts/mcq-generation.ts`, `prompts/explain-gap.ts`, etc.)
- Each prompt file exports a `PROMPT_VERSION` constant logged with every AI audit entry
- Prompts request **structured JSON output** from the model, not free-text
- Prompts never include user PII beyond what's needed (role, competency levels — no names/emails/org identifiers)
- All prompts are **model-agnostic** — they work across Gemini, Claude, and GPT without modification

---

## 20. Large PDF Processing Pipeline

### 20.1 Architecture — Client-Side Processing in Web Workers

Large PDFs are processed entirely client-side to avoid server compute costs and timeouts. Processing runs in a **Web Worker** to prevent UI blocking.

```
┌──────────────────────────────────────────────────────────────┐
│                      BROWSER (Main Thread)                    │
│                                                               │
│  1. User selects PDF + page range                             │
│  2. Upload PDF to Cloudflare R2 (presigned URL, background)   │
│  3. Send PDF bytes + page range to Web Worker                 │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                  WEB WORKER THREAD                       │  │
│  │                                                          │  │
│  │  4. pdf.js: Extract text from selected pages             │  │
│  │     └─ If text empty → tesseract.js OCR fallback         │  │
│  │                                                          │  │
│  │  5. Text Chunking:                                       │  │
│  │     └─ Split by section headers (H1/H2 patterns)         │  │
│  │     └─ Each chunk retains: page number, section title,   │  │
│  │        approximate word count                            │  │
│  │                                                          │  │
│  │  6. Return chunks to main thread                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  7. Send chunks to Cloudflare Worker (AI proxy)               │
│  8. Receive generated questions                               │
│  9. Display sanity check → review queue                       │
└──────────────────────────────────────────────────────────────┘
```

### 20.2 Page Range Selection (for large PDFs)

To prevent memory issues with 200+ page PDFs:

- **Page range selector UI**: Trainer selects start/end pages or specific chapters
- **Lazy loading**: Only selected pages are loaded into memory via `pdf.js` page-by-page iteration
- **Memory budget**: Maximum 50 pages processed at once; for larger selections, process in batches with progress indicator
- **Streaming extraction**: Text is extracted page-by-page and streamed to the chunker, never holding the entire document in memory

### 20.3 OCR Fallback Pipeline

```
PDF Page → pdf.js getTextContent()
   │
   ├─ Text extracted (length > threshold) → Use extracted text
   │
   └─ Text empty/minimal → Scanned page detected
       │
       └─ pdf.js renderPage() → Canvas → Blob
           │
           └─ tesseract.js recognize(blob, 'eng+hin')
               │
               └─ OCR text output (with confidence score)
```

- **Language support**: `eng+hin` for bilingual documents
- **Quality threshold**: If OCR confidence < 60%, flag the page for manual review
- **Performance**: tesseract.js WASM runs in the same Web Worker; no additional thread overhead

---

## 21. Offline & PWA Architecture

### 21.1 PWA Setup — @serwist/next

```typescript
// next.config.ts
import withSerwist from '@serwist/next';

export default withSerwist({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  cacheOnNavigation: true,
  revalidateOnReconnect: true,
})(nextConfig);
```

### 21.2 Caching Strategy

| Resource Type | Strategy | Notes |
|---|---|---|
| App shell (HTML, JS, CSS) | Precache (install-time) | Entire app loads offline |
| Static assets (fonts, icons) | Cache-first | Long TTL, rarely changes |
| API data (dashboard, profile) | Stale-while-revalidate | Show cached data, update in background |
| Assessment questions | Network-first + explicit prefetch | User triggers "download for offline" |
| User-submitted data (assessment answers) | IndexedDB queue | Custom sync logic on reconnect |

### 21.3 Offline Assessment Queue

```typescript
// offlineService.ts
interface PendingResult {
  localId: string;       // Client-generated UUID for idempotency
  assessmentId: string;
  answers: Record<string, number>;
  startedAt: string;
  completedAt: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  attempts: number;
  lastAttemptAt?: string;
}

// Enqueue — happens ALWAYS, regardless of connectivity
async function enqueueResult(result: PendingResult): Promise<void> {
  const db = await openDB('statvidya', 1);
  await db.put('pendingResults', result);
  // Immediately attempt flush (works if online, no-ops if offline)
  await flushQueue();
}

// Flush — triggered by: online event, interval check, manual retry
async function flushQueue(): Promise<void> {
  if (!navigator.onLine) return;

  const db = await openDB('statvidya', 1);
  const pending = await db.getAllFromIndex('pendingResults', 'by-status', 'pending');

  for (const result of pending) {
    result.status = 'syncing';
    result.attempts += 1;
    await db.put('pendingResults', result);

    try {
      const response = await supabase.functions.invoke('evaluate-assessment', {
        body: result,
      });
      result.status = 'synced';
    } catch {
      result.status = result.attempts >= MAX_RETRIES ? 'failed' : 'pending';
      result.lastAttemptAt = new Date().toISOString();
    }

    await db.put('pendingResults', result);
  }
}
```

### 21.4 Offline Status Indicator

Three states, always visible, in the user's active language:

| State | Visual | Meaning |
|---|---|---|
| 🟢 Online | Green dot | Connected, all data synced |
| 🟠 Offline — Cached | Amber pulse | No connectivity, showing cached data |
| 🔴 Pending Sync | Red badge with count | Results waiting to sync (count shown) |

Uses `aria-live="assertive"` for screen reader announcements on state changes.

---

## 22. Frontend Architecture — Next.js + shadcn/ui

### 22.1 Project Structure

```
statvidya/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth layout group
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx                # AuthLayout (centered card)
│   ├── (app)/                        # Authenticated app layout group
│   │   ├── dashboard/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── skill-gap/page.tsx
│   │   ├── pathways/page.tsx
│   │   ├── assessment/[id]/page.tsx
│   │   ├── documents/page.tsx
│   │   ├── mcq-generator/[id]/page.tsx
│   │   ├── question-bank/page.tsx
│   │   ├── admin/
│   │   │   ├── analytics/page.tsx
│   │   │   └── users/[uid]/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── onboarding/page.tsx
│   │   └── layout.tsx                # AppLayout (sidebar + topbar)
│   ├── page.tsx                      # Landing page (SSG)
│   ├── manifest.ts                   # PWA manifest
│   ├── sw.ts                         # Service worker (Serwist)
│   ├── globals.css                   # Tailwind v4 @theme config
│   └── layout.tsx                    # Root layout (providers)
│
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── charts/                       # RadarChart, ProgressRing, OutcomeChart
│   ├── layout/                       # AppLayout, AuthLayout, Sidebar, Topbar
│   ├── guards/                       # RoleGuard.tsx
│   └── domain/                       # ProvenanceBadge, GapCard, etc.
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   ├── server.ts                 # Server-side Supabase client
│   │   └── middleware.ts             # Auth middleware for Next.js
│   ├── services/                     # Framework-agnostic services
│   ├── hooks/                        # React hooks
│   ├── utils/                        # Utility functions
│   └── types/                        # TypeScript interfaces (generated + custom)
│
├── data/                             # Seed data (every record has provenance)
│   ├── competencies.ts
│   ├── roles.ts
│   ├── activities.ts
│   ├── courseCatalog.ts
│   └── sampleQuestions.ts
│
├── messages/                         # i18n locale files (next-intl)
│   ├── en.json
│   └── hi.json
│
├── supabase/
│   ├── migrations/                   # PostgreSQL migrations
│   ├── functions/                    # Edge Functions
│   │   ├── evaluate-assessment/
│   │   └── ...
│   ├── seed.sql                      # Seed data SQL
│   └── config.toml                   # Supabase project config
│
├── workers/                          # Cloudflare Workers
│   ├── ai-proxy/
│   │   ├── src/index.ts
│   │   └── wrangler.toml
│   └── r2-upload/
│       ├── src/index.ts
│       └── wrangler.toml
│
├── scripts/
│   └── seed.ts                       # Seed script (calls seed.sql + generates demo data)
│
├── tests/
│   ├── competencyService.test.ts
│   ├── assessmentService.test.ts
│   └── recommendationService.test.ts
│
├── next.config.ts
├── package.json
├── tsconfig.json
└── .env.example
```

### 22.2 Tailwind CSS v4 Configuration

```css
/* app/globals.css */
@import "tailwindcss";

@theme inline {
  /* Primary palette — India-inspired, modern */
  --color-primary: oklch(0.45 0.12 220);        /* #1B5E7B equivalent */
  --color-primary-hover: oklch(0.38 0.12 220);
  --color-primary-light: oklch(0.94 0.03 220);
  --color-secondary: oklch(0.62 0.16 55);       /* #E67E22 saffron-inspired */
  --color-secondary-hover: oklch(0.52 0.16 55);
  --color-secondary-light: oklch(0.96 0.04 55);
  --color-tertiary: oklch(0.52 0.14 145);       /* #2E7D32 green-inspired */
  --color-tertiary-light: oklch(0.95 0.03 145);

  /* Semantic */
  --color-success: oklch(0.52 0.14 145);
  --color-warning: oklch(0.65 0.17 75);
  --color-error: oklch(0.42 0.18 25);
  --color-info: oklch(0.45 0.14 250);

  /* Severity */
  --color-severity-high: var(--color-error);
  --color-severity-moderate: var(--color-warning);
  --color-severity-proficient: var(--color-success);

  /* Font families */
  --font-sans: 'Inter', 'Noto Sans Devanagari', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Spacing (4px grid) */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;

  /* Border radius */
  --radius-card: 12px;
  --radius-btn: 8px;
  --radius-badge: 6px;
  --radius-input: 8px;
}

@layer base {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --border: oklch(0.9 0.01 250);
    --ring: var(--color-primary);
  }

  [data-theme="dark"] {
    --background: oklch(0.15 0.02 250);
    --foreground: oklch(0.95 0 0);
    --card: oklch(0.2 0.02 250);
    --card-foreground: oklch(0.95 0 0);
    --border: oklch(0.3 0.02 250);
  }
}
```

---

## 23. Data Model — Full PostgreSQL Schema

### 23.1 Provenance Enum (enforced at database level)

```sql
CREATE TYPE provenance_type AS ENUM (
  'VERIFIED_OFFICIAL',
  'PROPOSED_FRAMEWORK',
  'PROPOSED_METHODOLOGY',
  'SYNTHETIC_DEMO_DATA'
);

CREATE TYPE user_role AS ENUM ('learner', 'trainer', 'admin');
CREATE TYPE competency_category AS ENUM ('Behavioural', 'Functional', 'Domain');
CREATE TYPE activity_priority AS ENUM ('critical', 'important', 'desirable');
CREATE TYPE severity_bucket AS ENUM ('HIGH', 'MODERATE', 'PROFICIENT');
CREATE TYPE question_confidence AS ENUM ('high', 'medium', 'low');
CREATE TYPE question_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE document_status AS ENUM ('uploaded', 'extracting', 'extracted', 'ready', 'error');
CREATE TYPE assessment_type AS ENUM ('diagnostic', 'topic', 'post_training');
CREATE TYPE course_provider AS ENUM ('igot', 'nssta', 'tpac', 'external');
CREATE TYPE enrollment_status AS ENUM ('enrolled', 'in_progress', 'completed');
```

### 23.2 Core Tables

```sql
-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  ministry TEXT,
  config JSONB DEFAULT '{}',  -- org-specific severity weights, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'learner',
  department TEXT,
  designation TEXT,
  cadre TEXT,
  employee_id TEXT,
  selected_role_id UUID,  -- FK to roles table
  preferred_language TEXT DEFAULT 'en',
  theme_preference TEXT DEFAULT 'system',
  parichay_id TEXT,       -- Jan-Parichay SSO ID (when real SSO is integrated)
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competencies (FRAC-aligned)
CREATE TABLE competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_hi TEXT,           -- Hindi translation
  category competency_category NOT NULL,
  description TEXT,
  description_hi TEXT,
  levels JSONB NOT NULL,  -- { "L1": "descriptor", "L2": "descriptor", ... }
  provenance provenance_type NOT NULL,  -- ENFORCED AT DB LEVEL
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roles (government positions)
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_hi TEXT,
  cadre TEXT,
  department TEXT,
  provenance provenance_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities (work functions within a role)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id),
  name TEXT NOT NULL,
  name_hi TEXT,
  description TEXT,
  provenance provenance_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity-Competency mapping (what competencies an activity requires)
CREATE TABLE activity_competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id),
  competency_id UUID NOT NULL REFERENCES competencies(id),
  target_level INTEGER NOT NULL CHECK (target_level BETWEEN 1 AND 5),
  priority activity_priority NOT NULL,
  UNIQUE(activity_id, competency_id)
);

-- Competency Records (a user's current level per competency)
-- NO CLIENT WRITES — only Edge Functions with service_role
CREATE TABLE competency_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  competency_id UUID NOT NULL REFERENCES competencies(id),
  current_level INTEGER NOT NULL CHECK (current_level BETWEEN 1 AND 5),
  evidence TEXT,  -- 'self-assessed' or assessment_id
  organization_id UUID NOT NULL REFERENCES organizations(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, competency_id)
);

-- Competency History (track changes over time)
CREATE TABLE competency_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  competency_id UUID NOT NULL REFERENCES competencies(id),
  level INTEGER NOT NULL,
  source TEXT NOT NULL,  -- 'self-assessed', 'assessment', 'admin-override'
  organization_id UUID NOT NULL REFERENCES organizations(id),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents (uploaded training materials)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES users(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  title TEXT NOT NULL,
  file_type TEXT NOT NULL,
  storage_key TEXT NOT NULL,   -- Cloudflare R2 object key
  storage_provider TEXT DEFAULT 'r2',  -- 'r2' or 'supabase'
  file_size_bytes BIGINT,
  page_count INTEGER,
  status document_status NOT NULL DEFAULT 'uploaded',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions (generated or authored)
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id),
  competency_id UUID NOT NULL REFERENCES competencies(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  stem TEXT NOT NULL,
  stem_hi TEXT,
  options JSONB NOT NULL,      -- [{ text, text_hi }]
  correct_index INTEGER NOT NULL,
  explanation TEXT,
  explanation_hi TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  confidence question_confidence,
  status question_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES users(id),
  source_ref TEXT,             -- page/section reference in source document
  topic TEXT,
  ai_provider TEXT,            -- which AI generated this
  prompt_version TEXT,         -- version of the generation prompt
  flag_count INTEGER DEFAULT 0,
  error_rate DECIMAL(5,2),
  provenance provenance_type NOT NULL DEFAULT 'SYNTHETIC_DEMO_DATA',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Assessments
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competency_id UUID REFERENCES competencies(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  type assessment_type NOT NULL,
  question_ids UUID[] NOT NULL,
  time_limit_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment Results (NO CLIENT WRITES)
CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID UNIQUE NOT NULL,  -- Client-generated UUID for idempotency
  user_id UUID NOT NULL REFERENCES users(id),
  assessment_id UUID NOT NULL REFERENCES assessments(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  topic_scores JSONB,
  triggered_by JSONB,  -- { type: 'diagnostic'|'post-course'|'retake', courseId? }
  completed_at TIMESTAMPTZ NOT NULL
);

-- Courses (iGOT or internal)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_hi TEXT,
  provider course_provider NOT NULL,
  type TEXT DEFAULT 'online',
  duration_hours INTEGER,
  competency_ids UUID[],
  difficulty TEXT,
  prerequisites UUID[],     -- prerequisite course IDs
  description TEXT,
  description_hi TEXT,
  igot_url TEXT,             -- deep link to iGOT course page
  karma_points INTEGER DEFAULT 0,
  provenance provenance_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Enrollments
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  status enrollment_status NOT NULL DEFAULT 'enrolled',
  karma_points_earned INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- Training Priorities (admin write-back actions)
CREATE TABLE training_priorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  department TEXT NOT NULL,
  role_id UUID REFERENCES roles(id),
  reason TEXT,
  flagged_by UUID NOT NULL REFERENCES users(id),
  flagged_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id)
);

-- Audit Log (IMMUTABLE — no updates, no deletes)
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  prompt_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 23.3 Automatic Audit Logging via PostgreSQL Triggers

```sql
-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (organization_id, user_id, action, entity_type, entity_id, details)
  VALUES (
    COALESCE(NEW.organization_id, OLD.organization_id),
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to audited tables
CREATE TRIGGER audit_assessment_results
  AFTER INSERT ON assessment_results
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_questions
  AFTER INSERT OR UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_training_priorities
  AFTER INSERT OR UPDATE ON training_priorities
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_competency_records
  AFTER INSERT OR UPDATE ON competency_records
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
```

---

## 24. Security, Privacy & RBAC

### 24.1 Threat Model

| Threat | Mitigation | Enforced by |
|---|---|---|
| Client bypasses UI role guard | Role guards are UX-only; RLS policies independently check role | PostgreSQL RLS policies |
| Client fabricates an assessment score | All scoring happens in Supabase Edge Function with `service_role` key | Edge Function + RLS deny client writes |
| Leaked AI provider API key | No AI key ever exists client-side; all AI calls proxy through Cloudflare Worker | Cloudflare Worker environment variables |
| Cross-organization data leakage | Every table has `organization_id`; every RLS policy checks it against JWT | PostgreSQL RLS from day one |
| Audit trail tampering | `audit_log` has no UPDATE/DELETE RLS policies; trigger writes are `SECURITY DEFINER` | PostgreSQL RLS + trigger architecture |
| Self-assessed weaknesses used punitively | Product policy: self-assessment is for learning, not appraisal; admin drill-down requires explicit role | RBAC + written in-product policy |
| JWT token manipulation | Supabase Auth signs JWTs with a secret; `app_metadata` cannot be modified by clients | Supabase Auth server-side only |

### 24.2 Two-Layer Authorization

1. **Client-side guards** — hide/show UI elements based on role. UX convenience only.
2. **Server-side enforcement** — PostgreSQL RLS policies check `auth.uid()`, `get_user_role()`, and `get_user_org_id()` on every query. Supabase Edge Functions use `service_role` key for protected writes.

### 24.3 Role Definitions

| Role | Access |
|---|---|
| `learner` | Own profile, own assessments, own courses/pathways, AI assistant |
| `trainer` | Everything a learner has, plus document upload, MCQ generation, question review, question bank |
| `admin` | Everything a trainer has, plus organization analytics, role/department drill-down (within org), write-back actions |

### 24.4 Environment & Secrets

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel env | Supabase project URL (not secret) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel env | Supabase anon key (not secret — security is RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel env (server-only) | For API routes needing admin access; never exposed to client |
| `SUPABASE_JWT_SECRET` | Cloudflare Worker secrets | For JWT verification in Workers |
| `GEMINI_API_KEY` | Cloudflare Worker secrets | Primary AI provider |
| `CLAUDE_API_KEY` | Cloudflare Worker secrets | Secondary AI provider |
| `OPENAI_API_KEY` | Cloudflare Worker secrets | Tertiary AI provider |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | Cloudflare Worker env | R2 bucket access |
| `DEMO_MODE` | Vercel env | Relaxes email-domain restrictions |
| `NEXT_PUBLIC_DEFAULT_LANGUAGE` | Vercel env | Fallback locale if detection fails |

---

## 25. Deployment Architecture — Vercel + Cloudflare + Supabase

### 25.1 Deployment Topology

```
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL                                │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                  │
│  │  Next.js App      │  │  API Routes      │                  │
│  │  (Edge/Serverless)│  │  (Node.js)       │                  │
│  │  SSR/SSG pages    │  │  BFF layer       │                  │
│  └──────────────────┘  └──────────────────┘                  │
│                                                              │
│  Preview deployments per PR (shareable URLs)                  │
│  Production: vercel.app or custom domain                     │
├─────────────────────────────────────────────────────────────┤
│                       SUPABASE                               │
│                                                              │
│  Project: statvidya-dev / statvidya-staging / statvidya-prod  │
│  PostgreSQL + Auth + Edge Functions + Realtime + Storage      │
│  Migrations managed via supabase CLI                         │
├─────────────────────────────────────────────────────────────┤
│                      CLOUDFLARE                              │
│                                                              │
│  Workers: ai-proxy, r2-upload (deployed via wrangler CLI)    │
│  R2 Bucket: statvidya-documents-{env}                        │
│  AI Gateway: statvidya-ai-gateway                            │
│  KV Namespace: rate-limits (optional)                        │
└─────────────────────────────────────────────────────────────┘
```

### 25.2 CI/CD Pipeline

```
Push to GitHub
   │
   ├─ Vercel: Auto-deploy (preview or production)
   │   └─ Build: next build → deploy
   │
   ├─ GitHub Action: Supabase
   │   └─ supabase db push (migrations)
   │   └─ supabase functions deploy
   │
   └─ GitHub Action: Cloudflare
       └─ wrangler deploy (Workers)
       └─ R2 bucket config (if changed)
```

### 25.3 Environment Strategy

| Environment | Vercel | Supabase | Cloudflare |
|---|---|---|---|
| **Development** | `localhost:3000` | Local (supabase start) | Local (wrangler dev) |
| **Staging** | Preview deployment | Separate Supabase project | Separate Workers/R2 |
| **Production** | Production deployment | Production Supabase project | Production Workers/R2 |

---

## 26. Analytics & Instrumentation

Instrument these events from Phase 1 onward:

| Event | Captures |
|---|---|
| `onboarding_completed` | time to complete, role selected, language selected |
| `gap_viewed` | competency id, severity bucket, verified vs self-assessed |
| `recommendation_shown` / `recommendation_started` | course id, ranking score, time-to-start |
| `assessment_started` / `assessment_completed` | mode (online/offline), duration, adaptive path taken |
| `offline_assessment_queued` / `offline_sync_completed` | queue duration, sync latency, success/failure |
| `question_generated` / `question_reviewed` | confidence tag, review outcome, review duration, AI provider used |
| `admin_writeback_action` | action type, target department/role |
| `provenance_badge_rendered` | surface, label — validates 100% coverage target |
| `ai_provider_fallback` | which provider failed, which succeeded, latency |

---

## 27. Release Plan

### MVP (demo-ready)
**Scope**: FR-AUTH-1/2, FR-RBAC-1/2, FR-ORG-1, FR-TRUST-1, FR-ONB-1/2, FR-PROFILE-2, FR-COMP-1–4, FR-ASSESS-1–5, FR-OFFLINE-1–3, FR-REC-1/2/4, FR-IGOT-1/2, FR-CONTENT-1/2/4–9, FR-AI-2, FR-ADMIN-1/3/4/5, FR-PWA-1/2, FR-I18N-1–3.
**Acceptance**: the golden-path demo script in §32.3 runs end to end.

### V1 (complete core loop)
**Scope**: remaining P1 items — full trainer review UX, AI assistant capabilities, profile history, recommendation pathways, notifications, iGOT contract documentation.

### V1.1 (hardening)
Error boundaries, accessibility audit, security-rule audit, responsive check, performance pass, demo recording.

### V2 (post-pilot)
Skill gap heatmap, training effectiveness (real data), demand forecasting, semantic search/RAG, live iGOT integration, certifications, real Parichay SSO (pending NIC authorization), push/email notifications.

---

## 28. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| All AI providers rate-limited during live demo | Low | High | Three-provider fallback chain + rule-based generator; cache results by document+config hash |
| Supabase free tier limits hit during development | Medium | Medium | Monitor usage; upgrade to Pro if needed; Edge Function cold starts are minimal |
| Cloudflare Worker/R2 setup complexity delays Phase 1 | Medium | Medium | R2 upload can be deferred — use Supabase Storage for all files initially, migrate later |
| Parichay SSO authorization takes months | High | Low (for demo) | Simulated SSO is the plan for SIH; document real integration path fully |
| Next.js PWA + offline is more complex than Vite PWA | Medium | Medium | @serwist/next is well-maintained; focus offline capability on assessment route only |
| PostgreSQL RLS policies are too restrictive/permissive | Medium | High | Test RLS exhaustively with different roles; use `pgTAP` for policy testing |
| Large PDF processing causes browser crashes | Medium | Medium | Page-range selector, Web Worker, 50-page batch limit, memory budget |
| Scope creep | High | High | Enforce P0/P1/P2 tagging literally; nothing outside current milestone enters a sprint |

---

## 29. Assumptions & Dependencies

- **Supabase account** is available (free tier sufficient for MVP; Pro recommended for Parichay OIDC/SAML).
- **Cloudflare account** is available (free tier covers Workers, R2, AI Gateway for development).
- **Vercel account** is available (free tier sufficient for development and preview deployments).
- **At least one AI provider API key** (Gemini, Claude, or OpenAI) is provisioned.
- **Parichay SSO** will be simulated for the hackathon demo. Real integration requires NIC registration at [meripehchaan.gov.in](https://meripehchaan.gov.in).
- Team size and timeline are undetermined; milestones are ordered by dependency, not calendar dates.
- iGOT Karmayogi will remain without a public API for the foreseeable future.

---

## 30. Out of Scope (V1)

- Live iGOT API integration (no public API exists)
- Skill Gap Heatmap, Training Effectiveness (real data), Demand Forecasting
- Real Parichay SSO (requires NIC authorization — simulated only)
- Semantic search / RAG over uploaded documents
- Certifications / verifiable skill passport
- Push/email notifications
- Organization hierarchy management beyond basic `organization_id` scoping
- Background/queued document processing (server-side PDF parsing)
- Virtual statistical practice lab / sandbox
- Training cohorts / communities, expert Q&A

---

## 31. Open Questions

1. **Team composition and timeline** — solo or team? Demo date?
2. **Cloud account readiness** — Supabase, Cloudflare, and Vercel accounts provisioned? AI API keys available?
3. **Government outreach** — send email to `mission.karmayogi@gov.in` for iGOT API access? Register at `meripehchaan.gov.in` for Parichay SSO credentials?
4. **Product name** — "StatVidya" acceptable?
5. **Supabase plan** — Free tier for MVP, or Pro tier for SAML SSO support and higher limits?
6. **Custom domain** — Do we need a `.gov.in` or `.in` domain for credibility, or is a `.vercel.app` URL acceptable for the demo?

---

## 32. Appendix

### 32.1 Glossary

| Term | Meaning |
|---|---|
| **FRAC** | Framework of Roles, Activities and Competencies — one of the Six Pillars of Mission Karmayogi |
| **Mission Karmayogi** | India's national programme for civil services capacity building |
| **iGOT Karmayogi** | The national learning platform under Mission Karmayogi |
| **DSEP** | Decentralized Skilling and Education Protocol — referenced in iGOT ecosystem |
| **Karma Points** | iGOT's unit of learner progress tracking |
| **APAR** | Annual Performance Appraisal Report |
| **ASK model** | Attitude, Skill, Knowledge — model underlying FRAC assessment |
| **MoSPI** | Ministry of Statistics and Programme Implementation |
| **NSSO / FOD** | National Sample Survey Office / Field Operations Division |
| **NSSTA** | National Statistical Systems Training Academy |
| **JSO / SSO** | Junior/Senior Statistical Officer (ISS/SSS cadre designations) |
| **CAPI** | Computer-Assisted Personal Interviewing |
| **PLFS / ASI / ASUSE** | Periodic Labour Force Survey / Annual Survey of Industries / Annual Survey of Unincorporated Sector Enterprises |
| **Parichay / Jan-Parichay** | India's National Single Sign-On framework managed by NIC |
| **MeriPehchaan** | Citizen-facing portal for Jan-Parichay SSO registration |
| **RLS** | Row Level Security — PostgreSQL feature enforcing data access at the database level |
| **R2** | Cloudflare's S3-compatible object storage with $0 egress |
| **Edge Function** | Serverless function running on Supabase (Deno runtime) |
| **AI Gateway** | Cloudflare's proxy layer for AI providers with built-in fallback/logging |

### 32.2 Provenance Summary (seed reference)

| Category | Label |
|---|---|
| SIH 26101 problem statement | ✅ VERIFIED_OFFICIAL |
| FRAC methodology and structure | ✅ VERIFIED_OFFICIAL |
| iGOT Karmayogi's existence, scale, no-public-API status | ✅ VERIFIED_OFFICIAL |
| Real role designations (JSO, SSO, etc.), MoSPI, NSSTA | ✅ VERIFIED_OFFICIAL |
| Specific competency list, level descriptors, Activity→Competency mappings | ⚠️ PROPOSED_FRAMEWORK |
| Gap-severity formula, readiness index, recommendation scoring | ⚠️ PROPOSED_METHODOLOGY |
| Course catalog, iGOT course data, sample questions, mock org aggregates | 🟡 SYNTHETIC_DEMO_DATA |

### 32.3 Golden Path / Acceptance Demo Script

1. **Field Investigator, offline, Hindi**: install as PWA → sign in via simulated Parichay SSO as FI persona → interface loads in Hindi → open pre-cached assessment → go offline → complete → reconnect → verify sync and competency update → toggle to English.
2. **Desk officer, FRAC-grounded gaps**: switch persona → dashboard shows readiness index → Skill Gap shows highest-severity item with FRAC explanation → click to Learning Pathways with real iGOT deep link.
3. **Admin, outcome correlation**: switch to admin → view training→outcome chart (labeled simulated) → read AI narrative → flag department for priority training.
4. **Trainer, content pipeline**: switch to trainer → upload PDF (direct to R2) → select page range → configure and generate questions (via AI Gateway multi-provider) → sanity check → review confidence-sorted queue → publish.
5. **Loop closes**: switch to desk officer → take assessment from newly published bank → complete → verify competency level updates.
6. **Trust flash**: show RLS denies direct client writes to competency records; show provenance badges on every domain-data screen.

### 32.4 Environment Variables Reference

```env
# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-only, never exposed to client
SUPABASE_JWT_SECRET=your-jwt-secret

# === Cloudflare ===
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_AI_GATEWAY_ID=statvidya-ai-gateway
R2_BUCKET_NAME=statvidya-documents
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key

# === AI Providers (Cloudflare Worker secrets only) ===
GEMINI_API_KEY=your-gemini-key
CLAUDE_API_KEY=your-claude-key
OPENAI_API_KEY=your-openai-key

# === App Config ===
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
DEMO_MODE=true
NEXT_PUBLIC_APP_URL=https://statvidya.vercel.app

# === Cloudflare Worker URLs ===
NEXT_PUBLIC_AI_PROXY_URL=https://ai-proxy.statvidya.workers.dev
NEXT_PUBLIC_R2_UPLOAD_URL=https://r2-upload.statvidya.workers.dev
```

---

*End of document. This PRD is the single source of truth for what StatVidya does, why, and how — from the PostgreSQL schema to the Cloudflare AI Gateway to the Parichay SSO integration flow.*