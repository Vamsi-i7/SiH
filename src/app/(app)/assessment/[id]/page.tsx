/**
 * src/app/(app)/assessment/[id]/page.tsx
 *
 * Assessment page: Server component that fetches assessment and passes to client
 */

import { getAuthenticatedUser } from '@/lib/auth';
import { getSupabaseServerClient } from '@/lib/supabase';
import AssessmentClient from './AssessmentClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AssessmentPage({ params }: PageProps) {
  const { id: competencyId } = await params;
  // Get user session
  const user = await getAuthenticatedUser();
  const supabase = await getSupabaseServerClient();

  // Demo/fallback competencies lookup
  const DEMO_COMPETENCIES: Record<string, { name: string; name_hi: string }> = {
    'comp-capi': { name: 'CAPI Tablet Operation', name_hi: 'कैपी टैबलेट संचालन' },
    'comp-nsso': { name: 'NSSO Protocol Mastery', name_hi: 'एनएसएसओ प्रोटोकॉल निपुणता' },
    'comp-survey': { name: 'Survey Sampling & Design', name_hi: 'सर्वेक्षण नमूनाकरण और डिज़ाइन' },
    'comp-data': { name: 'Data Entry & Scrutiny', name_hi: 'डेटा प्रविष्टि और जांच' },
    'comp-teamwork': { name: 'Teamwork & Collaboration', name_hi: 'टीम वर्क और सहयोग' },
  };

  // Fetch competency details
  let competencyName = DEMO_COMPETENCIES[competencyId]?.name || 'Statistical Competency';
  let competencyNameHi = DEMO_COMPETENCIES[competencyId]?.name_hi || 'सांख्यिकीय योग्यता';

  // Helper for fast-timeout Supabase query to prevent slow page loads
  const fastQuery = async <T,>(promise: PromiseLike<T>, timeoutMs = 250): Promise<T | null> => {
    return Promise.race([
      Promise.resolve(promise),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
    ]);
  };

  interface CompetencyRecord {
    name: string;
    name_hi?: string;
  }

  interface QuestionRecord {
    id: string;
    stem: string;
    stem_hi?: string;
    options?: { en?: string[]; hi?: string[] };
    difficulty: 'easy' | 'medium' | 'hard';
  }

  try {
    const res = await fastQuery<{ data: CompetencyRecord | null }>(
      supabase.from('competencies').select('*').eq('id', competencyId).single()
    );

    if (res?.data) {
      const competency = res.data;
      competencyName = competency.name;
      competencyNameHi = competency.name_hi || competency.name;
    }
  } catch {
    // Graceful fallback to demo competency metadata
  }

  // Fetch Stage 1 question (Medium difficulty calibration)
  let firstQuestion = null;

  try {
    const res = await fastQuery<{ data: QuestionRecord[] | null }>(
      supabase
        .from('questions')
        .select('*')
        .eq('competency_id', competencyId)
        .eq('difficulty', 'medium')
        .limit(1)
    );

    if (res?.data && res.data.length > 0) {
      const q = res.data[0];
      const optionsEn = Array.isArray(q.options?.en) ? q.options.en : ['Option A', 'Option B', 'Option C', 'Option D'];
      const optionsHi = Array.isArray(q.options?.hi) ? q.options.hi : optionsEn;

      firstQuestion = {
        id: q.id,
        question_text: q.stem,
        question_text_hi: q.stem_hi || q.stem,
        answer_choices: optionsEn,
        answer_choices_hi: optionsHi,
        difficulty: q.difficulty,
        stage: 1,
      };
    }
  } catch {
    // Database query failed, use seeded fallback
  }

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
