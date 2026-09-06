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
// Assessment 5 — CAPI Operations & Offline Sync (MoSPI Domain)
// ============================================================

const CAPI_OPERATIONS: Assessment = {
  id: 'capi-operations',
  title: 'CAPI Tablet Operations & Sync',
  title_hi: 'कैपी टैबलेट संचालन और सिंक',
  description:
    'Field protocol assessment on Computer Assisted Personal Interviewing, GPS capture, offline storage validation, and data upload compliance.',
  description_hi:
    'कंप्यूटर असिस्टेड पर्सनल इंटरव्यूइंग (CAPI), जीपीएस कैप्चर, ऑफलाइन स्टोरेज सत्यापन और डेटा अपलोड अनुपालन पर क्षेत्रीय प्रोटोकॉल मूल्यांकन।',
  durationSeconds: 10 * 60,
  totalQuestions: 10,
  type: 'MoSPI Domain',
  questions: [
    {
      id: 'capi-q1',
      question:
        'When conducting a CAPI survey in an area with zero cellular connectivity, what is the mandatory protocol for completed interview schedules?',
      options: [
        'Store completed schedules in the local encrypted SQLite DB and trigger sync as soon as network is re-established',
        'Delete schedules and re-conduct interviews when cellular network is restored',
        'Carry physical backup sheets and re-key all data manually',
        'Leave the tablet permanently unlocked until reaching the regional office',
      ],
      correctAnswer: 0,
    },
    {
      id: 'capi-q2',
      question:
        'What is the acceptable GPS geo-tagging accuracy threshold required before saving a household listing point in the CAPI app?',
      options: [
        'Accuracy within ±10 metres with at least 4 satellite locks',
        'Accuracy within ±150 metres',
        'Any coordinate regardless of satellite lock',
        'Manual coordinate typing from a paper map',
      ],
      correctAnswer: 0,
    },
    {
      id: 'capi-q3',
      question:
        'In the CAPI application, what differentiates a "Soft Warning" from a "Hard Error" during roster entry?',
      options: [
        'A Soft Warning allows the investigator to proceed after recording an explanatory remark; a Hard Error completely blocks progression until corrected',
        'A Soft Warning shuts down the tablet',
        'A Hard Error automatically deletes previous answers',
        'Both can be permanently dismissed without supervisor oversight',
      ],
      correctAnswer: 0,
    },
    {
      id: 'capi-q4',
      question:
        'If an enumerator tablet battery drops below 15% during an active household interview, what is the correct protocol?',
      options: [
        'Save the active draft, connect an external certified power bank, and verify the integrity hash before resuming',
        'Rush through the remaining blocks by guessing respondent answers',
        'Continue until the tablet unexpectedly dies',
        'Discard the household interview entirely',
      ],
      correctAnswer: 0,
    },
    {
      id: 'capi-q5',
      question:
        'How should an investigator handle sensitive demographic answers under the Collection of Statistics Act when respondents express fear of data misuse?',
      options: [
        'Explain statutory confidentiality guarantees under the Act and demonstrate that data is encrypted on device',
        'Promise to give a paper copy of other respondents to prove safety',
        'Skip all sensitive questions without noting remarks',
        'Record arbitrary fictitious responses to calm the respondent',
      ],
      correctAnswer: 0,
    },
    {
      id: 'capi-q6',
      question:
        'What hash mechanism is used in the MoSPI CAPI offline sync protocol to detect payload corruption during transmission?',
      options: [
        'Cryptographic checksum (SHA-256) calculated locally and verified by the central ingestion server',
        'Simple character count comparison',
        'Tablet serial number verification only',
        'No verification is performed',
      ],
      correctAnswer: 0,
    },
    {
      id: 'capi-q7',
      question:
        'When listing members in a household roster, how is the "Head of Household" formally defined in NSSO guidelines?',
      options: [
        'A person who is acknowledged as such by the members of the household and bears primary economic/social management responsibility',
        'Strictly the oldest male individual present',
        'The member with the highest bank balance',
        'The member who answers the door first',
      ],
      correctAnswer: 0,
    },
    {
      id: 'capi-q8',
      question:
        'What is the standard procedure when a selected sample household has temporarily migrated for 3 months during the survey round?',
      options: [
        'Record as "Temporarily Absent" if expected within round, or substitute as per substitution guidelines if absent for >6 months',
        'Immediately pick any neighbour without consulting the listing schedule',
        'Fabricate responses based on neighbour hearsay',
        'Leave the schedule incomplete without any status code',
      ],
      correctAnswer: 0,
    },
    {
      id: 'capi-q9',
      question:
        'Before initiating daily field enumeration, what step must an investigator perform in the CAPI dashboard?',
      options: [
        'Verify metadata sync, check assigned FSU/sample list, and inspect battery/storage health',
        'Factory reset the tablet',
        'Uninstall antivirus and security policies',
        'Re-register with a personal Gmail account',
      ],
      correctAnswer: 0,
    },
    {
      id: 'capi-q10',
      question:
        'What should be done if the CAPI tablet app crashes during a multi-member survey module?',
      options: [
        'Reopen the app to trigger auto-recovery from the local transaction log up to the last saved item',
        'Assume all work is lost and start from household 1',
        'Report the tablet damaged and abandon the assignment',
        'Reinstall the application from an unverified APK',
      ],
      correctAnswer: 0,
    },
  ],
};

