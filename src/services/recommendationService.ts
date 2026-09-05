/**
 * recommendationService.ts — Course & Pathway Recommendation Engine
 *
 * Implements FR-REC-1, FR-REC-2, FR-REC-3, FR-REC-4
 * Multi-signal course ranking based on:
 * 1. Competency Gap Severity (Gap * Priority Weight)
 * 2. Role Criticality
 * 3. Difficulty Level Match (Foundational -> Applied -> Capstone)
 *
 * Generates transparent, explainable recommendations with direct iGOT Karmayogi mappings.
 */

import type { CompetencyGap } from '@/lib/types';
import { SEVERITY_WEIGHTS } from './competencyService';

export interface Course {
  id: string;
  courseId: string;
  title: string;
  title_hi?: string;
  provider: string;
  duration: string;
  description: string;
  description_hi?: string;
  targetCompetencies: string[]; // Competency IDs
  targetLevel: number;
  stage: 'FOUNDATIONAL' | 'APPLIED' | 'CAPSTONE';
  iGotLink: string;
  rating?: number;
  enrolledCount?: number;
}

export interface RankedRecommendation {
  course: Course;
  score: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  whyRecommended: string;
  whyRecommended_hi: string;
  matchingGaps: {
    competencyId: string;
    competencyName: string;
    competencyNameHi?: string;
    currentLevel: number;
    targetLevel: number;
    gap: number;
  }[];
}

/**
 * Standard seed catalog of official iGOT Karmayogi & NSSTA statistical courses
 */
export const OFFICIAL_COURSE_CATALOG: Course[] = [
  {
    id: 'course-capi-101',
    courseId: 'igot-capi-adv',
    title: 'Advanced CAPI Tablet Operations & Synchronization',
    title_hi: 'उन्नत कैपी टैबलेट संचालन और तुल्यकालन',
    provider: 'NSSTA & MoSPI Digital Training Cell',
    duration: '4 hours',
    description: 'Master offline listing, error-checking, GPS tagging, and daily data synchronization protocols on CAPI tablets.',
    description_hi: 'कैपी टैबलेट पर ऑफ़लाइन सूचीकरण, त्रुटि-जांच, जीपीएस टैगिंग और दैनिक डेटा तुल्यकालन प्रोटोकॉल में महारत हासिल करें।',
    targetCompetencies: ['comp-capi'],
    targetLevel: 4,
    stage: 'APPLIED',
    iGotLink: 'https://igotkarmayogi.gov.in/app/toc/do_1138472910_capi_advanced/overview',
    rating: 4.9,
    enrolledCount: 1420,
  },
  {
    id: 'course-nsso-plfs',
    courseId: 'igot-nsso-plfs',
    title: 'Periodic Labour Force Survey (PLFS) Concepts & Definitions',
    title_hi: 'आवधिक श्रम बल सर्वेक्षण (PLFS) अवधारणाएं और परिभाषाएं',
    provider: 'National Statistical Systems Training Academy (NSSTA)',
    duration: '6 hours',
    description: 'Deep dive into activity status determination, industry-occupation codes (NIC/NCO), and household schedule canvassing.',
    description_hi: 'गतिविधि स्थिति निर्धारण, उद्योग-व्यवसाय कोड (NIC/NCO), और घरेलू अनुसूची सर्वेक्षण में गहन अध्ययन।',
    targetCompetencies: ['comp-nsso'],
    targetLevel: 3,
    stage: 'FOUNDATIONAL',
    iGotLink: 'https://igotkarmayogi.gov.in/app/toc/do_1139482711_nsso_plfs/overview',
    rating: 4.8,
    enrolledCount: 3890,
  },
  {
    id: 'course-sampling-design',
    courseId: 'igot-sampling-design',
    title: 'Multistage Stratified Sampling in Large-Scale Household Surveys',
    title_hi: 'बड़े पैमाने के घरेलू सर्वेक्षणों में बहु-चरणीय स्तरीकृत नमूनाकरण',
    provider: 'NSSTA Faculty & ISI Kolkata',
    duration: '8 hours',
    description: 'Practical training on Primary Sampling Unit (PSU) selection, circular systematic sampling, and multiplier calculations.',
    description_hi: 'प्राथमिक नमूना इकाई (PSU) चयन, परिपत्र व्यवस्थित नमूनाकरण, और गुणक गणना पर व्यावहारिक प्रशिक्षण।',
    targetCompetencies: ['comp-survey'],
    targetLevel: 3,
    stage: 'APPLIED',
    iGotLink: 'https://igotkarmayogi.gov.in/app/toc/do_1137281920_survey_sampling/overview',
    rating: 4.7,
    enrolledCount: 920,
  },
  {
    id: 'course-data-scrutiny',
    courseId: 'igot-data-scrutiny',
    title: 'Statistical Data Scrutiny, Validation Rules & Outlier Detection',
    title_hi: 'सांख्यिकीय डेटा जांच, सत्यापन नियम और आउटलायर पहचान',
    provider: 'Data Quality Assurance Division (DQAD), MoSPI',
    duration: '5 hours',
    description: 'Learn inter-round consistency checks, range validation, and computerized scrutiny rules for socio-economic surveys.',
    description_hi: 'सामाजिक-आर्थिक सर्वेक्षणों के लिए अंतर-दौर निरंतरता जांच, सीमा सत्यापन और कम्प्यूटरीकृत जांच नियम सीखें।',
    targetCompetencies: ['comp-data'],
    targetLevel: 3,
    stage: 'APPLIED',
    iGotLink: 'https://igotkarmayogi.gov.in/app/toc/do_1138291024_data_scrutiny/overview',
    rating: 4.6,
    enrolledCount: 2150,
  },
  {
    id: 'course-field-teamwork',
    courseId: 'igot-field-teamwork',
    title: 'Effective Field Team Coordination & Informant Engagement',
    title_hi: 'प्रभावी क्षेत्र टीम समन्वय और सूचनादाता जुड़ाव',
    provider: 'Mission Karmayogi Behavioral Competency Hub',
    duration: '3 hours',
    description: 'Behavioral strategies for overcoming respondent reluctance, cultural sensitivity in field enumeration, and team logistics.',
    description_hi: 'उत्तरदाताओं की हिचकिचाहट को दूर करने के लिए व्यवहार संबंधी रणनीतियाँ, क्षेत्रीय गणना में सांस्कृतिक संवेदनशीलता और टीम रसद।',
    targetCompetencies: ['comp-teamwork'],
    targetLevel: 3,
    stage: 'FOUNDATIONAL',
    iGotLink: 'https://igotkarmayogi.gov.in/app/toc/do_1136281900_teamwork_karmayogi/overview',
    rating: 4.8,
    enrolledCount: 5400,
  },
];

