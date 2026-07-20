-- AKMM Talents Meet Management System (ATMMS) Database Schema
-- Supabase PostgreSQL SQL DDL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enum Types
CREATE TYPE user_role AS ENUM ('ADMIN', 'LEADER', 'ASSISTANT', 'STUDENT');
CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE student_category AS ENUM ('JUNIOR', 'SENIOR');
CREATE TYPE programme_type AS ENUM ('ON_STAGE', 'OFF_STAGE');
CREATE TYPE programme_category AS ENUM ('JUNIOR', 'SENIOR', 'GENERAL');
CREATE TYPE point_category AS ENUM ('A', 'B');
CREATE TYPE programme_status AS ENUM ('OPEN', 'LOCKED');
CREATE TYPE result_status AS ENUM ('DRAFT', 'PUBLISHED');
CREATE TYPE appeal_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
CREATE TYPE document_visibility AS ENUM ('ADMIN', 'LEADER', 'STUDENT', 'PUBLIC');

-- 1. TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    color VARCHAR(30) NOT NULL DEFAULT '#3B82F6',
    logo_url TEXT,
    leader_id UUID,
    assistant_id UUID,
    total_points INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'STUDENT',
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add Foreign keys to Teams for Leader & Assistant
ALTER TABLE public.teams 
    ADD CONSTRAINT fk_teams_leader FOREIGN KEY (leader_id) REFERENCES public.users(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_teams_assistant FOREIGN KEY (assistant_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- 3. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    gender gender_type NOT NULL DEFAULT 'MALE',
    category student_category NOT NULL,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PROGRAMMES TABLE
CREATE TABLE IF NOT EXISTS public.programmes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type programme_type NOT NULL,
    category programme_category NOT NULL,
    point_category point_category NOT NULL DEFAULT 'A',
    max_participants_per_team INT NOT NULL DEFAULT 1,
    status programme_status NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SCHEDULE TABLE
CREATE TABLE IF NOT EXISTS public.schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    programme_id UUID NOT NULL REFERENCES public.programmes(id) ON DELETE CASCADE,
    venue VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    round VARCHAR(100) NOT NULL DEFAULT 'Finals',
    judges TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    programme_id UUID NOT NULL REFERENCES public.programmes(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, programme_id)
);

-- 7. RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    programme_id UUID NOT NULL UNIQUE REFERENCES public.programmes(id) ON DELETE CASCADE,
    first_place_student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    second_place_student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    third_place_student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    first_place_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    second_place_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    third_place_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    status result_status NOT NULL DEFAULT 'DRAFT',
    remarks TEXT,
    published_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. APPEALS TABLE
CREATE TABLE IF NOT EXISTS public.appeals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    programme_id UUID NOT NULL REFERENCES public.programmes(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    submitted_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    proof_url TEXT,
    status appeal_status NOT NULL DEFAULT 'PENDING',
    admin_response TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_size INT NOT NULL DEFAULT 0,
    file_type VARCHAR(100) NOT NULL DEFAULT 'application/pdf',
    visibility document_visibility NOT NULL DEFAULT 'PUBLIC',
    download_count INT NOT NULL DEFAULT 0,
    uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. LOGS TABLE
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================
-- INDEXES FOR OPTIMIZED QUERY PERFORMANCE
-- ====================================================
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_team ON public.users(team_id);
CREATE INDEX IF NOT EXISTS idx_students_uid ON public.students(uid);
CREATE INDEX IF NOT EXISTS idx_students_team ON public.students(team_id);
CREATE INDEX IF NOT EXISTS idx_students_category ON public.students(category);
CREATE INDEX IF NOT EXISTS idx_programmes_code ON public.programmes(code);
CREATE INDEX IF NOT EXISTS idx_programmes_category ON public.programmes(category);
CREATE INDEX IF NOT EXISTS idx_assignments_student ON public.assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_programme ON public.assignments(programme_id);
CREATE INDEX IF NOT EXISTS idx_assignments_team ON public.assignments(team_id);
CREATE INDEX IF NOT EXISTS idx_results_programme ON public.results(programme_id);
CREATE INDEX IF NOT EXISTS idx_appeals_team ON public.appeals(team_id);

-- ====================================================
-- VIEWS
-- ====================================================

-- Leaderboard View
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
    t.id AS team_id,
    t.name AS team_name,
    t.code AS team_code,
    t.color AS team_color,
    t.logo_url,
    t.total_points,
    COUNT(s.id) AS total_students,
    RANK() OVER (ORDER BY t.total_points DESC) AS rank
FROM public.teams t
LEFT JOIN public.students s ON s.team_id = t.id
GROUP BY t.id, t.name, t.code, t.color, t.logo_url, t.total_points;

-- ====================================================
-- FUNCTIONS & TRIGGERS (POINTS RECALCULATION)
-- ====================================================

CREATE OR REPLACE FUNCTION public.recalculate_team_points()
RETURNS TRIGGER AS $$
DECLARE
    rec RECORD;
    p_cat point_category;
    pts_1st INT;
    pts_2nd INT;
    pts_3rd INT;
BEGIN
    -- Reset total points for all teams
    UPDATE public.teams SET total_points = 0;

    -- Iterate published results
    FOR rec IN 
        SELECT r.*, p.point_category 
        FROM public.results r
        JOIN public.programmes p ON p.id = r.programme_id
        WHERE r.status = 'PUBLISHED'
    LOOP
        -- Determine point scale (Cat A vs Cat B)
        IF rec.point_category = 'A' THEN
            pts_1st := 7;
            pts_2nd := 5;
            pts_3rd := 3;
        ELSE
            pts_1st := 20;
            pts_2nd := 10;
            pts_3rd := 5;
        END IF;

        -- Award 1st place team points
        IF rec.first_place_team_id IS NOT NULL THEN
            UPDATE public.teams SET total_points = total_points + pts_1st WHERE id = rec.first_place_team_id;
        END IF;

        -- Award 2nd place team points
        IF rec.second_place_team_id IS NOT NULL THEN
            UPDATE public.teams SET total_points = total_points + pts_2nd WHERE id = rec.second_place_team_id;
        END IF;

        -- Award 3rd place team points
        IF rec.third_place_team_id IS NOT NULL THEN
            UPDATE public.teams SET total_points = total_points + pts_3rd WHERE id = rec.third_place_team_id;
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute recalculate_team_points after result changes
DROP TRIGGER IF EXISTS trigger_recalculate_points ON public.results;
CREATE TRIGGER trigger_recalculate_points
AFTER INSERT OR UPDATE OR DELETE ON public.results
FOR EACH STATEMENT EXECUTE FUNCTION public.recalculate_team_points();

-- Updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_teams_updated BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_students_updated BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_programmes_updated BEFORE UPDATE ON public.programmes FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_schedule_updated BEFORE UPDATE ON public.schedule FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_results_updated BEFORE UPDATE ON public.results FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_appeals_updated BEFORE UPDATE ON public.appeals FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

-- ====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appeals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Public/Authenticated read policies for Teams, Programmes, Schedule, Published Results
CREATE POLICY "Public can view teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Public can view programmes" ON public.programmes FOR SELECT USING (true);
CREATE POLICY "Public can view schedule" ON public.schedule FOR SELECT USING (true);
CREATE POLICY "Public can view published results" ON public.results FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public can view public documents" ON public.documents FOR SELECT USING (visibility = 'PUBLIC');

-- Admin full access policy helper
CREATE POLICY "Admin full access on teams" ON public.teams FOR ALL USING (true);
CREATE POLICY "Admin full access on users" ON public.users FOR ALL USING (true);
CREATE POLICY "Admin full access on students" ON public.students FOR ALL USING (true);
CREATE POLICY "Admin full access on programmes" ON public.programmes FOR ALL USING (true);
CREATE POLICY "Admin full access on schedule" ON public.schedule FOR ALL USING (true);
CREATE POLICY "Admin full access on assignments" ON public.assignments FOR ALL USING (true);
CREATE POLICY "Admin full access on results" ON public.results FOR ALL USING (true);
CREATE POLICY "Admin full access on appeals" ON public.appeals FOR ALL USING (true);
CREATE POLICY "Admin full access on documents" ON public.documents FOR ALL USING (true);
CREATE POLICY "Admin full access on settings" ON public.settings FOR ALL USING (true);
CREATE POLICY "Admin full access on logs" ON public.logs FOR ALL USING (true);