// ============================================================
// Assessment 6 — Schedule 0.0 & UFS Demarcation (MoSPI Domain)
// ============================================================

const SCHEDULE_0_LISTING: Assessment = {
  id: 'schedule-0-listing',
  title: 'Schedule 0.0 & UFS Demarcation',
  title_hi: 'अनुसूची 0.0 और यूएफएस सीमांकन',
  description:
    'Comprehensive test on Urban Frame Survey (UFS) blocks, hamlet-group formation, household listing, and sampling frame preparation.',
  description_hi:
    'शहरी फ्रेम सर्वेक्षण (UFS) ब्लॉक, हेमलेट-ग्रुप गठन, घरेलू सूचीकरण और नमूनाकरण फ्रेम तैयार करने पर व्यापक परीक्षण।',
  durationSeconds: 10 * 60,
  totalQuestions: 10,
  type: 'MoSPI Domain',
  questions: [
    {
      id: 's0-q1',
      question:
        'What is the primary objective of preparing Schedule 0.0 in an NSS First Stage Unit (FSU)?',
      options: [
        'To list all buildings, census houses, and households within the boundary to build an unbiased frame for second-stage selection',
        'To collect detailed expenditure figures from each family',
        'To record political opinions of village leaders',
        'To issue official ration cards to residents',
      ],
      correctAnswer: 0,
    },
    {
      id: 's0-q2',
      question:
        'Under what condition must an investigator form Hamlet-Groups (hg) or Sub-Blocks (sb) in a large FSU?',
      options: [
        'When the approximate present population of the sample village/block is 1,200 or more',
        'Whenever the investigator feels tired',
        'Only when the village head explicitly demands it',
        'When the village has fewer than 100 residents',
      ],
      correctAnswer: 0,
    },
    {
      id: 's0-q3',
      question:
        'When dividing a large sample village into 4 hamlet-groups, what is the governing principle for creating boundaries?',
      options: [
        'Groups must have roughly equal population and clear, identifiable natural or man-made boundaries',
        'Groups must strictly follow caste lines',
        'Groups must be drawn as random geometrical squares on a map',
        'Groups should only include pucca houses',
      ],
      correctAnswer: 0,
    },
    {
      id: 's0-q4',
      question:
        'How should a vacant non-residential commercial structure (e.g. locked warehouse) be recorded in Schedule 0.0?',
      options: [
        'Assign a census house number, record institutional/non-residential purpose, and note zero resident households',
        'Ignore the building completely from the listing',
        'Invent a fictitious household living inside',
        'Record the owner’s primary residence outside the FSU',
      ],
      correctAnswer: 0,
    },
    {
      id: 's0-q5',
      question:
        'What is the standard path of listing that an investigator must follow in an urban block or rural village?',
      options: [
        'North-West corner to South-East following a continuous serpentine/clockwise sweep',
        'Random zigzag jumping between distant streets',
        'Listing only houses adjacent to main highways',
        'Alphabetical order of household heads',
      ],
      correctAnswer: 0,
    },
    {
      id: 's0-q6',
      question:
        'What defines a "Household" in NSS survey methodology?',
      options: [
        'A group of persons normally living together and taking food from a common kitchen, unless exigencies prevent it',
        'Any group of people who share the same family surname',
        'All people living on the same street',
        'Only legally married couples and their biological children',
      ],
      correctAnswer: 0,
    },
    {
      id: 's0-q7',
      question:
        'What is Second Stage Stratification (SSS) in Schedule 0.0 listing?',
      options: [
        'Classifying listed households into relatively homogeneous socio-economic strata before drawing sample units',
        'Dividing the state into regional districts',
        'Splitting survey forms into separate paper files',
        'A method to eliminate lower-income households from surveys',
      ],
      correctAnswer: 0,
    },
    {
      id: 's0-q8',
      question:
        'If a hamlet-group contains two selected sub-groups, how are samples drawn across them?',
      options: [
        'Using Circular Systematic Sampling with random start independently in each stratum',
        'Arbitrary hand-picking by the field investigator',
        'Selecting the first 8 households on the list',
        'Selecting only households that volunteer',
      ],
      correctAnswer: 0,
    },
    {
      id: 's0-q9',
      question:
        'What should an investigator do if an entire selected hamlet-group is inaccessible due to severe flooding?',
      options: [
        'Document the situation thoroughly, notify the supervisory officer, and follow formal guidelines for inaccessible units',
        'Substitue with an unauthorized neighbouring village',
        'Fill mock data from memory',
        'Close the survey round without submitting any listing schedule',
      ],
      correctAnswer: 0,
    },
    {
      id: 's0-q10',
      question:
        'Why must temporary visitors (staying less than 6 months without intent to reside) be excluded from household listing in Schedule 0.0?',
      options: [
        'To prevent double-counting across their usual place of residence and preserve unbiased population estimates',
        'Because visitors do not consume food',
        'Because visitors lack Aadhaar cards',
        'To minimise paperwork for the enumerator',
      ],
      correctAnswer: 0,
    },
  ],
};