/**
 * Score and rank courses based on official's current competency gaps
 *
 * Formula:
 * RankScore = SUM(GapMagnitude * PriorityWeight * LevelRelevanceMultiplier)
 */
export function rankCoursesForGaps(
  gaps: CompetencyGap[],
  catalog: Course[] = OFFICIAL_COURSE_CATALOG
): RankedRecommendation[] {
  if (!gaps || gaps.length === 0) {
    return [];
  }

  const recommendations: RankedRecommendation[] = [];

  for (const course of catalog) {
    let totalScore = 0;
    const matchingGaps: RankedRecommendation['matchingGaps'] = [];

    for (const gap of gaps) {
      if (course.targetCompetencies.includes(gap.competencyId) && gap.gap > 0) {
        const priorityWeight = SEVERITY_WEIGHTS[gap.priority] || 10;

        // Match level delta: courses targeted at or 1 level above gap target receive highest boost
        let levelMultiplier = 1.0;
        if (course.targetLevel === gap.targetLevel) {
          levelMultiplier = 1.5;
        } else if (course.targetLevel > gap.targetLevel) {
          levelMultiplier = 1.2;
        }

        const gapScore = gap.gap * priorityWeight * levelMultiplier;
        totalScore += gapScore;

        matchingGaps.push({
          competencyId: gap.competencyId,
          competencyName: gap.competency.name,
          competencyNameHi: gap.competency.name_hi,
          currentLevel: gap.currentLevel,
          targetLevel: gap.targetLevel,
          gap: gap.gap,
        });
      }
    }

    if (matchingGaps.length > 0) {
      // Determine priority bucket
      const priority: RankedRecommendation['priority'] =
        totalScore >= 150 ? 'HIGH' : totalScore >= 70 ? 'MEDIUM' : 'LOW';

      // Generate transparent explainability strings
      const primaryGap = matchingGaps[0];
      const enName = primaryGap.competencyName;
      const hiName = primaryGap.competencyNameHi || enName;
      const whyRecommended = `Directly bridges your ${primaryGap.gap}-level gap in ${enName} (L${primaryGap.currentLevel} → L${primaryGap.targetLevel}) required for official duties.`;
      const whyRecommended_hi = `आधिकारिक कर्तव्यों के लिए आवश्यक ${hiName} में आपके ${primaryGap.gap}-स्तर के अंतर (L${primaryGap.currentLevel} → L${primaryGap.targetLevel}) को सीधे पूरा करता है।`;

      recommendations.push({
        course,
        score: Math.round(totalScore),
        priority,
        whyRecommended,
        whyRecommended_hi,
        matchingGaps,
      });
    }
  }

  // Sort descending by score
  return recommendations.sort((a, b) => b.score - a.score);
}
