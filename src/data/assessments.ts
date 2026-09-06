/**
 * src/data/assessments.ts
 *
 * Static assessment catalog for the StatVidya assessment engine.
 * Four functional assessments for the MVP / SIH demo.
 *
 * Structure is designed to be drop-in replaceable with Cloud Firestore queries:
 * each Assessment mirrors what a backend API would return.
 *
 * IMPORTANT: correctAnswer is a 0-based index and must NEVER be surfaced
 * in the question display UI — it is only used by the scoring logic after
 * the assessment is submitted.
 */

export interface AssessmentQuestion {
  id: string;
  question: string;
  question_hi?: string;
  options: string[];
  options_hi?: string[];
  correctAnswer: number; // 0-based index, kept server-side
}

export interface AssessmentMeta {
  id: string;
  title: string;
  title_hi?: string;
  description: string;
  description_hi?: string;
  durationSeconds: number;
  totalQuestions: number;
  type: string;
  icon?: string;
}

export interface Assessment extends AssessmentMeta {
  questions: AssessmentQuestion[];
}

// ============================================================
// Assessment 1 — Problem Solving
// ============================================================

const PROBLEM_SOLVING: Assessment = {
  id: 'problem-solving',
  title: 'Problem Solving',
  title_hi: 'समस्या समाधान',
  description:
    'Evaluate your ability to identify problems, analyse information, and implement effective solutions under realistic scenarios.',
  description_hi:
    'वास्तविक परिदृश्यों में समस्याओं की पहचान, सूचनाओं का विश्लेषण और प्रभावी समाधान लागू करने की क्षमता का मूल्यांकन करें।',
  durationSeconds: 5 * 60,
  totalQuestions: 10,
  type: 'Multiple Choice',
  questions: [
    {
      id: 'ps-q1',
      question:
        'A field survey team notices that 30% of the collected data forms are incomplete. What is the best first step?',
      options: [
        'Identify which questions are most frequently left blank and investigate the cause',
        'Submit the available data immediately to meet the deadline',
        'Discard all incomplete forms to maintain data quality',
        'Wait for supervisors to give instructions before acting',
      ],
      correctAnswer: 0,
    },
    {
      id: 'ps-q2',
      question:
        'When faced with a complex statistical problem, which approach is most effective?',
      options: [
        'Guess an answer quickly to save time',
        'Break the problem into smaller, manageable sub-problems',
        'Ask a colleague to solve it instead',
        'Ignore the problem until it resolves itself',
      ],
      correctAnswer: 1,
    },
    {
      id: 'ps-q3',
      question:
        'You discover that the sampling frame for a survey is outdated by three years. What should you do?',
      options: [
        'Proceed with the outdated frame since updating it takes too long',
        'Report the issue and work with supervisors to update or replace the frame',
        'Add a random 10% oversampling to compensate',
        'Switch to convenience sampling without documentation',
      ],
      correctAnswer: 1,
    },
    {
      id: 'ps-q4',
      question:
        'A statistical report shows an unexpected spike in a key indicator. What is the most appropriate initial response?',
      options: [
        'Publish the finding immediately to show responsiveness',
        'Verify the data for errors before drawing any conclusions',
        'Attribute the spike to seasonal variation without verification',
        'Remove the outlier from the dataset to smooth the trend',
      ],
      correctAnswer: 1,
    },
    {
      id: 'ps-q5',
      question: 'Which of the following best describes a root-cause analysis?',
      options: [
        'Identifying the most visible symptom of a problem',
        'Assigning blame to the team member who reported the issue',
        'Investigating the underlying reasons that caused a problem, not just its surface symptoms',
        'Creating a checklist of problems for future reference',
      ],
      correctAnswer: 2,
    },
    {
      id: 'ps-q6',
      question:
        'A district-level database shows inconsistent population figures across two reports. What is the correct approach?',
      options: [
        'Use whichever figure appears in the more recent report',
        'Average the two figures and use that as the official value',
        'Cross-reference with primary source documents and flag the discrepancy formally',
        'Delete the older report to avoid confusion',
      ],
      correctAnswer: 2,
    },
    {
      id: 'ps-q7',
      question:
        'You are given limited resources and multiple survey targets to cover in a single day. What strategy is best?',
      options: [
        'Prioritise targets by geographic proximity and importance, then allocate time accordingly',
        'Cover all targets superficially to show maximum outreach',
        'Skip the difficult targets and only visit easy ones',
        'Request more resources and do not start until they arrive',
      ],
      correctAnswer: 0,
    },
    {
      id: 'ps-q8',
      question:
        'When two valid methodologies produce different results for the same analysis, the correct action is to:',
      options: [
        'Pick the result that aligns with your hypothesis',
        'Document both results, describe the methodological differences, and recommend further review',
        'Average the two results to get a compromise value',
        'Use only the result that your manager prefers',
      ],
      correctAnswer: 1,
    },
    {
      id: 'ps-q9',
      question:
        'A new software tool is introduced for data entry but frequently crashes. What is the most productive response?',
      options: [
        'Refuse to use the tool and revert to paper-based methods permanently',
        'Continue using the tool without reporting the crashes',
        'Document the crash conditions, report them to IT, and use a backup method temporarily',
        'Wait for a colleague to resolve the issue before doing any work',
      ],
      correctAnswer: 2,
    },
    {
      id: 'ps-q10',
      question:
        'During analysis, you find that a key variable has 40% missing values. The best course of action is to:',
      options: [
        'Ignore the missing values and proceed with the complete cases only without disclosure',
        'Replace all missing values with zeros to fill the dataset',
        'Assess the pattern of missingness, apply an appropriate imputation method, and document the approach',
        'Remove the variable entirely from the analysis without informing stakeholders',
      ],
      correctAnswer: 2,
    },
  ],
};

