/**
 * src/app/(app)/assessment/[id]/page.tsx
 *
 * Assessment page: Server component.
 * - For dummy/local assessment IDs (problem-solving, etc.): redirect to instructions.
 * - For real competency IDs (comp-capi, etc.): existing adaptive engine behaviour.
 */

import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import { isDummyAssessment } from '@/data/assessments';
import { getPersonaFRAC } from '@/data/fracCadres';
import AssessmentClient from './AssessmentClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AssessmentPage({ params }: PageProps) {
  const { id: competencyId } = await params;

  // Redirect dummy assessment IDs to the new instructions + test flow
  if (isDummyAssessment(competencyId)) {
    redirect(`/assessment/${competencyId}/instructions`);
  }

  // For real competency IDs — existing adaptive engine
  const user = await getAuthenticatedUser();
  const personaFrac = getPersonaFRAC(user);
  const matchedComp = personaFrac.competencies.find((c) => c.id === competencyId);

  // Demo/fallback competencies lookup
  const DEMO_COMPETENCIES: Record<string, { name: string; name_hi: string }> = {
    'comp-capi': { name: 'CAPI Tablet Operation', name_hi: 'कैपी टैबलेट संचालन' },
    'comp-demarcation': { name: 'Block Demarcation & Urban Frame Survey', name_hi: 'ब्लॉक सीमांकन और यूएफएस' },
    'comp-nsso': { name: 'NSSO Protocol Mastery', name_hi: 'एनएसएसओ प्रोटोकॉल निपुणता' },
    'comp-survey': { name: 'Survey Sampling & Design', name_hi: 'सर्वेक्षण नमूनाकरण और डिज़ाइन' },
    'comp-data': { name: 'Data Entry & Scrutiny Rules', name_hi: 'डेटा प्रविष्टि और जांच नियम' },
    'comp-scrutiny': { name: 'Field Scrutiny & Validation Rules', name_hi: 'क्षेत्र संवीक्षा और सत्यापन नियम' },
    'comp-r-prog': { name: 'Statistical Computing with R & Python', name_hi: 'आर और पायथन के साथ सांख्यिकीय संगणना' },
    'comp-teamwork': { name: 'Teamwork & Collaboration', name_hi: 'टीम वर्क और सहयोग' },
  };

  // Fetch competency details
  const competencyName = matchedComp?.name || DEMO_COMPETENCIES[competencyId]?.name || 'Statistical Competency';
  const competencyNameHi = matchedComp?.name_hi || DEMO_COMPETENCIES[competencyId]?.name_hi || 'सांख्यिकीय योग्यता';

  let firstQuestion = null;

  // Fallback question if database doesn't have it yet (e.g. offline or unseeded)
  if (!firstQuestion) {
    firstQuestion = {
      id: `q-${competencyId}-1`,
      question_text: `Initial assessment question for ${competencyName}: How do you ensure accuracy during data collection?`,
      question_text_hi: `${competencyNameHi} के लिए प्रारंभिक मूल्यांकन प्रश्न: डेटा संग्रह के दौरान आप सटीकता कैसे सुनिश्चित करते हैं?`,
      answer_choices: [
        'Adhere strictly to standard operational protocols and double-check discrepancies',
        'Bypass secondary verification steps to save field time',
        'Submit estimates without cross-verifying raw primary records',
        'Delegate critical recording tasks without oversight',
      ],
      answer_choices_hi: [
        'मानक परिचालन प्रोटोकॉल का कड़ाई से पालन करें और विसंगतियों की दोबारा जांच करें',
        'फ़ील्ड समय बचाने के लिए द्वितीयक सत्यापन चरणों को छोड़ें',
        'कच्चे प्राथमिक रिकॉर्ड को सत्यापित किए बिना अनुमान प्रस्तुत करें',
        'बिना पर्यवेक्षण के महत्वपूर्ण रिकॉर्डिंग कार्य सौंपें',
      ],
      difficulty: 'medium' as const,
      stage: 1,
    };
  }

  return (
    <div className="min-h-screen bg-background">
      <AssessmentClient
        competencyId={competencyId}
        competencyName={competencyName}
        competencyNameHi={competencyNameHi}
        firstQuestion={firstQuestion}
        userId={user.id}
      />
    </div>
  );
}