// ============================================================
// Assessment 7 — Periodic Labour Force Survey (MoSPI Domain)
// ============================================================

const PLFS_SURVEY: Assessment = {
  id: 'plfs-survey',
  title: 'Periodic Labour Force Survey (PLFS)',
  title_hi: 'आवधिक श्रम बल सर्वेक्षण (PLFS)',
  description:
    'Detailed assessment of Usual Status (ps+ss), Current Weekly Status (CWS), daily time disposition matrix, and economic activity classification.',
  description_hi:
    'सामान्य स्थिति (ps+ss), वर्तमान साप्ताहिक स्थिति (CWS), दैनिक समय व्यवस्था मैट्रिक्स और आर्थिक गतिविधि वर्गीकरण का विस्तृत मूल्यांकन।',
  durationSeconds: 10 * 60,
  totalQuestions: 10,
  type: 'MoSPI Domain',
  questions: [
    {
      id: 'plfs-q1',
      question:
        'In PLFS, how is the "Principal Activity Status" of an individual determined over the 365-day reference period?',
      options: [
        'By the activity status on which the person spent relatively the major time (majority criterion) during the 365 days',
        'By the activity in which the person earned the maximum income',
        'By whatever the person was doing on the day of survey',
        'By the highest educational degree attained',
      ],
      correctAnswer: 0,
    },
    {
      id: 'plfs-q2',
      question:
        'What minimum duration of economic engagement during the 365-day reference period qualifies a person for "Subsidiary Economic Activity Status"?',
      options: [
        'Engaged for at least 30 days during the reference year',
        'Engaged for at least 183 days',
        'Engaged for at least 1 full year',
        'Engaged for 1 single hour',
      ],
      correctAnswer: 0,
    },
    {
      id: 'plfs-q3',
      question:
        'Under Current Weekly Status (CWS), what is the threshold for a person to be considered "Employed" during the 7-day reference week?',
      options: [
        'Worked for at least 1 hour on any 1 day during the 7 days preceding the survey date',
        'Worked for at least 40 hours during the week',
        'Earned at least minimum wage during the week',
        'Worked continuously for all 7 days',
      ],
      correctAnswer: 0,
    },
    {
      id: 'plfs-q4',
      question:
        'In the Daily Time Disposition matrix of PLFS, what intensity score is recorded for an activity pursued for 2.5 hours on a given day?',
      options: [
        'Half day (intensity 0.5)',
        'Full day (intensity 1.0)',
        'Zero intensity',
        'Quarter day (intensity 0.25)',
      ],
      correctAnswer: 0,
    },
    {
      id: 'plfs-q5',
      question:
        'How does PLFS classify an unpaid family member assisting in a household enterprise without regular wages?',
      options: [
        'Helper in household enterprise (Status code 21) within the self-employed category',
        'Unemployed person seeking work (Status code 81)',
        'Casual labour in non-agriculture (Status code 51)',
        'Out of labour force (Status code 92)',
      ],
      correctAnswer: 0,
    },
    {
      id: 'plfs-q6',
      question:
        'Which industry classification standard is currently used in PLFS to record 5-digit economic activity codes?',
      options: [
        'National Industrial Classification (NIC-2008)',
        'Standard Industrial Classification (SIC-1987)',
        'Harmonized System (HS-2022)',
        'COICOP classification',
      ],
      correctAnswer: 0,
    },
    {
      id: 'plfs-q7',
      question:
        'In PLFS scrutiny, what cross-validation error occurs if an individual has Activity Status 11 (Own Account Worker) but their employer status indicates a government department?',
      options: [
        'Inconsistency flag: Own-account workers cannot have government or public sector employer type',
        'Valid combination with no warning',
        'Automatic upgrade to regular wage worker without verification',
        'Ignored by validation software',
      ],
      correctAnswer: 0,
    },
    {
      id: 'plfs-q8',
      question:
        'What constitutes the "Labour Force" in national statistical reporting?',
      options: [
        'Persons who are either employed (working or having work but not working) or unemployed (seeking or available for work)',
        'All citizens aged 18 to 60 regardless of student or retiree status',
        'Only formally registered taxpayers',
        'Only workers with written contracts',
      ],
      correctAnswer: 0,
    },
    {
      id: 'plfs-q9',
      question:
        'If a student spent 8 months studying and 4 months working in agricultural harvesting during the year, what is their Usual Status (ps+ss)?',
      options: [
        'Principal status: Student (out of labour force); Subsidiary status: Agricultural worker (employed)',
        'Principal status: Unemployed; Subsidiary status: Student',
        'Principal status: Agricultural worker; Subsidiary status: None',
        'Not classified',
      ],
      correctAnswer: 0,
    },
    {
      id: 'plfs-q10',
      question:
        'What is the rotational panel scheme used in PLFS for urban sampling units?',
      options: [
        '2-8-2 rotational panel where an urban FSU is visited 4 times over 4 consecutive quarters',
        'A single one-time visit with no revisits',
        'Revisiting the same household every month for 10 years',
        'Random replacement without panel tracking',
      ],
      correctAnswer: 0,
    },
  ],
};