// ============================================================
// Assessment 2 — Critical Thinking
// ============================================================

const CRITICAL_THINKING: Assessment = {
  id: 'critical-thinking',
  title: 'Critical Thinking',
  title_hi: 'आलोचनात्मक सोच',
  description:
    'Test your capacity to objectively evaluate evidence, recognise assumptions, and form well-reasoned conclusions.',
  description_hi:
    'साक्ष्यों का निष्पक्ष मूल्यांकन, मान्यताओं की पहचान और सुविचारित निष्कर्ष निकालने की क्षमता की जांच करें।',
  durationSeconds: 5 * 60,
  totalQuestions: 10,
  type: 'Multiple Choice',
  questions: [
    {
      id: 'ct-q1',
      question:
        'A senior colleague asserts that a particular survey methodology is always correct. Your critical response should be to:',
      options: [
        'Accept the claim without question because of their seniority',
        'Politely request supporting evidence and consider alternative methodologies',
        'Publicly disagree in a team meeting without evidence',
        'Adopt a different methodology without informing anyone',
      ],
      correctAnswer: 1,
    },
    {
      id: 'ct-q2',
      question:
        'Which statement best reflects critical thinking in data interpretation?',
      options: [
        'Data always tells the complete truth without need for context',
        'Context, methodology, and potential biases must be considered alongside the data',
        'The most recent data is always the most accurate',
        'If the sample size is large, the findings are necessarily correct',
      ],
      correctAnswer: 1,
    },
    {
      id: 'ct-q3',
      question:
        'A government report claims a 15% rise in rural literacy. Before accepting this finding, you should:',
      options: [
        'Share the report widely without any review',
        'Examine the sample design, data collection methods, and definition of literacy used',
        'Assume the government would not publish incorrect data',
        'Compare only to last year\'s figure with no other checks',
      ],
      correctAnswer: 1,
    },
    {
      id: 'ct-q4',
      question:
        'Which of the following is an example of confirmation bias in statistical analysis?',
      options: [
        'Reviewing all data objectively before drawing conclusions',
        'Seeking out data that supports a pre-existing belief while ignoring contradictory evidence',
        'Using randomised sampling to avoid bias',
        'Reporting both positive and negative findings transparently',
      ],
      correctAnswer: 1,
    },
    {
      id: 'ct-q5',
      question:
        'A chart shows a steep rise in income over the past decade. Before interpreting it as real growth, you should check:',
      options: [
        'Whether the y-axis starts at zero or is truncated to exaggerate differences',
        'Whether the chart colours are visually appealing',
        'The name of the organisation that produced the chart',
        'Whether the chart title is in English or Hindi',
      ],
      correctAnswer: 0,
    },
    {
      id: 'ct-q6',
      question:
        'Two studies reach opposite conclusions about the same policy. A critical thinker would:',
      options: [
        'Believe the study published by the more prestigious institution',
        'Discard both studies as unreliable',
        'Analyse the methodology, sample sizes, and funding sources of each study',
        'Choose the conclusion that is more politically acceptable',
      ],
      correctAnswer: 2,
    },
    {
      id: 'ct-q7',
      question:
        '"Correlation implies causation" is:',
      options: [
        'Always true if the correlation coefficient is above 0.9',
        'A logical fallacy; correlation does not establish causation',
        'True only for government-published statistics',
        'True when the sample size exceeds 1,000',
      ],
      correctAnswer: 1,
    },
    {
      id: 'ct-q8',
      question:
        'When evaluating an argument, which element is most important to identify first?',
      options: [
        'The author\'s credentials',
        'The length of the argument',
        'The core claim and the evidence offered to support it',
        'Whether the argument agrees with existing policy',
      ],
      correctAnswer: 2,
    },
    {
      id: 'ct-q9',
      question:
        'A survey result contradicts your team\'s expectations. You should:',
      options: [
        'Suppress the result to avoid controversy',
        'Adjust the data until it matches the expected outcome',
        'Investigate the methodology for errors and, if sound, report the result as found',
        'Immediately blame the field investigators for errors',
      ],
      correctAnswer: 2,
    },
    {
      id: 'ct-q10',
      question:
        'Which best describes an "assumption" in an argument?',
      options: [
        'A fact that has been verified by independent sources',
        'An unstated premise that the argument depends on being true',
        'A statistical test result with a p-value below 0.05',
        'A conclusion that directly follows from the data',
      ],
      correctAnswer: 1,
    },
  ],
};

