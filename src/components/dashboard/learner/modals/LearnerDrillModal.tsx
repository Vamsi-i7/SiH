'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Award, ArrowRight, ShieldCheck, HelpCircle, BookOpen } from 'lucide-react';

export interface DrillQuestion {
  id: string;
  scenario: string;
  scenario_hi: string;
  options: { id: string; text: string; text_hi: string }[];
  correctOptionId: string;
  citation: string;
  citation_hi: string;
}

export interface DrillConfig {
  id: string;
  title: string;
  title_hi: string;
  division: string;
  pointsReward: number;
  questions: DrillQuestion[];
}

const DRILL_REGISTRY: Record<string, DrillConfig> = {
  'drill-schedule-0': {
    id: 'drill-schedule-0',
    title: 'Schedule 0.0: Household Demarcation & Listing',
    title_hi: 'अनुसूची 0.0: परिवार सूचीकरण एवं सीमा निर्धारण',
    division: 'NSSO Field Operations Division (FOD)',
    pointsReward: 50,
    questions: [
      {
        id: 'q1',
        scenario:
          'While listing households in a Census Enumeration Block (CEB), you encounter a newly built gated housing society with 45 flats that was not recorded in the 2021 Census demarcation sketch. What is the statutory standard operating procedure?',
        scenario_hi:
          'जनगणना प्रगणना ब्लॉक (CEB) में परिवारों की सूची बनाते समय, आपको 45 फ्लैटों वाली एक नई आवासीय सोसायटी मिलती है जो 2021 के मानचित्र में दर्ज नहीं थी। वैधानिक मानक प्रक्रिया क्या है?',
        options: [
          {
            id: 'A',
            text: 'Skip the complex since it is not listed on the original 2021 demarcation map.',
            text_hi: 'परिसर को छोड़ दें क्योंकि यह मूल 2021 मानचित्र पर सूचीबद्ध नहीं है।',
          },
          {
            id: 'B',
            text: 'Include all 45 households within the CEB frame, update the boundary sketch with permanent landmarks, and assign serial numbers contiguously.',
            text_hi: 'सभी 45 परिवारों को शामिल करें, स्थाई स्थलों के साथ स्केच अपडेट करें और क्रम संख्या दें।',
          },
          {
            id: 'C',
            text: 'List only 5 sample households from the new complex to avoid sample skew.',
            text_hi: 'प्रतिदर्श तिरछापन से बचने के लिए केवल 5 परिवारों को सूचीबद्ध करें।',
          },
          {
            id: 'D',
            text: 'Refer the matter to the Municipal Corporation and halt survey listing.',
            text_hi: 'मामले को नगर निगम को भेजें और सर्वेक्षण रोक दें।',
          },
        ],
        correctOptionId: 'B',
        citation:
          'Under SDRD Schedule 0.0 Manual (Para 3.4), any newly constructed residential dwelling found physically within the CEB boundaries must be completely listed and demarcated using permanent physical landmarks to eliminate coverage error.',
        citation_hi:
          'एसडीआरडी अनुसूची 0.0 नियमावली (पैरा 3.4) के अनुसार, सीईबी सीमाओं के भीतर पाए गए किसी भी नए आवासीय भवन को कवरेज त्रुटि समाप्त करने के लिए पूर्णतः सूचीबद्ध किया जाना अनिवार्य है।',
      },
      {
        id: 'q2',
        scenario:
          'A CEB contains 380 households, exceeding the ceiling of 300 households for a single investigator. What is the prescribed method for creating Hamlet-Groups (hg)?',
        scenario_hi:
          'एक सीईबी में 380 परिवार हैं, जो 300 परिवारों की अधिकतम सीमा से अधिक है। हेमलेट-समूह (hg) बनाने की निर्धारित विधि क्या है?',
        options: [
          {
            id: 'A',
            text: 'Randomly divide the households into two equal lists by lottery.',
            text_hi: 'लॉटरी द्वारा परिवारों को दो समान सूचियों में विभाजित करें।',
          },
          {
            id: 'B',
            text: 'Divide the CEB into equal-sized hamlet-groups using identifiable natural or permanent boundaries (streets, canals), ensuring equal population share.',
            text_hi: 'पहचान योग्य प्राकृतिक या स्थाई सीमाओं (सड़क, नहर) का उपयोग करके समान आबादी वाले समूह बनाएं।',
          },
          {
            id: 'C',
            text: 'Only enumerate the first 300 households and discard the remaining 80.',
            text_hi: 'केवल पहले 300 परिवारों की गणना करें और शेष 80 को छोड़ दें।',
          },
          {
            id: 'D',
            text: 'Canvass without splitting the area despite the ceiling.',
            text_hi: 'सीमा के बावजूद क्षेत्र को विभाजित किए बिना सर्वेक्षण करें।',
          },
        ],
        correctOptionId: 'B',
        citation:
          'Para 4.2 dictates that whenever the population exceeds the threshold, hamlet-groups must be demarcated geographically with clear physical boundaries, not arbitrary serial splits.',
        citation_hi:
          'पैरा 4.2 के अनुसार जब भी जनसंख्या सीमा पार हो, भौगोलिक सीमाओं के आधार पर हेमलेट-समूह बनाए जाने चाहिए।',
      },
      {
        id: 'q3',
        scenario:
          'In CAPI tablet entry, GPS accuracy is showing +/- 35 meters under dense tree canopy. What is the statutory protocol before finalizing Schedule 0.0?',
        scenario_hi:
          'कैपी टैबलेट में घने पेड़ों के नीचे जीपीएस सटीकता +/- 35 मीटर दिखा रही है। अनुसूची 0.0 को अंतिम रूप देने से पहले वैधानिक प्रोटोकॉल क्या है?',
        options: [
          {
            id: 'A',
            text: 'Step into an open clearing within 10 meters of the household entrance to acquire satellite lock under 10m accuracy and record landmark notes.',
            text_hi: '10 मीटर के भीतर खुले स्थान पर जाएं, 10 मीटर से कम सटीकता प्राप्त करें और विवरण दर्ज करें।',
          },
          {
            id: 'B',
            text: 'Disable GPS verification and manually type zero coordinates.',
            text_hi: 'जीपीएस सत्यापन अक्षम करें और मैन्युअल रूप से शून्य निर्देशांक दर्ज करें।',
          },
          {
            id: 'C',
            text: 'Cancel the household interview immediately.',
            text_hi: 'परिवार का साक्षात्कार तुरंत रद्द करें।',
          },
          {
            id: 'D',
            text: 'Force save with 35m error without documenting satellite geometry.',
            text_hi: 'बिना कोई विवरण लिखे 35 मीटर त्रुटि के साथ बलपूर्वक सुरक्षित करें।',
          },
        ],
        correctOptionId: 'A',
        citation:
          'ASHE & CAPI Protocol (2026.2, Sec 6) specifies relocating to an adjacent open clearing while maintaining visual line-of-sight to achieve sub-10m GPS accuracy.',
        citation_hi:
          'कैपी प्रोटोकॉल (2026.2) उप-10 मीटर जीपीएस सटीकता प्राप्त करने के लिए खुले स्थान से उपग्रह लॉक लेने का निर्देश देता है।',
      },
    ],
  },
  'drill-nic-coding': {
    id: 'drill-nic-coding',
    title: 'NIC-2008: 5-Digit Economic Activity Coding',
    title_hi: 'एनआईसी-2008: 5-अंकीय आर्थिक गतिविधि कोडिंग',
    division: 'Survey Design & Research Division (SDRD)',
    pointsReward: 75,
    questions: [
      {
        id: 'q1',
        scenario:
          'A respondent in a rural village owns a retail grocery shop (Kirana) and also operates a small flour milling unit attached to the shop. Which 5-digit code should be assigned as Principal Activity?',
        scenario_hi:
          'एक ग्रामीण व्यक्ति की किराने की दुकान है और दुकान से जुड़ी आटा चक्की भी है। मुख्य गतिविधि के रूप में कौन सा कोड दिया जाना चाहिए?',
        options: [
          {
            id: 'A',
            text: 'The activity generating the highest gross income or maximum labor time during the 365 days reference period.',
            text_hi: '365 दिनों की संदर्भ अवधि के दौरान उच्चतम आय या अधिकतम कार्य समय उत्पन्न करने वाली गतिविधि।',
          },
          {
            id: 'B',
            text: 'Always code the grocery shop regardless of revenue share.',
            text_hi: 'राजस्व की परवाह किए बिना हमेशा किराने की दुकान को कोड करें।',
          },
          {
            id: 'C',
            text: 'Combine both under generic agricultural services.',
            text_hi: 'सामान्य कृषि सेवाओं के तहत दोनों को संयोजित करें।',
          },
          {
            id: 'D',
            text: 'Record as non-working household member.',
            text_hi: 'गैर-कार्यशील परिवार के सदस्य के रूप में दर्ज करें।',
          },
        ],
        correctOptionId: 'A',
        citation:
          'NSSO PLFS Manual (Vol. 1, Chapter 2): Principal activity status is strictly determined by the major time spent criterion over the 365-day reference period.',
        citation_hi:
          'एनएसएसओ पीएलएफएस नियमावली (खंड 1, अध्याय 2): मुख्य गतिविधि का निर्धारण 365 दिनों की अवधि में व्यतीत किए गए प्रमुख समय के आधार पर किया जाता है।',
      },
    ],
  },
};

