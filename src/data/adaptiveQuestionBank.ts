/**
 * src/data/adaptiveQuestionBank.ts
 *
 * Authentic MoSPI & NSSTA Adaptive Assessment Question Bank.
 * Designed for the 3-Stage Adaptive Branching State Machine (§4.3 & §9.4.4 of PRD).
 *
 * Stage 1: Medium difficulty calibration
 * Stage 2A: Hard difficulty (L5 track)
 * Stage 2B: Easy difficulty (L1 track)
 * Stage 3: Level-converging difficulty based on branch path:
 *   - 'L5': L4 vs L5 boundary question
 *   - 'L3_L4': L3 vs L4 boundary question
 *   - 'L2_L3': L2 vs L3 boundary question
 *   - 'L1': L1 confirmation question
 */

import { type AssessmentStage, type BranchPath } from '@/services/assessmentService';

export interface AdaptiveQuestion {
  id: string;
  competencyId: string;
  question_text: string;
  question_text_hi: string;
  answer_choices: string[];
  answer_choices_hi: string[];
  correctAnswerIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  stage: AssessmentStage;
  targetBranch?: BranchPath;
  citation: string;
  rationale: string;
  rationale_hi: string;
}

export const ADAPTIVE_QUESTIONS: Record<string, Record<string, AdaptiveQuestion>> = {
  // ==========================================================================
  // comp-capi: CAPI Tablet Operations & Sync Protocols
  // ==========================================================================
  'comp-capi': {
    // Stage 1: Calibration (Medium)
    STAGE_1: {
      id: 'capi-s1',
      competencyId: 'comp-capi',
      stage: 'STAGE_1',
      difficulty: 'medium',
      question_text: 'When collecting household data in CAPI, what is the mandatory protocol before marking a household as temporarily absent?',
      question_text_hi: 'कैपी (CAPI) में घरेलू डेटा एकत्र करते समय, किसी परिवार को अस्थायी रूप से अनुपस्थित चिह्नित करने से पहले अनिवार्य प्रोटोकॉल क्या है?',
      answer_choices: [
        'Immediately delete the household from the active cluster and proceed to the next unit',
        'Attempt at least 3 repeat visits at different times and record revisit timestamps in the roster',
        'Replace the household with an adjacent family without supervisor confirmation',
        'Mark as casualty code 9 on the first visit to keep the cluster schedule moving',
      ],
      answer_choices_hi: [
        'सक्रिय क्लस्टर से परिवार को तुरंत हटा दें और अगली इकाई पर आगे बढ़ें',
        'अलग-अलग समय पर कम से कम 3 बार जाने का प्रयास करें और रोस्टर में दोबारा जाने का समय दर्ज करें',
        'पर्यवेक्षक की पुष्टि के बिना परिवार को निकटवर्ती परिवार से बदलें',
        'क्लस्टर शेड्यूल को चालू रखने के लिए पहली यात्रा पर ही कैजुअल्टी कोड 9 के रूप में चिह्नित करें',
      ],
      correctAnswerIndex: 1,
      citation: 'CAPI Operational Guidelines 2024, Chapter 3: Field Protocol Handling',
      rationale: 'MoSPI CAPI protocols strictly require 3 attempts at varied hours before classifying a unit as non-response.',
      rationale_hi: 'सांख्यिकी मंत्रालय के कैपी प्रोटोकॉल किसी इकाई को गैर-प्रतिक्रिया के रूप में वर्गीकृत करने से पहले विभिन्न समयों पर 3 प्रयासों की मांग करते हैं।',
    },

    // Stage 2A: High performer branch (Hard)
    STAGE_2A: {
      id: 'capi-s2a',
      competencyId: 'comp-capi',
      stage: 'STAGE_2A',
      difficulty: 'hard',
      question_text: 'During a cluster survey in a remote offline zone, CAPI throws error "Checksum Inconsistency on Table 4B: Household Assets". What is the correct protocol?',
      question_text_hi: 'एक दूरस्थ ऑफ़लाइन क्षेत्र में क्लस्टर सर्वेक्षण के दौरान, कैपी "तालिका 4बी: घरेलू संपत्ति पर चेकसम विसंगति" त्रुटि दिखाता है। सही प्रोटोकॉल क्या है?',
      answer_choices: [
        'Manually overwrite checksum registers using root file explorer permissions',
        'Factory reset the Android tablet and restart the entire village listing from scratch',
        'Run internal schedule SQLite validation diagnostics and export encrypted anomaly log without clearing cache',
        'Ignore the alert and force synchronization using mobile hotspot',
      ],
      answer_choices_hi: [
        'रूट फ़ाइल एक्सप्लोरर अनुमतियों का उपयोग करके चेकसम रजिस्टरों को मैन्युअल रूप से अधिलेखित करें',
        'एंड्रॉइड टैबलेट को फ़ैक्टरी रीसेट करें और पूरे गाँव की सूची को नए सिरे से शुरू करें',
        'आंतरिक शेड्यूल SQLite सत्यापन निदान चलाएं और कैश को साफ़ किए बिना एन्क्रिप्टेड विसंगति लॉग निर्यात करें',
        'चेतावनी पर ध्यान न दें और मोबाइल हॉटस्पॉट का उपयोग करके जबरन सिंक्रनाइज़ेशन करें',
      ],
      correctAnswerIndex: 2,
      citation: 'MoSPI CAPI Technical Manual Vol II, Section 7: SQLite DB Integrity',
      rationale: 'Preserving raw interview payload integrity via localized diagnostic logging is required to prevent survey data corruption.',
      rationale_hi: 'सर्वेक्षण डेटा भ्रष्टाचार को रोकने के लिए स्थानीयकृत डायग्नोस्टिक लॉगिंग के माध्यम से कच्चे साक्षात्कार पेलोड अखंडता को संरक्षित करना अनिवार्य है।',
    },

    // Stage 2B: Lower performer branch (Easy)
    STAGE_2B: {
      id: 'capi-s2b',
      competencyId: 'comp-capi',
      stage: 'STAGE_2B',
      difficulty: 'easy',
      question_text: 'How frequently should an enumerator synchronize collected CAPI schedules with the regional NSSO FOD server?',
      question_text_hi: 'एक प्रगणक को एकत्र किए गए कैपी शेड्यूल को क्षेत्रीय एनएसएसओ एफओडी सर्वर के साथ कितनी बार सिंक्रनाइज़ करना चाहिए?',
      answer_choices: [
        'Daily upon completing field canvassing or as soon as network connectivity is re-established',
        'Only once at the very end of the 3-month survey quarter',
        'Whenever the tablet battery drops below 10 percent',
        'Only when physically visiting the regional headquarters in person',
      ],
      answer_choices_hi: [
        'फील्ड सर्वेक्षण पूरा करने पर प्रतिदिन या जैसे ही नेटवर्क कनेक्टिविटी पुनः स्थापित हो',
        '3 महीने की सर्वेक्षण तिमाही के अंत में केवल एक बार',
        'जब भी टैबलेट की बैटरी 10 प्रतिशत से कम हो जाए',
        'केवल तभी जब व्यक्तिगत रूप से क्षेत्रीय मुख्यालय का दौरा किया जाए',
      ],
      correctAnswerIndex: 0,
      citation: 'Field Investigator Handbook, Section 1.4: Daily Sync SOP',
      rationale: 'Daily sync ensures real-time supervisor scrutiny and minimizes data loss risks in the field.',
      rationale_hi: 'दैनिक सिंक वास्तविक समय पर्यवेक्षक जांच सुनिश्चित करता है और क्षेत्र में डेटा हानि के जोखिम को कम करता है।',
    },

    // Stage 3: Level Convergence Questions
    STAGE_3_L5: {
      id: 'capi-s3-l5',
      competencyId: 'comp-capi',
      stage: 'STAGE_3',
      targetBranch: 'L5',
      difficulty: 'hard',
      question_text: 'Which cryptographic algorithm and key exchange protocol is used by the MoSPI CAPI engine to sign and seal completed survey batches before cloud transit?',
      question_text_hi: 'क्लाउड ट्रांजिट से पहले पूर्ण सर्वेक्षण बैचों पर हस्ताक्षर और सील करने के लिए सांख्यिकी मंत्रालय के कैपी इंजन द्वारा किस क्रिप्टोग्राफ़िक एल्गोरिदम का उपयोग किया जाता है?',
      answer_choices: [
        'MD5 hash checksums without cryptographic salts',
        'Plain Base64 encoding over unencrypted HTTP socket',
        'Single DES without initialization vectors',
        'AES-256 GCM authenticated encryption with asymmetric RSA-2048 public key transmission',
      ],
      answer_choices_hi: [
        'क्रिप्टोग्राफिक लवण के बिना MD5 हैश चेकसम',
        'अनएन्क्रिप्टेड HTTP सॉकेट पर सादा बेस64 एन्कोडिंग',
        'आरंभीकरण वैक्टर के बिना एकल डीईएस',
        'असममित RSA-2048 सार्वजनिक कुंजी प्रसारण के साथ AES-256 GCM प्रमाणित एन्क्रिप्शन',
      ],
      correctAnswerIndex: 3,
      citation: 'National Statistical Commission Security Framework 2024, Cyber Safety Para 4.1',
      rationale: 'MoSPI mandates AES-256 GCM with RSA public key infrastructure for sovereign statistical confidentiality.',
      rationale_hi: 'सांख्यिकी मंत्रालय संप्रभु सांख्यिकीय गोपनीयता के लिए RSA सार्वजनिक कुंजी अवसंरचना के साथ AES-256 GCM को अनिवार्य करता है।',
    },

    STAGE_3_L3_L4: {
      id: 'capi-s3-l3l4',
      competencyId: 'comp-capi',
      stage: 'STAGE_3',
      targetBranch: 'L3_L4',
      difficulty: 'medium',
      question_text: 'When GPS accuracy on the CAPI tablet is weaker than 25 meters during boundary marking, what should the Field Investigator do?',
      question_text_hi: 'सीमा अंकन के दौरान जब कैपी टैबलेट पर जीपीएस सटीकता 25 मीटर से कमजोर हो, तो फील्ड अन्वेषक को क्या करना चाहिए?',
      answer_choices: [
        'Turn off GPS and enter arbitrary longitude and latitude coordinates manually',
        'Move to an open area, wait for satellite fix (< 10m accuracy), and record benchmark physical landmarks',
        'Abort the survey and report the entire First Stage Unit as uninhabited',
        'Change tablet timezone to force false satellite convergence',
      ],
      answer_choices_hi: [
        'जीपीएस बंद करें और मनमाने देशांतर और अक्षांश निर्देशांक दर्ज करें',
        'खुले क्षेत्र में जाएं, उपग्रह फिक्स (<10 मीटर सटीकता) की प्रतीक्षा करें, और भौतिक सीमा चिह्नों को दर्ज करें',
        'सर्वेक्षण रद्द करें और संपूर्ण प्राथमिक चरण इकाई को निर्जन रिपोर्ट करें',
        'झूठे उपग्रह अभिसरण को बाध्य करने के लिए टैबलेट समय क्षेत्र बदलें',
      ],
      correctAnswerIndex: 1,
      citation: 'MoSPI CAPI Tablet Geofencing Manual, Para 2.9',
      rationale: 'GPS satellite fixes must reach under 10m accuracy to prevent CEB boundary misclassification.',
      rationale_hi: 'सीईबी सीमा के गलत वर्गीकरण को रोकने के लिए जीपीएस उपग्रह फिक्स 10 मीटर से कम सटीकता तक पहुंचना चाहिए।',
    },

    STAGE_3_L2_L3: {
      id: 'capi-s3-l2l3',
      competencyId: 'comp-capi',
      stage: 'STAGE_3',
      targetBranch: 'L2_L3',
      difficulty: 'medium',
      question_text: 'If a respondent refuses to answer question 14 on household financial assets, what does CAPI protocol prescribe?',
      question_text_hi: 'यदि कोई उत्तरदाता घरेलू वित्तीय संपत्तियों पर प्रश्न 14 का उत्तर देने से इंकार करता है, तो कैपी प्रोटोकॉल क्या निर्धारित करता है?',
      answer_choices: [
        'Terminate the entire schedule immediately and leave the village',
        'Make a rough guess based on house appearance and enter a fabricated number',
        'Select official Refusal Code 98, record reasons in remarks, and never fabricate income estimates',
        'Threaten the respondent with legal prosecution under municipal bylaws',
      ],
      answer_choices_hi: [
        'शेड्यूल को तुरंत समाप्त करें और गाँव छोड़ दें',
        'घर की बनावट के आधार पर अनुमान लगाएं और मनगढ़ंत संख्या दर्ज करें',
        'आधिकारिक इनकार कोड 98 चुनें, टिप्पणियों में कारण दर्ज करें, और कभी भी अनुमानित आय न बनाएं',
        'उत्तरदाता को नगरपालिका उपनियमों के तहत कानूनी अभियोजन की धमकी दें',
      ],
      correctAnswerIndex: 2,
      citation: 'Instructions to Field Staff Vol. I, Section 2.8',
      rationale: 'Data integrity is preserved by recording authentic refusal codes rather than entering false estimates.',
      rationale_hi: 'गलत अनुमान दर्ज करने के बजाय प्रामाणिक इनकार कोड दर्ज करके डेटा अखंडता को संरक्षित किया जाता है।',
    },

    STAGE_3_L1: {
      id: 'capi-s3-l1',
      competencyId: 'comp-capi',
      stage: 'STAGE_3',
      targetBranch: 'L1',
      difficulty: 'easy',
      question_text: 'What should an enumerator check before embarking on morning field survey rounds with the CAPI tablet?',
      question_text_hi: 'कैपी टैबलेट के साथ सुबह के फील्ड सर्वेक्षण दौर पर निकलने से पहले एक प्रगणक को क्या जांचना चाहिए?',
      answer_choices: [
        'Verify that Bluetooth is connected to personal entertainment speakers',
        'Check whether third-party social media apps are updated to latest versions',
        'Delete all previous week survey schedules to free up internal storage',
        'Ensure full battery charge, power bank availability, and pre-cached offline survey schedule allocation',
      ],
      answer_choices_hi: [
        'सत्यापित करें कि ब्लूटूथ व्यक्तिगत मनोरंजन स्पीकर से जुड़ा है',
        'जांचें कि क्या तृतीय-पक्ष सोशल मीडिया ऐप्स नवीनतम संस्करणों में अपडेट हैं',
        'आंतरिक संग्रहण खाली करने के लिए पिछले सप्ताह के सभी सर्वेक्षण शेड्यूल हटाएं',
        'पूर्ण बैटरी चार्ज, पावर बैंक की उपलब्धता और पूर्व-कैश्ड ऑफ़लाइन सर्वेक्षण आवंटन सुनिश्चित करें',
      ],
      correctAnswerIndex: 3,
      citation: 'Field Staff SOP 2024, Checklist Item 1',
      rationale: 'Field readiness requires charged hardware, backup power, and downloaded offline clusters.',
      rationale_hi: 'फील्ड तत्परता के लिए चार्ज किए गए हार्डवेयर, बैकअप पावर और डाउनलोड किए गए ऑफ़लाइन क्लस्टर की आवश्यकता होती है।',
    },
  },

  // ==========================================================================
  // comp-demarcation: Census Boundary Demarcation & Schedule 0.0 Listing
  // ==========================================================================
  'comp-demarcation': {
    STAGE_1: {
      id: 'dem-s1',
      competencyId: 'comp-demarcation',
      stage: 'STAGE_1',
      difficulty: 'medium',
      question_text: 'In NSS multi-stage stratified sampling, under what condition is hamlet-group (hg) formation mandatory in a rural First Stage Unit (FSU)?',
      question_text_hi: 'एनएसएस बहु-स्तरीय स्तरीकृत प्रतिचयन में, ग्रामीण प्राथमिक चरण इकाई (FSU) में हेमलेट-समूह (hg) गठन किस स्थिति में अनिवार्य है?',
      answer_choices: [
        'Only when instructed by the district magistrate in writing',
        'Whenever the village has more than 2 primary schools',
        'When the approximate present population of the selected FSU is 1,200 or more',
        'Hamlet-group formation is never permitted in rural sectors',
      ],
      answer_choices_hi: [
        'केवल तभी जब जिला मजिस्ट्रेट द्वारा लिखित निर्देश दिया जाए',
        'जब भी गाँव में 2 से अधिक प्राथमिक विद्यालय हों',
        'जब चयनित एफएसयू की अनुमानित वर्तमान जनसंख्या 1,200 या उससे अधिक हो',
        'ग्रामीण क्षेत्रों में हेमलेट-समूह गठन की कभी अनुमति नहीं है',
      ],
      correctAnswerIndex: 2,
      citation: 'NSS Field Staff Instructions Vol. I, Chapter 3: Schedule 0.0, Para 3.3',
      rationale: 'Hamlet-group formation is mandatory when FSU population reaches 1,200 to maintain equal selection probabilities across sub-units.',
      rationale_hi: 'उप-इकाइयों में समान चयन संभावना बनाए रखने के लिए जब एफएसयू की जनसंख्या 1,200 तक पहुंच जाती है तो हेमलेट-समूह गठन अनिवार्य है।',
    },

    STAGE_2A: {
      id: 'dem-s2a',
      competencyId: 'comp-demarcation',
      stage: 'STAGE_2A',
      difficulty: 'hard',
      question_text: 'If a selected FSU has a population of 2,800, how many hamlet-groups (hg) must be formed according to Schedule 0.0 standards?',
      question_text_hi: 'यदि किसी चयनित एफएसयू की जनसंख्या 2,800 है, तो अनुसूची 0.0 मानकों के अनुसार कितने हेमलेट-समूह (hg) बनाए जाने चाहिए?',
      answer_choices: [
        '4 hamlet-groups with roughly equal population sizes (approx 700 each)',
        '2 hamlet-groups divided strictly by agricultural land boundaries',
        '6 hamlet-groups arranged in circular concentric rings',
        'No division is required if the village is under a single Gram Panchayat',
      ],
      answer_choices_hi: [
        'लगभग समान जनसंख्या आकार वाले 4 हेमलेट-समूह (प्रत्येक लगभग 700)',
        'कृषि भूमि सीमाओं द्वारा सख्ती से विभाजित 2 हेमलेट-समूह',
        'गोलाकार संकेंद्रित वलयों में व्यवस्थित 6 हेमलेट-समूह',
        'यदि गाँव एक ही ग्राम पंचायत के अधीन है तो किसी विभाजन की आवश्यकता नहीं है',
      ],
      correctAnswerIndex: 0,
      citation: 'Schedule 0.0 Formulation Guide, Table 3.1: HG Formation Tiers',
      rationale: 'For population 2,400 to 2,999, MoSPI Schedule 0.0 mandates exactly 4 hamlet-groups of approximately equal size.',
      rationale_hi: '2,400 से 2,999 की जनसंख्या के लिए, सांख्यिकी मंत्रालय की अनुसूची 0.0 लगभग समान आकार के ठीक 4 हेमलेट-समूह अनिवार्य करती है।',
    },

    STAGE_2B: {
      id: 'dem-s2b',
      competencyId: 'comp-demarcation',
      stage: 'STAGE_2B',
      difficulty: 'easy',
      question_text: 'What constitutes a "Household" (HH) definition in MoSPI survey listing guidelines?',
      question_text_hi: 'सांख्यिकी मंत्रालय के सर्वेक्षण सूचीकरण दिशानिर्देशों में "परिवार" (HH) की परिभाषा क्या है?',
      answer_choices: [
        'A physical residential structure regardless of who resides inside',
        'All individuals who own property in the same village irrespective of where they eat',
        'Any registered voters belonging to the same political constituency',
        'A group of persons normally living together and taking food from a common kitchen',
      ],
      answer_choices_hi: [
        'एक भौतिक आवासीय संरचना भले ही अंदर कौन रहता हो',
        'वे सभी व्यक्ति जो एक ही गाँव में संपत्ति के मालिक हैं, भले ही वे कहीं भी भोजन करते हों',
        'एक ही राजनीतिक क्षेत्र से संबंधित कोई भी पंजीकृत मतदाता',
        'सामान्यतः एक साथ रहने वाले और एक ही रसोई से भोजन करने वाले व्यक्तियों का समूह',
      ],
      correctAnswerIndex: 3,
      citation: 'Concepts and Definitions Manual, Chapter 1, Para 1.8',
      rationale: 'The universal statistical definition of a household requires common living and common kitchen sharing.',
      rationale_hi: 'परिवार की सार्वभौमिक सांख्यिकीय परिभाषा के लिए सामान्य निवास और साझा रसोई आवश्यक है।',
    },

    STAGE_3_L5: {
      id: 'dem-s3-l5',
      competencyId: 'comp-demarcation',
      stage: 'STAGE_3',
      targetBranch: 'L5',
      difficulty: 'hard',
      question_text: 'When listing institutional households (hostels, ashrams, barracks), how are individual units sampled under Schedule 0.0?',
      question_text_hi: 'संस्थागत परिवारों (छात्रावासों, आश्रमों, बैरकों) की सूची बनाते समय, अनुसूची 0.0 के तहत व्यक्तिगत इकाइयों का नमूना कैसे लिया जाता है?',
      answer_choices: [
        'The entire institutional structure is counted as exactly one single composite household',
        'Each independent mess/room group living together is listed as an independent single-member or multi-member household',
        'All institutional inmates are completely excluded from the survey frame',
        'Institutional households are replaced with arbitrary agricultural farmhouses',
      ],
      answer_choices_hi: [
        'संपूर्ण संस्थागत संरचना को ठीक एक एकल समग्र परिवार माना जाता है',
        'एक साथ रहने वाले प्रत्येक स्वतंत्र मेस/कमरे के समूह को एक स्वतंत्र परिवार के रूप में सूचीबद्ध किया जाता है',
        'सर्वेक्षण फ्रेम से सभी संस्थागत कैदियों/छात्रों को पूरी तरह से बाहर रखा गया है',
        'संस्थागत परिवारों को मनमाने कृषि फार्महाउसों से बदल दिया जाता है',
      ],
      correctAnswerIndex: 1,
      citation: 'Instructions to Field Staff Vol. I, Para 3.19: Institutional HHs',
      rationale: 'Inmates taking food from independent arrangements form distinct households for sampling frame accuracy.',
      rationale_hi: 'स्वतंत्र व्यवस्था से भोजन लेने वाले अंतःवासी नमूनाकरण फ्रेम सटीकता के लिए अलग-अलग परिवार बनाते हैं।',
    },

    STAGE_3_L3_L4: {
      id: 'dem-s3-l3l4',
      competencyId: 'comp-demarcation',
      stage: 'STAGE_3',
      targetBranch: 'L3_L4',
      difficulty: 'medium',
      question_text: 'During Schedule 0.0 canvassing, what is the protocol if a household has an affluent enterprise operating from the same residential premise?',
      question_text_hi: 'अनुसूची 0.0 सर्वेक्षण के दौरान, यदि किसी परिवार के उसी आवासीय परिसर से एक समृद्ध उद्यम संचालित हो रहा है, तो क्या प्रोटोकॉल है?',
      answer_choices: [
        'List the household and enterprise in respective second stage strata (SSS) according to affluence criteria',
        'Ignore the enterprise and only record domestic kitchen expenditure',
        'Double count the household as two separate unrelated families',
        'Exclude the premise as non-residential commercial territory',
      ],
      answer_choices_hi: [
        'समृद्धि मानदंडों के अनुसार संबंधित द्वितीय चरण संस्तर (SSS) में परिवार और उद्यम को सूचीबद्ध करें',
        'उद्यम की अनदेखी करें और केवल घरेलू रसोई व्यय दर्ज करें',
        'परिवार को दो अलग-अलग असंबंधित परिवारों के रूप में दो बार गिनें',
        'परिसर को गैर-आवासीय वाणिज्यिक क्षेत्र के रूप में बाहर रखें',
      ],
      correctAnswerIndex: 0,
      citation: 'Schedule 0.0 Field Listing Manual, Para 3.12',
      rationale: 'Dual domestic-enterprise units must be stratified into designated SSS categories to prevent sampling bias.',
      rationale_hi: 'नमूनाकरण पूर्वाग्रह को रोकने के लिए दोहरे घरेलू-उद्यम इकाइयों को निर्दिष्ट एसएसएस श्रेणियों में स्तरीकृत किया जाना चाहिए।',
    },

    STAGE_3_L2_L3: {
      id: 'dem-s3-l2l3',
      competencyId: 'comp-demarcation',
      stage: 'STAGE_3',
      targetBranch: 'L2_L3',
      difficulty: 'medium',
      question_text: 'What is the required order of canvassing households within a selected Census Enumeration Block?',
      question_text_hi: 'एक चयनित जनगणना प्रगणना ब्लॉक के भीतर परिवारों के सर्वेक्षण का आवश्यक क्रम क्या है?',
      answer_choices: [
        'Alphabetical order of household heads from voter list',
        'Random order based on who is available at home in the afternoon',
        'Descending order of household wealth and land ownership',
        'Continuous serpentine order starting from the north-west corner of the block boundary',
      ],
      answer_choices_hi: [
        'मतदाता सूची से परिवार के मुखियाओं का वर्णमाला क्रम',
        'दोपहर में घर पर कौन उपलब्ध है, इसके आधार पर यादृच्छिक क्रम',
        'घरेलू संपत्ति और भूमि स्वामित्व का घटता क्रम',
        'ब्लॉक सीमा के उत्तर-पश्चिम कोने से शुरू होकर निरंतर सर्पाकार (सर्पेन्टाइन) क्रम',
      ],
      correctAnswerIndex: 3,
      citation: 'NSS Listing Manual, Para 2.4: Serpentine Canvassing',
      rationale: 'Serpentine ordering ensures geographic continuity and prevents omission of interior households.',
      rationale_hi: 'सर्पेन्टाइन क्रम भौगोलिक निरंतरता सुनिश्चित करता है और आंतरिक परिवारों के छूट जाने से रोकता है।',
    },

    STAGE_3_L1: {
      id: 'dem-s3-l1',
      competencyId: 'comp-demarcation',
      stage: 'STAGE_3',
      targetBranch: 'L1',
      difficulty: 'easy',
      question_text: 'What document does the Field Investigator use to identify the physical boundaries of an urban census enumeration block?',
      question_text_hi: 'एक शहरी जनगणना प्रगणना ब्लॉक की भौतिक सीमाओं की पहचान करने के लिए फील्ड अन्वेषक किस दस्तावेज का उपयोग करता है?',
      answer_choices: [
        'A generic commercial road navigation smartphone app without census boundaries',
        'Urban Frame Survey (UFS) block map with landmark descriptions and boundary roads',
        'Personal memory of local residents without verifying map landmarks',
        'Post office pincode directory without layout drawings',
      ],
      answer_choices_hi: [
        'जनगणना सीमाओं के बिना एक सामान्य वाणिज्यिक सड़क नेविगेशन स्मार्टफोन ऐप',
        'लैंडमार्क विवरण और सीमा सड़कों के साथ शहरी फ्रेम सर्वेक्षण (UFS) ब्लॉक मानचित्र',
        'मानचित्र चिह्नों को सत्यापित किए बिना स्थानीय निवासियों की व्यक्तिगत स्मृति',
        'लेआउट चित्र के बिना डाकघर पिनकोड निर्देशिका',
      ],
      correctAnswerIndex: 1,
      citation: 'Urban Frame Survey Manual, Section 1',
      rationale: 'UFS maps are statutory instruments defining exact boundaries for national sample surveys.',
      rationale_hi: 'यूएफएस मानचित्र राष्ट्रीय नमूना सर्वेक्षणों के लिए सटीक सीमाओं को परिभाषित करने वाले वैधानिक साधन हैं।',
    },
  },

  // ==========================================================================
  // comp-data: Statistical Scrutiny & Outlier Detection
  // ==========================================================================
  'comp-data': {
    STAGE_1: {
      id: 'data-s1',
      competencyId: 'comp-data',
      stage: 'STAGE_1',
      difficulty: 'medium',
      question_text: 'During scrutiny of Schedule 1.0 (Consumer Expenditure), an entry shows monthly food expenditure of ₹85,000 for a rural household of 3 members. What is the standard scrutiny action?',
      question_text_hi: 'अनुसूची 1.0 (उपभोक्ता व्यय) की जांच के दौरान, 3 सदस्यों के ग्रामीण परिवार के लिए ₹85,000 का मासिक भोजन व्यय दिखता है। मानक संवीक्षा कार्रवाई क्या है?',
      answer_choices: [
        'Delete the entire schedule and mark the household as non-responsive',
        'Silently divide the amount by 10 to match regional averages without field verification',
        'Immediately accept the figure because raw field data must never be challenged',
        'Issue a scrutiny query slip to the Field Investigator to verify social ceremonies, bulk grain stocking, or transcription errors',
      ],
      answer_choices_hi: [
        'पूरे शेड्यूल को हटाएं और परिवार को गैर-प्रतिक्रियाशील के रूप में चिह्नित करें',
        'फील्ड सत्यापन के बिना क्षेत्रीय औसत से मेल खाने के लिए राशि को चुपचाप 10 से विभाजित करें',
        'आंकड़े को तुरंत स्वीकार करें क्योंकि कच्चे फील्ड डेटा को कभी चुनौती नहीं दी जानी चाहिए',
        'सामाजिक समारोहों, थोक अनाज भंडारण, या लिपिकीय त्रुटियों को सत्यापित करने के लिए फील्ड अन्वेषक को एक संवीक्षा प्रश्न पर्ची जारी करें',
      ],
      correctAnswerIndex: 3,
      citation: 'MoSPI Scrutiny Inspection Manual, Chapter 4: Consistency Checks',
      rationale: 'Unusual expenditure peaks require query slips to field officers to confirm exceptional consumption events.',
      rationale_hi: 'असामान्य उपभोग घटनाओं की पुष्टि के लिए फील्ड अधिकारियों को प्रश्न पर्चियां जारी करने की आवश्यकता होती है।',
    },

    STAGE_2A: {
      id: 'data-s2a',
      competencyId: 'comp-data',
      stage: 'STAGE_2A',
      difficulty: 'hard',
      question_text: 'In Annual Survey of Industries (ASI) validation, what mathematical relation must strictly hold between Gross Output, Net Value Added (NVA), and Depreciation?',
      question_text_hi: 'उद्योगों के वार्षिक सर्वेक्षण (ASI) सत्यापन में, सकल उत्पादन, शुद्ध मूल्य वर्धित (NVA) और मूल्यह्रास (Depreciation) के बीच कौन सा गणितीय संबंध कड़ाई से होना चाहिए?',
      answer_choices: [
        'Net Value Added (NVA) = Gross Output + Depreciation - Total Inputs',
        'Gross Value Added (GVA) = Net Value Added (NVA) + Depreciation, where GVA = Gross Output - Total Inputs',
        'Depreciation = Gross Output × 0.15 regardless of capital stock reported',
        'GVA is always independent of Total Inputs and Depreciation',
      ],
      answer_choices_hi: [
        'शुद्ध मूल्य वर्धित (NVA) = सकल उत्पादन + मूल्यह्रास - कुल इनपुट',
        'सकल मूल्य वर्धित (GVA) = शुद्ध मूल्य वर्धित (NVA) + मूल्यह्रास, जहाँ GVA = सकल उत्पादन - कुल इनपुट',
        'रिपोर्ट किए गए पूंजीगत स्टॉक की परवाह किए बिना मूल्यह्रास = सकल उत्पादन × 0.15',
        'GVA हमेशा कुल इनपुट और मूल्यह्रास से स्वतंत्र होता है',
      ],
      correctAnswerIndex: 1,
      citation: 'ASI Concepts and Scrutiny Rules, National Accounts Division',
      rationale: 'Fundamental national accounting identities require NVA + Depreciation = GVA = Output - Inputs.',
      rationale_hi: 'मौलिक राष्ट्रीय लेखा पहचान के लिए आवश्यक है कि NVA + मूल्यह्रास = GVA = उत्पादन - इनपुट।',
    },

    STAGE_2B: {
      id: 'data-s2b',
      competencyId: 'comp-data',
      stage: 'STAGE_2B',
      difficulty: 'easy',
      question_text: 'What is a "Query Slip" in the official MoSPI survey scrutiny workflow?',
      question_text_hi: 'आधिकारिक सांख्यिकी मंत्रालय के सर्वेक्षण संवीक्षा कार्यप्रवाह में "प्रश्न पर्ची" (Query Slip) क्या है?',
      answer_choices: [
        'A receipt given to shopkeepers during wholesale price index collection',
        'A penalty notice issued to respondents who arrive late to interviews',
        'A formal discrepancy memo sent from a scrutiny officer to the primary enumerator requesting clarification on flagged data items',
        'A payment voucher for field travel allowances',
      ],
      answer_choices_hi: [
        'थोक मूल्य सूचकांक संग्रह के दौरान दुकानदारों को दी जाने वाली रसीद',
        'साक्षात्कार में देर से आने वाले उत्तरदाताओं को जारी किया गया जुर्माना नोटिस',
        'एक संवीक्षा अधिकारी से प्राथमिक प्रगणक को भेजा गया एक औपचारिक विसंगति ज्ञापन जिसमें चिह्नित डेटा मदों पर स्पष्टीकरण मांगा गया हो',
        'फील्ड यात्रा भत्तों के लिए एक भुगतान वाउचर',
      ],
      correctAnswerIndex: 2,
      citation: 'Data Quality Assurance Division (DQAD) SOP 2024',
      rationale: 'Query slips maintain accountability between scrutiny desk officers and field investigators.',
      rationale_hi: 'प्रश्न पर्चियां संवीक्षा अधिकारियों और फील्ड अन्वेषकों के बीच जवाबदेही बनाए रखती हैं।',
    },

    STAGE_3_L5: {
      id: 'data-s3-l5',
      competencyId: 'comp-data',
      stage: 'STAGE_3',
      targetBranch: 'L5',
      difficulty: 'hard',
      question_text: 'When detecting multidimensional outliers in survey datasets with skewed consumption, which robust distance metric is preferred over standard Euclidean distance?',
      question_text_hi: 'विषम उपभोग वाले सर्वेक्षण डेटासेट में बहुआयामी आउटलायर्स का पता लगाते समय, मानक यूक्लिडियन दूरी की तुलना में किस मजबूत दूरी मीट्रिक को प्राथमिकता दी जाती है?',
      answer_choices: [
        'Mahalanobis Distance using Minimum Covariance Determinant (MCD) estimators',
        'Manhattan distance without scale normalization',
        'Simple arithmetic difference from the sample mean',
        'Pearson correlation coefficient between unrelated survey rounds',
      ],
      answer_choices_hi: [
        'न्यूनतम सहप्रसरण निर्धारक (MCD) अनुमानकों का उपयोग करते हुए महालनोबिस दूरी (Mahalanobis Distance)',
        'पैमाने के सामान्यीकरण के बिना मैनहट्टन दूरी',
        'नमूना माध्य से सरल अंकगणितीय अंतर',
        'असंबंधित सर्वेक्षण दौरों के बीच पियर्सन सहसंबंध गुणांक',
      ],
      correctAnswerIndex: 0,
      citation: 'MoSPI Analytical Methodologies, Working Paper on Robust Estimation',
      rationale: 'Robust Mahalanobis distance accounts for covariance structures while preventing masking effects of extreme outliers.',
      rationale_hi: 'मजबूत महालनोबिस दूरी अत्यधिक आउटलायर्स के मास्किंग प्रभावों को रोकते हुए सहप्रसरण संरचनाओं का ध्यान रखती है।',
    },

    STAGE_3_L3_L4: {
      id: 'data-s3-l3l4',
      competencyId: 'comp-data',
      stage: 'STAGE_3',
      targetBranch: 'L3_L4',
      difficulty: 'medium',
      question_text: 'In computerized scrutiny validation rules, what does an "Inter-Round Consistency Check" verify?',
      question_text_hi: 'कम्प्यूटरीकृत संवीक्षा सत्यापन नियमों में, "अंतर-दौर निरंतरता जांच" (Inter-Round Consistency Check) क्या सत्यापित करती है?',
      answer_choices: [
        'That enumerator handwriting matches across physical schedules',
        'That the tablet was connected to the exact same Wi-Fi router in both rounds',
        'That regional aggregate growth rates stay within plausible bounds compared with preceding quarters',
        'That the survey round was conducted in alphabetical order of states',
      ],
      answer_choices_hi: [
        'कि प्रगणक की लिखावट भौतिक शेड्यूल में मेल खाती है',
        'कि टैबलेट दोनों दौरों में बिल्कुल एक ही वाई-फाई राउटर से जुड़ा था',
        'कि पिछली तिमाहियों की तुलना में क्षेत्रीय समग्र विकास दर प्रशंसनीय सीमाओं के भीतर रहे',
        'कि सर्वेक्षण दौर राज्यों के वर्णमाला क्रम में आयोजित किया गया था',
      ],
      correctAnswerIndex: 2,
      citation: 'DQAD Scrutiny Manual, Para 5.2',
      rationale: 'Inter-round checks prevent spurious seasonal spikes or unverified macro-level swings.',
      rationale_hi: 'अंतर-दौर जांच नकली मौसमी उछाल या असत्यापित व्यापक स्तर के उतार-चढ़ाव को रोकती है।',
    },

    STAGE_3_L2_L3: {
      id: 'data-s3-l2l3',
      competencyId: 'comp-data',
      stage: 'STAGE_3',
      targetBranch: 'L2_L3',
      difficulty: 'medium',
      question_text: 'If a household reports spending ₹12,000 on medical inpatient treatment but reports 0 days of illness for all members, how is this discrepancy flagged?',
      question_text_hi: 'यदि कोई परिवार चिकित्सा इनपेशेंट उपचार पर ₹12,000 खर्च करने की रिपोर्ट करता है लेकिन सभी सदस्यों के लिए 0 दिन की बीमारी की रिपोर्ट करता है, तो इस विसंगति को कैसे चिह्नित किया जाता है?',
      answer_choices: [
        'Flagged as a Cross-Schedule Logical Inconsistency between Health Morbidity and Expenditure blocks',
        'Approved automatically as valid preventative medicine expenditure',
        'Deleted without recording an audit note',
        'Charged as an administrative fine to the hospital',
      ],
      answer_choices_hi: [
        'स्वास्थ्य रुग्णता और व्यय ब्लॉकों के बीच क्रॉस-शेड्यूल तार्किक विसंगति के रूप में चिह्नित',
        'वैध निवारक दवा व्यय के रूप में स्वचालित रूप से अनुमोदित',
        'ऑडिट नोट रिकॉर्ड किए बिना हटा दिया गया',
        'अस्पताल को प्रशासनिक जुर्माने के रूप में लगाया गया',
      ],
      correctAnswerIndex: 0,
      citation: 'MoSPI Socio-Economic Validation Rules, Rule HE-4',
      rationale: 'Cross-block verification ensures that expenditure on hospitalizations correlates with reported hospitalization events.',
      rationale_hi: 'क्रॉस-ब्लॉक सत्यापन सुनिश्चित करता है कि अस्पताल में भर्ती होने पर खर्च रिपोर्ट की गई अस्पताल में भर्ती की घटनाओं से संबंधित हो।',
    },

    STAGE_3_L1: {
      id: 'data-s3-l1',
      competencyId: 'comp-data',
      stage: 'STAGE_3',
      targetBranch: 'L1',
      difficulty: 'easy',
      question_text: 'What is the first step when a scrutiny officer discovers an unreadable or blank mandatory field in a field schedule?',
      question_text_hi: 'जब कोई संवीक्षा अधिकारी किसी फील्ड शेड्यूल में अपठनीय या खाली अनिवार्य फ़ील्ड पाता है तो पहला कदम क्या होता है?',
      answer_choices: [
        'Throw away the schedule page and renumber subsequent pages',
        'Fill in the field with a random digit to make the file pass validation',
        'Record the field code and seek immediate clarification from the concerned field investigator',
        'Submit the data to the central portal without flagging the blank',
      ],
      answer_choices_hi: [
        'शेड्यूल पेज को फेंक दें और बाद के पेजों को फिर से नंबर दें',
        'फ़ाइल को सत्यापन पास कराने के लिए फ़ील्ड में यादृच्छिक अंक भरें',
        'फ़ील्ड कोड रिकॉर्ड करें और संबंधित फील्ड अन्वेषक से तत्काल स्पष्टीकरण मांगें',
        'खाली स्थान को चिह्नित किए बिना केंद्रीय पोर्टल पर डेटा सबमिट करें',
      ],
      correctAnswerIndex: 2,
      citation: 'Field Scrutiny Guide 2024, Chapter 1',
      rationale: 'Mandatory fields cannot be fabricated; clarification must be sought from the primary enumerator.',
      rationale_hi: 'अनिवार्य फ़ील्ड मनगढ़ंत नहीं हो सकते; प्राथमिक प्रगणक से स्पष्टीकरण मांगा जाना चाहिए।',
    },
  },
};

/**
 * Fallback questions for competencies without dedicated question banks
 */
export function getAdaptiveQuestion(
  competencyId: string,
  stage: AssessmentStage,
  branchPath: BranchPath | null
): AdaptiveQuestion {
  const bank = ADAPTIVE_QUESTIONS[competencyId] || ADAPTIVE_QUESTIONS['comp-capi'];

  if (stage === 'STAGE_1') {
    return bank.STAGE_1;
  }

  if (stage === 'STAGE_2A') {
    return bank.STAGE_2A || bank.STAGE_1;
  }

  if (stage === 'STAGE_2B') {
    return bank.STAGE_2B || bank.STAGE_1;
  }

  if (stage === 'STAGE_3') {
    if (branchPath === 'L5') return bank.STAGE_3_L5 || bank.STAGE_2A;
    if (branchPath === 'L3_L4') return bank.STAGE_3_L3_L4 || bank.STAGE_1;
    if (branchPath === 'L2_L3') return bank.STAGE_3_L2_L3 || bank.STAGE_2B;
    return bank.STAGE_3_L1 || bank.STAGE_2B;
  }

  // Default fallback
  return bank.STAGE_1;
}