// ============================================================
// Assessment 3 — Communication
// ============================================================

const COMMUNICATION: Assessment = {
  id: 'communication',
  title: 'Communication',
  title_hi: 'संचार',
  description:
    'Assess your skills in clearly conveying information, active listening, and adapting communication for different audiences.',
  description_hi:
    'जानकारी स्पष्ट रूप से संप्रेषित करने, सक्रिय श्रवण, और विभिन्न दर्शकों के लिए संचार अनुकूलन में आपके कौशल का आकलन करें।',
  durationSeconds: 5 * 60,
  totalQuestions: 10,
  type: 'Multiple Choice',
  questions: [
    {
      id: 'cm-q1',
      question:
        'When explaining a complex statistical concept to a non-technical audience, you should:',
      options: [
        'Use technical jargon to appear authoritative',
        'Simplify the language, use relatable examples, and check for understanding',
        'Provide a detailed mathematical derivation',
        'Limit the explanation to a single sentence',
      ],
      correctAnswer: 1,
    },
    {
      id: 'cm-q2',
      question: 'Active listening is best demonstrated by:',
      options: [
        'Formulating your reply while the other person is still speaking',
        'Making eye contact and summarising what was said to confirm understanding',
        'Nodding continuously regardless of whether you understand',
        'Interrupting to correct factual errors as soon as they occur',
      ],
      correctAnswer: 1,
    },
    {
      id: 'cm-q3',
      question:
        'A field investigator writes a report filled with unexplained acronyms sent to district officials. The main communication failure is:',
      options: [
        'The report is too short',
        'The report is not written in Hindi',
        'Failure to consider the audience\'s familiarity with the terminology',
        'The report was sent by email instead of by post',
      ],
      correctAnswer: 2,
    },
    {
      id: 'cm-q4',
      question:
        'Which type of question encourages the most informative response during a household survey?',
      options: [
        'Leading questions that suggest the preferred answer',
        'Closed questions with only yes/no options',
        'Open-ended questions that allow the respondent to elaborate',
        'Double-barrelled questions covering two topics at once',
      ],
      correctAnswer: 2,
    },
    {
      id: 'cm-q5',
      question:
        'A colleague responds defensively to your feedback. The most effective next step is to:',
      options: [
        'Escalate the issue to a supervisor immediately',
        'Withdraw the feedback to avoid conflict',
        'Acknowledge their perspective, reframe the feedback constructively, and focus on shared goals',
        'Repeat the feedback louder and more firmly',
      ],
      correctAnswer: 2,
    },
    {
      id: 'cm-q6',
      question:
        'The primary purpose of an executive summary in a statistical report is to:',
      options: [
        'Replace all other sections of the report',
        'Provide a concise overview of key findings and recommendations for decision-makers',
        'List all the raw data tables',
        'Explain the history of the survey methodology',
      ],
      correctAnswer: 1,
    },
    {
      id: 'cm-q7',
      question:
        'When communicating unfavourable findings to a senior official, you should:',
      options: [
        'Soften the findings to the point where the concern is no longer apparent',
        'Delay sharing until the findings improve',
        'Present the findings clearly and objectively, accompanied by evidence and possible next steps',
        'Only share the findings verbally to avoid a paper trail',
      ],
      correctAnswer: 2,
    },
    {
      id: 'cm-q8',
      question:
        'Non-verbal communication in a formal presentation includes:',
      options: [
        'Font size and colour scheme in slides',
        'Posture, eye contact, and facial expressions of the presenter',
        'The number of slides in the presentation',
        'The language used in the written report',
      ],
      correctAnswer: 1,
    },
    {
      id: 'cm-q9',
      question:
        'Which of the following is an example of poor written communication in official correspondence?',
      options: [
        'Using clear headings and bullet points',
        'Beginning paragraphs with the key message',
        'Using a vague subject line such as "Regarding the matter"',
        'Keeping sentences concise and specific',
      ],
      correctAnswer: 2,
    },
    {
      id: 'cm-q10',
      question:
        'The "5 Cs" of effective written communication include clarity, conciseness, correctness, completeness, and:',
      options: [
        'Creativity',
        'Courtesy',
        'Complexity',
        'Currency',
      ],
      correctAnswer: 1,
    },
  ],
};

