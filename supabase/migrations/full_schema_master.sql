-- ==============================================================================
-- STATVIDYA MASTER DATABASE SCHEMA FOR SUPABASE
-- Consolidated Production Migration Script
-- ==============================================================================

-- 1. EXTENSIONS & SCHEMAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ORGANIZATIONS
CREATE TABLE IF NOT EXISTS public.organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_hi TEXT,
    code TEXT NOT NULL UNIQUE,
    type TEXT CHECK (type IN ('ministry', 'department', 'subordinate_office', 'autonomous')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    full_name_hi TEXT,
    role TEXT NOT NULL DEFAULT 'learner' CHECK (role IN ('learner', 'trainer', 'admin')),
    organization_id TEXT REFERENCES public.organizations(id) ON DELETE SET NULL,
    cadre TEXT DEFAULT 'NSSO (FOD)',
    designation TEXT DEFAULT 'Field Investigator',
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi')),
    readiness_index INT DEFAULT 65 CHECK (readiness_index BETWEEN 0 AND 100),
    karma_points INT DEFAULT 120,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COMPETENCIES (FRAC Framework)
CREATE TABLE IF NOT EXISTS public.competencies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_hi TEXT,
    category TEXT NOT NULL CHECK (category IN ('Domain', 'Functional', 'Behavioral')),
    description TEXT,
    target_level INT DEFAULT 3 CHECK (target_level BETWEEN 1 AND 5),
    weight INT DEFAULT 2 CHECK (weight BETWEEN 1 AND 3), -- 3=Critical, 2=Important, 1=Desirable
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER COMPETENCIES
CREATE TABLE IF NOT EXISTS public.user_competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    competency_id TEXT NOT NULL REFERENCES public.competencies(id) ON DELETE CASCADE,
    current_level INT DEFAULT 1 CHECK (current_level BETWEEN 0 AND 5),
    target_level INT DEFAULT 3 CHECK (target_level BETWEEN 1 AND 5),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, competency_id)
);

