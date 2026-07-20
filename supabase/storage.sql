-- Storage Buckets Configuration & Access Policies for ATMMS

INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('student-photos', 'student-photos', true),
    ('team-logos', 'team-logos', true),
    ('documents', 'documents', true),
    ('reports', 'reports', true),
    ('id-cards', 'id-cards', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Bucket Storage Policies
CREATE POLICY "Public Read Student Photos" ON storage.objects FOR SELECT USING (bucket_id = 'student-photos');
CREATE POLICY "Authenticated Upload Student Photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'student-photos');
CREATE POLICY "Authenticated Update Student Photos" ON storage.objects FOR UPDATE USING (bucket_id = 'student-photos');

CREATE POLICY "Public Read Team Logos" ON storage.objects FOR SELECT USING (bucket_id = 'team-logos');
CREATE POLICY "Authenticated Upload Team Logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'team-logos');

CREATE POLICY "Public Read Public Documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Authenticated Upload Documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Public Read Reports" ON storage.objects FOR SELECT USING (bucket_id = 'reports');
CREATE POLICY "Authenticated Upload Reports" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'reports');

CREATE POLICY "Public Read ID Cards" ON storage.objects FOR SELECT USING (bucket_id = 'id-cards');
CREATE POLICY "Authenticated Upload ID Cards" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'id-cards');