// ============================================================
// Assessment 4 — Decision Making
// ============================================================

const DECISION_MAKING: Assessment = {
  id: 'decision-making',
  title: 'Decision Making',
  title_hi: 'निर्णय लेना',
  description:
    'Measure your ability to evaluate options, weigh risks, consider stakeholder impact, and make timely, well-founded decisions.',
  description_hi:
    'विकल्पों का मूल्यांकन, जोखिमों को तौलना, हितधारकों के प्रभाव पर विचार करना और समय पर, सुविचारित निर्णय लेने की क्षमता मापें।',
  durationSeconds: 5 * 60,
  totalQuestions: 10,
  type: 'Multiple Choice',
  questions: [
    {
      id: 'dm-q1',
      question:
        'When making a time-sensitive decision without all the information you would like, you should:',
      options: [
        'Delay the decision indefinitely until all information is available',
        'Make the best decision possible with available information, document your reasoning, and plan to revisit',
        'Always defer the decision to a senior colleague',
        'Make the decision randomly to avoid overthinking',
      ],
      correctAnswer: 1,
    },
    {
      id: 'dm-q2',
      question:
        'A cost–benefit analysis is most useful when:',
      options: [
        'All costs and benefits can be assigned a monetary value',
        'You need to rank the available options by their quantifiable trade-offs',
        'You want to compare multiple courses of action before committing',
        'All of the above',
      ],
      correctAnswer: 3,
    },
    {
      id: 'dm-q3',
      question:
        'Which cognitive bias causes decision-makers to disproportionately value their first piece of information?',
      options: [
        'Availability bias',
        'Anchoring bias',
        'Hindsight bias',
        'Framing effect',
      ],
      correctAnswer: 1,
    },
    {
      id: 'dm-q4',
      question:
        'A decision with low reversibility and high impact should be treated as:',
      options: [
        'A routine decision that can be made quickly without consultation',
        'A high-stakes decision requiring thorough analysis, stakeholder consultation, and documented approval',
        'Something to be delegated to a junior team member',
        'A decision that can wait until the next quarter review',
      ],
      correctAnswer: 1,
    },
    {
      id: 'dm-q5',
      question:
        'The "sunk cost fallacy" in decision making refers to:',
      options: [
        'Considering past expenditures as a reason to continue a failing course of action',
        'Ignoring future costs when making a decision',
        'Underestimating the cost of a decision',
        'Making decisions based solely on current costs',
      ],
      correctAnswer: 0,
    },
    {
      id: 'dm-q6',
      question:
        'When multiple stakeholders have conflicting interests in a decision, the best approach is to:',
      options: [
        'Choose the option that benefits the most senior stakeholder',
        'Ignore minority stakeholder concerns to reach a decision faster',
        'Map stakeholder interests, identify common ground, and make a transparent, documented decision',
        'Delay the decision until all stakeholders fully agree',
      ],
      correctAnswer: 2,
    },
    {
      id: 'dm-q7',
      question:
        'A risk matrix is a tool used to:',
      options: [
        'Guarantee that all risks are eliminated before proceeding',
        'Visually assess risks by their likelihood and potential impact to prioritise responses',
        'Assign financial values to all project risks',
        'Delegate risk management to the most junior team member',
      ],
      correctAnswer: 1,
    },
    {
      id: 'dm-q8',
      question:
        'Group decision-making can reduce the risk of poor outcomes primarily because:',
      options: [
        'More people means more time is taken, which always improves quality',
        'Diverse perspectives can surface blind spots and challenge faulty assumptions',
        'Groups always reach consensus faster than individuals',
        'It allows one person to avoid accountability for the outcome',
      ],
      correctAnswer: 1,
    },
    {
      id: 'dm-q9',
      question:
        'After a decision leads to an unexpected negative outcome, the appropriate response is to:',
      options: [
        'Conceal the outcome to protect your reputation',
        'Blame the people who implemented the decision',
        'Conduct a post-decision review to learn from the outcome and improve future decisions',
        'Avoid making similar decisions in the future',
      ],
      correctAnswer: 2,
    },
    {
      id: 'dm-q10',
      question:
        'Which decision-making model involves generating multiple alternatives, evaluating them against criteria, and selecting the highest-scoring option?',
      options: [
        'Intuitive decision making',
        'Rational (normative) decision making',
        'Incremental decision making',
        'Garbage-can decision making',
      ],
      correctAnswer: 1,
    },
  ],
};

// ============================================================
// Catalog
// ============================================================

export const ASSESSMENTS: Assessment[] = [
  PROBLEM_SOLVING,
  CRITICAL_THINKING,
  COMMUNICATION,
  DECISION_MAKING,
];

export const ASSESSMENT_MAP: Record<string, Assessment> = Object.fromEntries(
  ASSESSMENTS.map((a) => [a.id, a])
);

/** Returns metadata only (no questions) — safe to send to client for listing. */
export function getAssessmentMetas(): AssessmentMeta[] {
  return ASSESSMENTS.map(({ questions: _questions, ...meta }) => meta);
}

/** Returns a single assessment by ID, or null if not found. */
export function getAssessment(id: string): Assessment | null {
  return ASSESSMENT_MAP[id] ?? null;
}

/** Returns true if the given ID is a dummy/local assessment. */
export function isDummyAssessment(id: string): boolean {
  return id in ASSESSMENT_MAP;
}
