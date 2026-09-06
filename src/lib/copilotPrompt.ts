/**
 * StatVidya Institutional Copilot System Prompt
 * Primarily bound to StatVidya, but conversational and helpful on related topics.
 */

export const STATVIDYA_MANIFESTO = [
  'ROLE: You are the StatVidya Copilot — a smart, friendly AI assistant embedded in the StatVidya platform (India\'s Official Statistical System workforce upskilling tool).',
  '',
  'You are a general-purpose AI assistant who can answer ANY question on ANY topic. You are knowledgeable, helpful, and conversational.',
  'You also have deep knowledge of the StatVidya platform, which is described below. When users ask about the platform, use this knowledge to give precise navigation and guidance.',
  '',
  'STATVIDYA PLATFORM KNOWLEDGE:',
  '',
  'UI LAYOUT:',
  '- Left Sidebar: Houses Main, Content, and Admin routes. Can be collapsed using the Chevron arrow.',
  '- Topbar (Top Right): Contains the Dashboard title, Notification Bell, and User Avatar.',
  '- User Menu: Click the User Avatar in the Topbar to access Profile (/profile), Settings (/settings), or Logout (/auth/login).',
  '- Language Switcher: Floating pill in the bottom right corner to toggle EN (English) or HI (Hindi).',
  '- Offline Indicator: Real-time banner. States: Offline (Amber - N pending), Syncing (Blue - animated spin), Synced (Emerald - auto-hides), Failed (Red - retry button).',
  '',
  'PAGES & FEATURES:',
  '[MAIN SECTION - All Users]',
  '- Dashboard (/dashboard): Readiness Index %, Karma Points, priority gaps.',
  '- Skill Gap (/skill-gap): Custom Radar Chart. Formula: (Target - Current) * Priority Weight (Critical=3, Important=2, Desirable=1).',
  '- Assessment (/assessment/comp-capi): 3-stage adaptive test runner (Medium -> Hard/Easy -> L1-L5). Works 100% offline via IndexedDB; syncs idempotently via local_id on reconnect.',
  '- Pathways (/pathways): iGOT course recommendations ranked by gap severity.',
  '- Profile (/profile): Official cadre details, growth timeline. Badges: Assessment-Verified vs Self-Assessed.',
  '',
  '[CONTENT SECTION - Trainers]',
  '- Documents (/documents): Upload MoSPI PDFs directly to Firebase Storage.',
  '- MCQ Generator (/mcq-generator): AI batch generation, stage 5a competency sanity check.',
  '- Review Queue (/review-queue): Triage AI questions, sorted low-confidence first.',
  '',
  '[ADMIN SECTION - Admins]',
  '- Admin Analytics (/admin/analytics): Macro readiness, simulated e-SIGMA outcome correlation chart, "Flag for Priority Training" write-back action.',
  '',
  'RESPONSE STYLE:',
  '- START DIRECTLY: Begin immediately with the answer or action. Omit pleasantries, meta-commentary, and conversational fluff (e.g. "Sure!", "Certainly!", "Here is the information").',
  '- Keep responses visually clean, structured, concise, and easy to read in a small chat window.',
  '- Avoid heavy markdown headers (###) or dividers (---). Instead, use clear bold titles with emojis.',
  '- Use bullet points for lists and wrap platform routes in backticks like `/skill-gap` or `/pathways`.',
  '- Label gap priorities clearly like (Critical gap) or (Important gap) so the UI can highlight them.',
  '- Be concise, warm, and direct. Help the user take immediate action with linkable routes.',
  '- Personalize responses using the active user context when available.',
  '- For any topic outside the platform, answer freely without restriction.',
  '',
  'TONE: Expert, direct, concise, and helpful.',
].join('\n');


export interface CopilotUserContext {
  role?: string;
  cadre?: string;
  name?: string;
  designation?: string;
  readinessIndex?: number;
  topGaps?: Array<{ competency: string; levelDelta: number; priority: string }>;
}

export function getSystemPromptWithContext(userContext?: CopilotUserContext): string {
  if (!userContext) return STATVIDYA_MANIFESTO;

  const gapsStr = userContext.topGaps?.length
    ? userContext.topGaps
        .map((g) => g.competency + ' (-' + g.levelDelta + ', ' + g.priority + ')')
        .join(' | ')
    : 'None identified yet';

  const readiness =
    userContext.readinessIndex !== undefined
      ? userContext.readinessIndex + '%'
      : 'N/A';

  const contextBlock = [
    '[ACTIVE USER CONTEXT]',
    'Name: ' + (userContext.name || 'User'),
    'Role: ' + (userContext.role || 'learner') + ' | Cadre: ' + (userContext.cadre || 'NSSO (FOD)'),
    'Designation: ' + (userContext.designation || 'N/A'),
    'Readiness: ' + readiness,
    'Priority Gaps: ' + gapsStr,
    'DIRECTIVE: Frame your response around resolving these specific gaps using the platform routes above. Address the user by name.',
  ].join('\n');

  return STATVIDYA_MANIFESTO + '\n\n' + contextBlock;
}

/**
 * Offline fallback: phrase-based routing for when AI API is unreachable.
 * Uses multi-word patterns to avoid false matches on generic words.
 */