-- 6. ASSESSMENTS & SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.assessments (
    id TEXT PRIMARY KEY,
    competency_id TEXT NOT NULL REFERENCES public.competencies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_hi TEXT,
    total_questions INT DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    local_id TEXT UNIQUE, -- For idempotent offline sync from IndexedDB
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assessment_id TEXT REFERENCES public.assessments(id) ON DELETE SET NULL,
    competency_id TEXT NOT NULL REFERENCES public.competencies(id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
    achieved_level INT NOT NULL CHECK (achieved_level BETWEEN 1 AND 5),
    stage_reached TEXT DEFAULT 'L3_MASTERED',
    questions_answered INT DEFAULT 10,
    time_spent_seconds INT DEFAULT 300,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. IGOT COURSES & ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.igot_courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_hi TEXT,
    provider TEXT DEFAULT 'iGOT Karmayogi',
    duration_mins INT DEFAULT 120,
    competency_id TEXT REFERENCES public.competencies(id) ON DELETE CASCADE,
    target_level INT DEFAULT 3,
    url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.igot_courses(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed')),
    progress_percent INT DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- 8. DOCUMENTS (Cloudflare R2 Storage Mapping)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    file_name TEXT NOT NULL,
    r2_key TEXT NOT NULL, -- Cloudflare R2 object key
    r2_url TEXT NOT NULL, -- Cloudflare R2 public / CDN URL
    file_size_bytes BIGINT NOT NULL,
    mime_type TEXT DEFAULT 'application/pdf',
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    organization_id TEXT REFERENCES public.organizations(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'processed' CHECK (status IN ('uploading', 'processing', 'processed', 'error')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. MCQ BANK
CREATE TABLE IF NOT EXISTS public.mcq_bank (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    competency_id TEXT REFERENCES public.competencies(id) ON DELETE CASCADE,
    question_en TEXT NOT NULL,
    question_hi TEXT,
    options_json JSONB NOT NULL,
    correct_answer_index INT NOT NULL,
    explanation TEXT,
    confidence_score NUMERIC(3,2) DEFAULT 0.85, -- AI confidence rating
    status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. DEPARTMENT FLAGS (Admin Write-Back Actions)
CREATE TABLE IF NOT EXISTS public.department_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    department_name TEXT NOT NULL,
    target_competency_id TEXT REFERENCES public.competencies(id) ON DELETE CASCADE,
    flagged_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    priority TEXT DEFAULT 'High' CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'in_progress', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR INSTANT QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_org ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_comp_user ON public.user_competencies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_comp_competency ON public.user_competencies(competency_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON public.assessment_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_local_id ON public.assessment_submissions(local_id);
CREATE INDEX IF NOT EXISTS idx_documents_org ON public.documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_mcq_status ON public.mcq_bank(status);
CREATE INDEX IF NOT EXISTS idx_dept_flags_org ON public.department_flags(organization_id);

-- ==============================================================================
-- AUTOMATED USER TRIGGER (Creates profile automatically on Supabase auth signup)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        organization_id,
        preferred_language
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'StatVidya User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'learner'),
        COALESCE(NEW.raw_user_meta_data->>'organization_id', 'org-mospi'),
        COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.igot_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcq_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_flags ENABLE ROW LEVEL SECURITY;

-- Read policies for general catalog
CREATE POLICY "Public competencies read" ON public.competencies FOR SELECT USING (true);
CREATE POLICY "Public organizations read" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Public assessments read" ON public.assessments FOR SELECT USING (true);
CREATE POLICY "Public courses read" ON public.igot_courses FOR SELECT USING (true);

-- User-scoped policies
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users read own competencies" ON public.user_competencies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own competencies" ON public.user_competencies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own competencies" ON public.user_competencies FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own submissions" ON public.assessment_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own submissions" ON public.assessment_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own enrollments" ON public.course_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert/update own enrollments" ON public.course_enrollments FOR ALL USING (auth.uid() = user_id);

-- Document RLS policies
CREATE POLICY "Documents read by org members" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Trainers and Admins upload documents" ON public.documents FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('trainer', 'admin')
    )
);

-- Admin Department Flags
CREATE POLICY "Flags read by tenant" ON public.department_flags FOR SELECT USING (true);
CREATE POLICY "Admins manage flags" ON public.department_flags FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================
INSERT INTO public.organizations (id, name, name_hi, code, type) VALUES
('org-mospi', 'Ministry of Statistics and Programme Implementation', 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय', 'MoSPI', 'ministry'),
('org-nsso', 'National Sample Survey Office (FOD)', 'राष्ट्रीय प्रतिदर्श सर्वेक्षण कार्यालय', 'NSSO', 'subordinate_office'),
('org-cso', 'Central Statistics Office', 'केंद्रीय सांख्यिकी कार्यालय', 'CSO', 'subordinate_office')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.competencies (id, name, name_hi, category, description, target_level, weight) VALUES
('comp-capi', 'CAPI Tablet Operation', 'कैपी टैबलेट संचालन', 'Domain', 'Operational mastery of Computer Assisted Personal Interviewing tablets and sync', 3, 3),
('comp-nsso', 'NSSO Protocol Mastery', 'एनएसएसओ प्रोटोकॉल निपुणता', 'Domain', 'Adherence to MoSPI survey protocols and field sampling standards', 4, 3),
('comp-survey', 'Survey Sampling & Design', 'सर्वेक्षण नमूनाकरण और डिज़ाइन', 'Functional', 'Understanding stratified multistage sampling techniques', 3, 2),
('comp-data', 'Data Entry & Scrutiny', 'डेटा प्रविष्टि और जांच', 'Functional', 'Data verification, outlier detection, and error correction', 4, 2),
('comp-teamwork', 'Teamwork & Collaboration', 'टीम वर्क और सहयोग', 'Behavioral', 'Cross-functional coordination in field operations', 3, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.igot_courses (id, title, title_hi, provider, duration_mins, competency_id, target_level, url) VALUES
('course-capi-101', 'CAPI Field Operations & Diagnostics', 'कैपी फील्ड ऑपरेशंस और डायग्नोस्टिक्स', 'iGOT Karmayogi', 90, 'comp-capi', 3, 'https://igotkarmayogi.gov.in/course-capi-101'),
('course-nsso-201', 'NSSO Standard Survey Protocol L3', 'एनएसएसओ मानक सर्वेक्षण प्रोटोकॉल L3', 'iGOT Karmayogi', 120, 'comp-nsso', 4, 'https://igotkarmayogi.gov.in/course-nsso-201'),
('course-data-301', 'Data Scrutiny & Validation in Field Surveys', 'क्षेत्रीय सर्वेक्षणों में डेटा जांच और सत्यापन', 'iGOT Karmayogi', 60, 'comp-data', 4, 'https://igotkarmayogi.gov.in/course-data-301')
ON CONFLICT (id) DO NOTHING;
