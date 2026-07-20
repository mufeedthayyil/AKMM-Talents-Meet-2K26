-- Seed Data for AKMM Talents Meet Management System

-- 1. SEED 4 MANDATORY TEAMS
INSERT INTO public.teams (id, name, code, color, logo_url, total_points)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Ruby Royals', 'RUBY', '#EF4444', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150', 0),
    ('22222222-2222-2222-2222-222222222222', 'Sapphire Knights', 'SAPH', '#3B82F6', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150', 0),
    ('33333333-3333-3333-3333-333333333333', 'Emerald Titans', 'EMLD', '#10B981', 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150', 0),
    ('44444444-4444-4444-4444-444444444444', 'Diamond Eagles', 'DMND', '#8B5CF6', 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150', 0)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

-- 2. SEED SYSTEM SETTINGS
INSERT INTO public.settings (key, value)
VALUES 
    ('event_info', '{"title": "AKMM Annual Talents Meet 2026", "college_name": "AKMM College of Excellence", "academic_year": "2025-2026", "venue": "Main Campus Auditorium", "start_date": "2026-08-10", "end_date": "2026-08-12"}'::jsonb),
    ('assignment_limits', '{"junior_on_stage": 4, "junior_off_stage": 5, "senior_on_stage": 4, "senior_off_stage": 5, "general_on_stage": 2, "general_off_stage": 2}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 3. SEED PROGRAMMES
INSERT INTO public.programmes (id, code, name, type, category, point_category, max_participants_per_team, status)
VALUES 
    ('p1000000-0000-0000-0000-000000000001', 'P101', 'Solo Light Music', 'ON_STAGE', 'JUNIOR', 'A', 1, 'OPEN'),
    ('p1000000-0000-0000-0000-000000000002', 'P102', 'Elocution English', 'ON_STAGE', 'SENIOR', 'A', 1, 'OPEN'),
    ('p1000000-0000-0000-0000-000000000003', 'P103', 'Group Dance Folk', 'ON_STAGE', 'GENERAL', 'B', 1, 'OPEN'),
    ('p1000000-0000-0000-0000-000000000004', 'P104', 'Pencil Drawing', 'OFF_STAGE', 'JUNIOR', 'A', 2, 'OPEN'),
    ('p1000000-0000-0000-0000-000000000005', 'P105', 'Essay Writing', 'OFF_STAGE', 'SENIOR', 'A', 2, 'OPEN'),
    ('p1000000-0000-0000-0000-000000000006', 'P106', 'Quiz Championship', 'OFF_STAGE', 'GENERAL', 'B', 1, 'OPEN')
ON CONFLICT (code) DO NOTHING;

-- 4. SEED SAMPLE STUDENTS
INSERT INTO public.students (id, uid, name, gender, category, team_id, photo_url)
VALUES
    ('s1000000-0000-0000-0000-000000000001', 'ATM2026-001', 'Aarav Sharma', 'MALE', 'JUNIOR', '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
    ('s1000000-0000-0000-0000-000000000002', 'ATM2026-002', 'Diya Patel', 'FEMALE', 'JUNIOR', '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'),
    ('s1000000-0000-0000-0000-000000000003', 'ATM2026-003', 'Rohan Verma', 'MALE', 'SENIOR', '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
    ('s1000000-0000-0000-0000-000000000004', 'ATM2026-004', 'Ananya Gupta', 'FEMALE', 'SENIOR', '33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
    ('s1000000-0000-0000-0000-000000000005', 'ATM2026-005', 'Vikram Singh', 'MALE', 'SENIOR', '44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150')
ON CONFLICT (uid) DO NOTHING;
