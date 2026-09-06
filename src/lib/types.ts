// Data models and TypeScript interfaces for Firebase Cloud Firestore schema

export type ProvenanceType = 'VERIFIED_OFFICIAL' | 'PROPOSED_FRAMEWORK' | 'PROPOSED_METHODOLOGY' | 'SYNTHETIC_DEMO_DATA';
export type UserRole = 'learner' | 'trainer' | 'admin';
export type CompetencyCategory = 'Behavioural' | 'Functional' | 'Domain';
export type ActivityPriority = 'critical' | 'important' | 'desirable';
export type QuestionStatus = 'pending' | 'approved' | 'rejected';
export type QuestionConfidence = 'high' | 'medium' | 'low';
export type DocumentStatus = 'uploaded' | 'extracting' | 'extracted' | 'ready' | 'error';
export type AssessmentType = 'diagnostic' | 'topic' | 'post_training';
export type CourseProvider = 'igot' | 'nssta' | 'tpac' | 'external';
export type EnrollmentStatus = 'enrolled' | 'in_progress' | 'completed';
export type SeverityBucket = 'HIGH' | 'MODERATE' | 'PROFICIENT';

// ============================================================================
// DATABASE TABLES
// ============================================================================

export interface Organization {
  id: string;
  name: string;
  code: string;
  ministry?: string;
  config?: Record<string, unknown>;
  created_at: string;
}

export interface User {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  designation?: string;
  cadre?: string;
  employee_id?: string;
  selected_role_id?: string;
  preferred_language: string;
  theme_preference: string;
  parichay_id?: string;
  onboarding_completed: boolean;
  created_at: string;
  last_active_at: string;
}

export interface Role {
  id: string;
  name: string;
  name_hi?: string;
  cadre: string;
  department?: string;
  provenance: ProvenanceType;
  created_at: string;
}

export interface Activity {
  id: string;
  role_id: string;
  name: string;
  name_hi?: string;
  description?: string;
  provenance: ProvenanceType;
  created_at: string;
}

export interface Competency {
  id: string;
  name: string;
  name_hi?: string;
  category: CompetencyCategory;
  description?: string;
  description_hi?: string;
  levels: {
    L1: string;
    L2: string;
    L3: string;
    L4: string;
    L5: string;
  };
  provenance: ProvenanceType;
  created_at: string;
}

export interface ActivityCompetency {
  id: string;
  activity_id: string;
  competency_id: string;
  target_level: number;
  priority: ActivityPriority;
  created_at: string;
}

export interface CompetencyRecord {
  id: string;
  user_id: string;
  competency_id: string;
  organization_id: string;
  current_level: number;
  evidence?: string;
  updated_at: string;
}

export interface CompetencyHistory {
  id: string;
  user_id: string;
  competency_id: string;
  level: number;
  source: string;
  organization_id: string;
  recorded_at: string;
}