// ============================================================
// Assessment 8 — Statistical Scrutiny & Validation (SSS Cadre)
// ============================================================

const DATA_SCRUTINY: Assessment = {
  id: 'data-scrutiny',
  title: 'Statistical Scrutiny & Validation',
  title_hi: 'सांख्यिकीय संवीक्षा और सत्यापन',
  description:
    'Desk scrutiny procedures, inter-schedule consistency checks, outlier flags, and National Accounts aggregation principles for SSS Cadre.',
  description_hi:
    'एसएसएस संवर्ग के लिए डेस्क संवीक्षा प्रक्रियाएं, अंतर-अनुसूची संगति जांच, आउटलायर फ्लैग और राष्ट्रीय लेखा एकत्रीकरण सिद्धांत।',
  durationSeconds: 10 * 60,
  totalQuestions: 10,
  type: 'MoSPI Domain',
  questions: [
    {
      id: 'scrutiny-q1',
      question:
        'What is the fundamental purpose of "Desk Scrutiny" performed by Junior Statistical Officers (JSO)?',
      options: [
        'To detect recording inconsistencies, out-of-range values, and conceptual errors before raw microdata is accepted into the estimation pipeline',
        'To eliminate low-income records to artificially boost economic averages',
        'To rewrite field schedules without investigator consultation',
        'To approve all records automatically without inspection',
      ],
      correctAnswer: 0,
    },
    {
      id: 'scrutiny-q2',
      question:
        'In an Annual Survey of Industries (ASI) return, Gross Sale Value of products is recorded as less than Net Sale Value. What scrutiny action is required?',
      options: [
        'Flag as critical error: Gross value must equal or exceed Net value (Net = Gross minus taxes, rebates, and freight)',
        'Approve the return as an acceptable negative rebate',
        'Delete the tax block entirely',
        'Divide both figures by two',
      ],
      correctAnswer: 0,
    },
    {
      id: 'scrutiny-q3',
      question:
        'When cross-scrutinizing household consumption expenditure with reported household monthly income, what constitutes a severe warning flag?',
      options: [
        'Reported monthly food expenditure exceeds total household monthly income by a factor of 4 with zero reported loans, dissavings, or transfers',
        'Expenditure exactly matches income',
        'Household saves 10% of monthly income',
        'Food expenditure is 30% of total expenditure',
      ],
      correctAnswer: 0,
    },
    {
      id: 'scrutiny-q4',
      question:
        'What is the difference between "Sampling Error" and "Non-Sampling Error" in large-scale sample surveys?',
      options: [
        'Sampling error arises from observing a subset instead of the full census; non-sampling error arises from measurement, coverage, reporting, or processing flaws',
        'Sampling errors only happen in cities, non-sampling errors in villages',
        'Non-sampling errors decrease automatically with larger sample sizes',
        'There is no mathematical distinction between them',
      ],
      correctAnswer: 0,
    },
    {
      id: 'scrutiny-q5',
      question:
        'When an extreme outlier is detected in enterprise turnover data (e.g. 100x sector median), what is the correct professional methodology?',
      options: [
        'Trace back the scrutiny slip to the field unit for verified audited financial statements or clarification notes before applying any statistical adjustment',
        'Instantly delete the enterprise from the survey frame',
        'Replace the value with the state median without documenting the modification',
        'Ignore the return and don’t report it to the officer-in-charge',
      ],
      correctAnswer: 0,
    },
    {
      id: 'scrutiny-q6',
      question:
        'In the Consumer Price Index (CPI) price collection scrutiny, how is a sudden 50% price spike in seasonal vegetables evaluated across base and current quotes?',
      options: [
        'Check nearby centre price trends and state market arrivals to confirm genuine market movement versus transcription error',
        'Force the price quote to equal the base year index',
        'Discard all quotations from that district',
        'Change the unit of measurement without verification',
      ],
      correctAnswer: 0,
    },
    {
      id: 'scrutiny-q7',
      question:
        'What principle governs the "Hot-Deck Imputation" technique used in statistical data cleaning?',
      options: [
        'Replacing missing values with observed responses from a randomly selected "donor" unit with matching demographic/economic characteristics',
        'Setting all missing values to zero',
        'Replacing missing values with the national overall mean',
        'Deleting the entire questionnaire from analysis',
      ],
      correctAnswer: 0,
    },
    {
      id: 'scrutiny-q8',
      question:
        'Under National Accounts Statistics (NAS), what constitutes "Gross Fixed Capital Formation" (GFCF)?',
      options: [
        'Net additions to fixed assets (machinery, equipment, infrastructure, dwellings) during the accounting period',
        'Only purchases of stock market shares by households',
        'Total government expenditure on salaries and pensions',
        'Total imports minus total exports',
      ],
      correctAnswer: 0,
    },
    {
      id: 'scrutiny-q9',
      question:
        'What is an "Item Non-Response" versus a "Unit Non-Response" in NSS surveys?',
      options: [
        'Item non-response is when a responding household leaves specific questions blank; unit non-response is when the household cannot be surveyed at all (locked/refused)',
        'They are synonymous terms for data corruption',
        'Unit non-response applies only to factories in ASI',
        'Item non-response means the entire schedule was lost in transit',
      ],
      correctAnswer: 0,
    },
    {
      id: 'scrutiny-q10',
      question:
        'What does an Official Scrutiny Sheet accompany when transmitting validated survey batches to the National Data Center?',
      options: [
        'A formal log of all corrections, supervisor signatures, FSU sample allocation weights, and validation rule pass certificates',
        'A marketing brochure for public release',
        'Raw unvalidated paper notes without timestamps',
        'Only an invoice for travel reimbursements',
      ],
      correctAnswer: 0,
    },
  ],
};

// ============================================================
// Catalog
// ============================================================

export const ASSESSMENTS: Assessment[] = [
  CAPI_OPERATIONS,
  SCHEDULE_0_LISTING,
  PLFS_SURVEY,
  DATA_SCRUTINY,
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
  return ASSESSMENTS.map((a) => {
    const { questions: _, ...meta } = a;
    void _;
    return meta;
  });
}

/** Returns a single assessment by ID, or null if not found. */
export function getAssessment(id: string): Assessment | null {
  return ASSESSMENT_MAP[id] ?? null;
}

/** Returns true if the given ID is a dummy/local assessment. */
export function isDummyAssessment(id: string): boolean {
  return id in ASSESSMENT_MAP;
}