export function getOfflineFallbackResponse(message: string): string {
  const lower = message.toLowerCase().trim();

  // Exact greetings (short messages only)
  if (lower.length < 30 && /^(hi|hey|hello|namaste|help|what can you do)[\s!?.]*$/.test(lower)) {
    return '🙏 **Namaste!** I\'m the StatVidya Copilot.\n\nI can help you with:\n- 📊 **Dashboard & Readiness** — understanding your scores\n- 🎯 **Skill Gaps** — identifying competency gaps\n- 📝 **Assessments** — taking adaptive tests\n- 🛤️ **Pathways** — finding iGOT courses\n- 🧭 **Navigation** — finding any platform feature\n\n⚡ For general questions (coding, science, career advice, etc.), connect an AI API key in your .env.local for full conversational AI.\n\nWhat would you like to explore?';
  }

  // Platform-specific navigation (tight matches)
  if (/\b(go to|open|navigate|show|find|where is|where\'?s)\b.*\bdashboard\b/.test(lower) || lower === 'dashboard') {
    return '📊 **Dashboard** → Navigate to **/dashboard** in the sidebar.\n\nYou\'ll see your Readiness Index %, Karma Points, and priority competency gaps at a glance.';
  }
  if (/\b(skill.?gap|radar chart|my gaps|competency gap)\b/.test(lower)) {
    return '🎯 **Skill Gap Analysis** → Navigate to **/skill-gap** in the sidebar.\n\nYour gaps are calculated using: (Target - Current) × Priority Weight where Critical=3, Important=2, Desirable=1. The radar chart visualises all competencies.';
  }
  if (/\b(take.*(assessment|test|quiz)|start.*(assessment|test|quiz)|assessment|adaptive test)\b/.test(lower)) {
    return '📝 **Assessment** → Navigate to **/assessment/comp-capi** in the sidebar.\n\nThe 3-stage adaptive test starts at Medium difficulty, then branches to Hard/Easy based on your performance. It works **100% offline** and syncs when you reconnect.';
  }
  if (/\b(pathway|igot|recommend.*course|suggest.*course|which course|learning path)\b/.test(lower)) {
    return '🛤️ **Learning Pathways** → Navigate to **/pathways** in the sidebar.\n\niGOT Karmayogi course recommendations are ranked by your gap severity — critical gaps surface first.';
  }
  if (/\b(my profile|view profile|edit profile|cadre detail|my badge)\b/.test(lower) || lower === 'profile') {
    return '👤 **Profile** → Navigate to **/profile** in the sidebar or click your avatar in the top-right.\n\nView your official cadre details, growth timeline, and badges: 🛡️ Assessment-Verified vs ✍️ Self-Assessed.';
  }
  if (/\b(upload|document.*upload|upload.*pdf|mospi.*pdf)\b/.test(lower)) {
    return '📄 **Documents** → Navigate to **/documents** under the Content section.\n\nUpload MoSPI PDFs directly. Files are stored on Firebase Storage.';
  }
  if (/\b(mcq|generate.*question|question.*generat)\b/.test(lower)) {
    return '🧠 **MCQ Generator** → Navigate to **/mcq-generator** under the Content section.\n\nAI generates questions in batch from your uploaded materials, with a Stage 5a competency sanity check.';
  }
  if (/\b(review queue|triage|review.*question)\b/.test(lower)) {
    return '✅ **Review Queue** → Navigate to **/review-queue** under the Content section.\n\nTriage AI-generated questions, sorted by confidence — low-confidence items surface first for human review.';
  }
  if (/\b(admin.*analytics|analytics.*dashboard|e.?sigma|flag.*training)\b/.test(lower)) {
    return '📈 **Admin Analytics** → Navigate to **/admin/analytics** under the Admin section.\n\nView macro readiness across the organization, e-SIGMA outcome correlation, and use "Flag for Priority Training" for write-back actions.';
  }
  if (/\b(offline|sync|work without internet|no internet)\b/.test(lower)) {
    return '📡 **Offline Mode**: StatVidya works offline for assessments via IndexedDB.\n\nLook for the status banner:\n- 🟡 Amber: Offline (N items pending)\n- 🔵 Blue: Syncing\n- 🟢 Emerald: All synced\n- 🔴 Red: Failed (retry button available)';
  }
  if (/\b(change language|switch.*language|hindi|toggle.*language)\b/.test(lower)) {
    return '🌐 **Language**: Use the floating pill in the **bottom-right corner** to toggle between English (EN) and Hindi (HI).';
  }
  if (/\b(settings|preferences|account setting)\b/.test(lower)) {
    return '⚙️ **Settings** → Click your avatar in the top-right corner, then select **Settings** from the dropdown menu.';
  }
  if (/\b(log\s?out|sign\s?out)\b/.test(lower)) {
    return '🚪 **Logout** → Click your avatar in the top-right corner, then select **Logout** from the dropdown menu.';
  }
  if (/\b(frac|competenc.*framework|what are.*levels|l1.*l5)\b/.test(lower)) {
    return '🏛️ **FRAC Competencies**: The platform maps competencies from FRAC (Framework of Roles, Activities, Competencies).\n\nLevels range from **L1** (basic awareness) to **L5** (expert mastery). Check your current levels at **/skill-gap** and improve through courses at **/pathways**.';
  }
  if (/\b(readiness.*index|my readiness|karma point|my score)\b/.test(lower)) {
    return '📊 **Readiness Index**: Percentage of required competencies at or above target level.\n\n**Karma Points** reflect your engagement and verified growth. View both on your **/dashboard**.';
  }

  // Default — honest about limitations, not a fake answer
  return '🤖 I\'m currently running in **offline mode** without an AI backend, so I can only help with platform navigation right now.\n\n**For platform questions**, try asking:\n- "How do I take an assessment?"\n- "Show my skill gaps"\n- "Recommend courses for me"\n- "Navigate to dashboard"\n\n**To unlock full AI chat** (answer any question on any topic), add your API key to `.env.local` and restart the server.\n\nWhat platform feature can I help you find?';
}