export interface Document {
  id: string;
  trainer_id: string;
  organization_id: string;
  title: string;
  file_type: string;
  storage_key: string;
  storage_provider: string;
  file_size_bytes?: number;
  page_count?: number;
  status: DocumentStatus;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Question {
  id: string;
  document_id?: string;
  competency_id: string;
  organization_id: string;
  stem: string;
  stem_hi?: string;
  options: Array<{ text: string; text_hi?: string }>;
  correct_index: number;
  explanation?: string;
  explanation_hi?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  confidence?: QuestionConfidence;
  status: QuestionStatus;
  reviewed_by?: string;
  source_ref?: string;
  topic?: string;
  ai_provider?: string;
  prompt_version?: string;
  flag_count: number;
  error_rate?: number;
  provenance: ProvenanceType;
  created_at: string;
  reviewed_at?: string;
}

export interface Assessment {
  id: string;
  competency_id?: string;
  organization_id: string;
  type: AssessmentType;
  question_ids: string[];
  time_limit_minutes: number;
  created_at: string;
}

export interface AssessmentResult {
  id: string;
  local_id: string;
  user_id: string;
  assessment_id: string;
  organization_id: string;
  answers: Record<string, number>;
  score: number;
  topic_scores?: Record<string, number>;
  triggered_by?: {
    type: 'diagnostic' | 'post-course' | 'retake';
    courseId?: string;
  };
  completed_at: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  title_hi?: string;
  provider: CourseProvider;
  type: string;
  duration_hours?: number;
  competency_ids?: string[];
  difficulty?: string;
  prerequisites?: string[];
  description?: string;
  description_hi?: string;
  igot_url?: string;
  karma_points: number;
  provenance: ProvenanceType;
  created_at: string;
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  organization_id: string;
  status: EnrollmentStatus;
  karma_points_earned: number;
  enrolled_at: string;
  completed_at?: string;
}

export interface TrainingPriority {
  id: string;
  organization_id: string;
  department: string;
  role_id?: string;
  reason?: string;
  flagged_by: string;
  flagged_at: string;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  prompt_version?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  organization_id: string;
  type: string;
  title: string;
  body?: string;
  read: boolean;
  data?: Record<string, unknown>;
  created_at: string;
}

// ============================================================================
// DOMAIN MODELS (Application-level types)
// ============================================================================

export interface CompetencyGap {
  competencyId: string;
  competency: Competency;
  activity: Activity;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  priority: ActivityPriority;
  severity: SeverityBucket;
  evidenceType: 'self-assessed' | 'assessment-verified';
}

export interface WorkforceReadinessProfile {
  userId: string;
  user: User;
  selectedRole?: Role;
  competencies: CompetencyRecord[];
  readinessIndex: number;
  gaps: CompetencyGap[];
  lastAssessmentAt?: string;
}

export interface RecommendedCourse {
  course: Course;
  relevanceScore: number;
  why: string;
  prerequisites: Course[];
  nextSteps: Course[];
}

export interface AssessmentProgress {
  assessmentId: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  answers: Record<string, number>;
  timeRemainingSeconds: number;
  isOffline: boolean;
}

export interface OfflineQueueItem {
  localId: string;
  assessmentId: string;
  answers: Record<string, number>;
  startedAt: string;
  completedAt: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  attempts: number;
  lastAttemptAt?: string;
}

export interface ProvenanceBadgeProps {
  provenance: ProvenanceType;
  label?: string;
}

export interface DemoPersona {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization_id: string;
  cadre: string;
  designation: string;
  preferred_language: string;
  department: string;
}

// ============================================================================
// ADMIN INTELLIGENCE TYPES
// ============================================================================

export interface SurveyScrutinyDataPoint {
  id: string;
  departmentCode: string; // e.g. "FOD-UP-E", "FOD-KL"
  departmentName: string; // e.g. "FOD Uttar Pradesh East", "FOD Kerala"
  competencyLevel: number; // 1 to 5 (L1 - L5)
  errorRatePercent: number; // e.g. 18.4, 4.2
  sampleSize: number; // e.g. 450 schedules audited
}

export interface OutcomeCorrelationSeries {
  id: string;
  metricName: string;
  metricNameHi: string;
  competencyId: string;
  competencyName: string;
  yAxisLabel: string;
  yAxisLabelHi: string;
  xAxisLabel: string;
  xAxisLabelHi: string;
  regressionSlope: number; // e.g. -3.2 (% error reduction per competency level)
  pValue: number; // e.g. 0.008
  rSquared: number; // e.g. 0.89
  narrativeInsight: string;
  narrativeInsightHi: string;
  methodologyNote: string;
  provenance: ProvenanceType; // strictly 'SYNTHETIC_DEMO_DATA'
  dataPoints: SurveyScrutinyDataPoint[];
}

export interface DepartmentSummary {
  department: string;
  officialCount: number;
  avgReadiness: number; // 0 - 100
  criticalGapCount: number;
  trendDirection: 'up' | 'down' | 'stable';
  isPriorityFlagged: boolean;
}

export interface WorkforceOverview {
  totalOfficials: number;
  avgReadiness: number;
  criticalGaps: number;
  trendDirection: 'up' | 'down' | 'stable';
  activePrioritiesCount: number;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface GetGapsResponse {
  gaps: CompetencyGap[];
  readinessIndex: number;
}

export interface SubmitAssessmentRequest {
  localId: string;
  assessmentId: string;
  answers: Record<string, number>;
  completedAt: string;
}

export interface SubmitAssessmentResponse {
  success: boolean;
  score: number;
  competencyUpdates: Array<{
    competencyId: string;
    oldLevel: number;
    newLevel: number;
  }>;
}

export interface GenerateQuestionsRequest {
  documentId: string;
  count: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  competencyId: string;
}

export interface GenerateQuestionsResponse {
  jobId: string;
  questions: Question[];
  confidence: Record<string, QuestionConfidence>;
}

export interface FlagDepartmentRequest {
  department: string;
  roleId?: string;
  reason: string;
}

export interface FlagDepartmentResponse {
  priorityId: string;
  createdAt: string;
}
