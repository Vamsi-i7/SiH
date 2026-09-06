/**
 * src/data/copilotFaqResponses.ts
 *
 * Curated, high-fidelity pre-made responses for frequently asked questions and
 * quick-action prompts in StatVidya Copilot.
 *
 * When a user selects a suggestion or asks a standard FAQ, the Copilot can
 * respond immediately after a brief simulated AI thinking delay (~500ms),
 * saving API quota while providing a lightning-fast, delightful experience.
 */

import type { CopilotUserContext } from '@/lib/copilotPrompt';

export interface PreMadeFaq {
  id: string;
  matchPatterns: (string | RegExp)[];
  getResponse: (userContext?: CopilotUserContext) => string;
}

export const COPILOT_PREMADE_FAQS: PreMadeFaq[] = [
  {
    id: 'readiness-index',
    matchPatterns: [
      'What is my readiness index and how can I improve it?',
      /readiness\s*index/i,
      /how\s*can\s*i\s*improve\s*(my\s*)?readiness/i,
      /what\s*is\s*my\s*readiness/i,
    ],
    getResponse: (ctx) => {
      const name = ctx?.name ? `**${ctx.name}**` : 'Officer';
      const designation = ctx?.designation || 'Statistical Official';
      return `### 📊 Understanding Your Readiness Index

Hello ${name}! As a **${designation}**, your **Readiness Index** represents the percentage of your role's required FRAC competencies where your verified proficiency level meets or exceeds the target level.

#### How It Works:
- **Mathematical Formula**: Readiness is calculated as the sum of weighted verified competencies divided by total required target weights for your cadre.
- **Priority Multipliers**: **Critical** competencies carry a 3.0× weight, **Important** carry 2.0×, and **Desirable** carry 1.0×.

#### 🚀 3 Ways to Quickly Boost Your Readiness:
1. **Target Critical Gaps**: Head to \`/skill-gap\` to see which high-impact competencies have the largest deficit.
2. **Complete Adaptive Assessments**: Take verified assessments on \`/assessment/comp-capi\` to promote your competency level from L1/L2 to higher proficiency.
3. **Enroll in Recommended Courses**: Explore tailored MoSPI/iGOT learning modules on \`/pathways\` to close practical gaps.`;
    },
  },
  {
    id: 'skill-gaps',
    matchPatterns: [
      'Show me my top competency gaps and what to do about them',
      /top\s*(competency\s*|skill\s*)?gaps/i,
      /what\s*are\s*my\s*gaps/i,
      /skill\s*gaps/i,
    ],
    getResponse: () => {
      return `### 🎯 Your Competency Gap Analysis

StatVidya classifies your competency gaps into 3 severity levels based on the deficit between your **current verified level** and your **cadre target level**:

#### Gap Severity Classifications:
- **High Severity (Critical Deficit)**: Deficit of 2+ levels on a Critical priority competency (e.g., CAPI Tablet Operations or Survey Sampling). Requires immediate training intervention.
- **Moderate Severity**: Deficit of 1 level on Critical/Important competencies, or 2 levels on Desirable competencies.
- **Proficient**: You meet or exceed your role's target benchmark!

#### Next Steps:
- Review your interactive **Competency Radar Chart** on \`/dashboard\`.
- Check detailed root-cause insights and operational impact on \`/skill-gap\`.
- Jump straight to targeted training pathways on \`/pathways\`.`;
    },
  },
  {
    id: 'take-assessment',
    matchPatterns: [
      'How do I start an assessment?',
      /start\s*(an\s*)?assessment/i,
      /take\s*(an\s*)?assessment/i,
      /how\s*to\s*test/i,
    ],
    getResponse: () => {
      return `### 📝 Starting an Adaptive Assessment

Assessments on StatVidya are designed to verify your practical operational skills under MoSPI / NSSO protocols.

#### How the Assessment Engine Works:
- **Adaptive Questions**: Questions dynamically calibrate between Easy, Medium, and Hard based on your real-time responses.
- **Timed Simulation**: Standard assessments feature a countdown timer and a review palette before final submission.
- **Automatic Promotion**: Scoring **70% or above** automatically upgrades your verified FRAC competency level in your official profile.
- **Offline Capable**: You can complete tests even with intermittent field internet — submissions queue safely in your browser cache.

👉 **Ready to test?** Visit \`/assessment/comp-capi\` to begin your CAPI Tablet Operations assessment!`;
    },
  },
  {
    id: 'recommend-courses',
    matchPatterns: [
      'Recommend iGOT courses for my skill gaps',
      /recommend\s*(igot\s*)?courses/i,
      /recommended\s*courses/i,
      /what\s*courses\s*should\s*i\s*take/i,
    ],
    getResponse: (ctx) => {
      const cadre = ctx?.cadre || 'Official Statistical System';
      return `### 🛤️ Recommended iGOT Karmayogi Courses

Here are the highest-priority courses curated for the **${cadre}**:

#### 1. 📱 Advanced CAPI Tablet Operations & Synchronization
- **Competency**: CAPI Tablet Operation (L3 Target)
- **Duration**: 4.5 Hours | **Provider**: NSSTA / MoSPI
- **Focus**: Household listing, error flag reconciliation, offline CAPI data caching.

#### 2. 📊 Multistage Stratified Sampling in Large-Scale Surveys
- **Competency**: Survey Sampling & Design (L3 Target)
- **Duration**: 6.0 Hours | **Provider**: NSSTA
- **Focus**: Second-stage stratum selection, multiplier calculation, sampling variance.

#### 3. 🔍 Statistical Data Scrutiny, Validation Rules & Outlier Detection
- **Competency**: Data Entry & Scrutiny (L3 Target)
- **Duration**: 3.5 Hours | **Provider**: MoSPI Training Division
- **Focus**: Schedule 0.0 scrutiny rules, cross-table ratio consistency.

Visit \`/pathways\` to browse the full catalog with direct enrolment links!`;
    },
  },
  {
    id: 'frac-levels',
    matchPatterns: [
      'Explain the FRAC competency levels L1 to L5',
      /explain\s*(the\s*)?frac/i,
      /frac\s*levels/i,
      /l1\s*to\s*l5/i,
      /what\s*is\s*frac/i,
    ],
    getResponse: () => {
      return `### 🏛️ Mission Karmayogi FRAC Levels (L1 – L5)

Under the **Framework for Roles, Activities, and Competencies (FRAC)**, statistical proficiency is standardized across five progressive tiers:

- **L1 (Basic Awareness)**: Understands core terminology, definitions, and standard acronyms. Requires direct supervision.
- **L2 (Intermediate / Guided)**: Able to carry out routine data canvassing, CAPI entry, and standard schedule filling with minimal assistance.
- **L3 (Advanced / Independent)**: Operates autonomously in the field. Capable of handling non-standard field situations and scrutiny checks.
- **L4 (Expert / Supervisory)**: Supervises field teams, conducts quality audits, scrutinizes primary schedules, and mentors junior staff.
- **L5 (Master / Strategic)**: Designs survey methodology, defines national sampling designs, and leads statistical policy formulation.

Your verified level increases as you complete authorized learning pathways and adaptive assessments!`;
    },
  },
  {
    id: 'platform-guide',
    matchPatterns: [
      'Give me a quick overview of all platform features',
      /overview\s*of\s*(all\s*)?platform/i,
      /platform\s*guide/i,
      /features\s*overview/i,
      /what\s*can\s*(this|statvidya)\s*do/i,
    ],
    getResponse: () => {
      return `### 🧭 StatVidya Platform Tour

StatVidya is India's dedicated AI-powered competency management system for the **Ministry of Statistics and Programme Implementation (MoSPI)**.

#### Core Platform Modules:
- 📊 **Dashboard (\`/dashboard\`)**: Track your real-time Readiness Index, personalized greeting, and competency radar overview.
- 🎯 **Skill Gap Matrix (\`/skill-gap\`)**: Drill down into operational skill gaps with priority weights and remedial suggestions.
- 📝 **Adaptive Assessments (\`/assessment/comp-capi\`)**: Live evaluation engine with instant scoring and competency upgrades.
- 🛤️ **Learning Pathways (\`/pathways\`)**: Curated MoSPI & iGOT courses matched directly to your deficits.
- 📑 **Survey Document Parser (\`/documents\`)**: Upload NSSO/NSSTA manuals and generate instant competency frameworks.
- 🤖 **AI MCQ Generator (\`/mcq-generator\`)**: Create customized question banks from official statistical handbooks.
- 🏛️ **Admin Workforce Governance (\`/admin/analytics\`)**: Departmental scrutiny audits, readiness correlations, and priority flagging.`;
    },
  },
];

/**
 * Checks if a user prompt matches any pre-made FAQ.
 * Returns the matching response string or null.
 */
export function matchPreMadeFaq(
  prompt: string,
  userContext?: CopilotUserContext
): string | null {
  const normalized = prompt.trim().toLowerCase();
  if (!normalized) return null;

  for (const faq of COPILOT_PREMADE_FAQS) {
    for (const pattern of faq.matchPatterns) {
      if (typeof pattern === 'string') {
        if (normalized === pattern.toLowerCase()) {
          return faq.getResponse(userContext);
        }
      } else if (pattern instanceof RegExp) {
        if (pattern.test(normalized)) {
          return faq.getResponse(userContext);
        }
      }
    }
  }

  return null;
}