interface LearnerDrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  drillId?: string;
  onComplete?: (pointsEarned: number) => void;
  isHindi?: boolean;
}

export function LearnerDrillModal({
  isOpen,
  onClose,
  drillId = 'drill-schedule-0',
  onComplete,
  isHindi = false,
}: LearnerDrillModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const drill = DRILL_REGISTRY[drillId] || DRILL_REGISTRY['drill-schedule-0'];
  const questions = drill.questions;
  const currentQuestion = questions[currentQuestionIndex] || questions[0];

  const handleSelectOption = (optId: string) => {
    if (verified) return; // locked once verified
    setSelectedOptionId(optId);
  };

  const handleVerify = () => {
    if (!selectedOptionId) return;
    const correct = selectedOptionId === currentQuestion.correctOptionId;
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 1);
    }
    setVerified(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setVerified(false);
      setIsCorrect(false);
    } else {
      setCompleted(true);
    }
  };

  const handleFinishDrill = () => {
    if (onComplete) {
      onComplete(drill.pointsReward);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drill-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#FAF6F0] border-2 border-[#BF9B7A]/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#555934] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 p-1 border border-white/20">
              <BookOpen className="h-5 w-5 text-[#F8C858]" />
            </div>
            <div>
              <h2 id="drill-modal-title" className="text-sm font-black tracking-wide text-[#F8C858]">
                {isHindi ? drill.title_hi : drill.title}
              </h2>
              <p className="text-[11px] text-white/80">{drill.division}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drill modal"
            className="rounded-xl p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {!completed ? (
            <>
              {/* Question Progress & Reward Bar */}
              <div className="flex items-center justify-between text-xs pb-3 border-b border-[#BF9B7A]/25">
                <span className="font-bold text-[#555934]">
                  {isHindi
                    ? `प्रश्न ${currentQuestionIndex + 1} / ${questions.length}`
                    : `Question ${currentQuestionIndex + 1} of ${questions.length}`}
                </span>
                <span className="inline-flex items-center gap-1 font-mono font-bold text-[#8C5B3E] bg-[#F8C858]/25 px-2.5 py-0.5 rounded-full border border-[#F8C858]/40">
                  <Award className="h-3.5 w-3.5 text-[#8C5B3E]" />
                  +{drill.pointsReward} KP
                </span>
              </div>

              {/* Scenario Box */}
              <div className="p-4 rounded-2xl bg-white border border-[#BF9B7A]/30 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#8C5B3E]">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>{isHindi ? 'फील्ड परिदृश्य' : 'Official Field Scenario'}</span>
                </div>
                <p className="text-sm font-medium text-[#2d1f17] leading-relaxed">
                  {isHindi ? currentQuestion.scenario_hi : currentQuestion.scenario}
                </p>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-[#705849]">
                  {isHindi ? 'सही मानक प्रक्रिया चुनें:' : 'Select Standard Operating Procedure:'}
                </p>
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrectOption = opt.id === currentQuestion.correctOptionId;

                  let optBorder = 'border-[#BF9B7A]/30 bg-white hover:bg-[#FAF6F0]';
                  if (isSelected && !verified) {
                    optBorder = 'border-[#555934] bg-[#555934]/10 ring-2 ring-[#555934]/20';
                  } else if (verified) {
                    if (isCorrectOption) {
                      optBorder = 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30';
                    } else if (isSelected && !isCorrectOption) {
                      optBorder = 'border-red-500 bg-red-500/15 ring-2 ring-red-500/30';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${optBorder}`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#FAF6F0] border border-[#BF9B7A]/40 font-mono font-bold text-xs text-[#2d1f17]">
                        {opt.id}
                      </span>
                      <span className="text-xs font-medium text-[#2d1f17] flex-1 leading-normal pt-0.5">
                        {isHindi ? opt.text_hi : opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Citation Box */}
              {verified && (
                <div
                  className={`p-4 rounded-2xl border animate-in fade-in duration-200 ${
                    isCorrect
                      ? 'bg-emerald-500/12 border-emerald-500/30 text-emerald-950'
                      : 'bg-red-500/12 border-red-500/30 text-red-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs mb-1">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{isHindi ? 'उत्कृष्ट! सही उत्तर।' : 'Correct SOP Verification!'}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                        <span>
                          {isHindi
                            ? `त्रुटि! सही विकल्प ${currentQuestion.correctOptionId} है।`
                            : `Incorrect SOP. The statutory procedure is option ${currentQuestion.correctOptionId}.`}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-[#2d1f17]/90 leading-relaxed mt-1">
                    {isHindi ? currentQuestion.citation_hi : currentQuestion.citation}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Completion Screen */
            <div className="text-center py-8 px-4 space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-[#555934]/15 text-[#555934] mb-2">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-[#2d1f17]">
                {isHindi ? 'फील्ड ड्रिल सफलतापूर्वक पूर्ण!' : 'Field Drill Successfully Completed!'}
              </h3>
              <p className="text-xs text-[#705849] max-w-md mx-auto">
                {isHindi
                  ? `आपने ${questions.length} में से ${score} प्रश्नों का सही उत्तर दिया है। आपके आधिकारिक कैडर प्रोफाइल में कर्म अंक जोड़ दिए गए हैं।`
                  : `You verified ${score} out of ${questions.length} scenarios correctly. Karma points have been credited to your official civil service dossier.`}
              </p>

              <div className="inline-flex items-center gap-2 p-3 rounded-2xl bg-[#F8C858]/20 border border-[#F8C858]/40 text-[#8C5B3E] font-bold text-sm">
                <Award className="h-5 w-5" />
                <span>+{drill.pointsReward} Karma Points Credited</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#F2E6D8]/50 border-t border-[#BF9B7A]/25 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#BF9B7A]/40 text-xs font-bold text-[#705849] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
          >
            {isHindi ? 'छोड़ें' : 'Close'}
          </button>

          {!completed ? (
            !verified ? (
              <button
                type="button"
                disabled={!selectedOptionId}
                onClick={handleVerify}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors shadow-2xs disabled:opacity-40 cursor-pointer"
              >
                <span>{isHindi ? 'उत्तर जांचें' : 'Verify Answer'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors shadow-2xs cursor-pointer"
              >
                <span>
                  {currentQuestionIndex + 1 < questions.length
                    ? isHindi
                      ? 'अगला प्रश्न'
                      : 'Next Question'
                    : isHindi
                      ? 'परिणाम देखें'
                      : 'View Results'}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={handleFinishDrill}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors shadow-2xs cursor-pointer"
            >
              <span>{isHindi ? 'कैडर प्रोफाइल में सुरक्षित करें' : 'Save & Return to Workspace'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
