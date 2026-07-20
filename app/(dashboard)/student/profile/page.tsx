import { cookies } from 'next/headers';
import { getStudentByUid } from '@/actions/student-actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Shield, GraduationCap } from 'lucide-react';

export default async function StudentProfilePage() {
  const cookieStore = await cookies();
  const uid = cookieStore.get('atmms_student_uid')?.value || 'ATM2026-001';
  const student = await getStudentByUid(uid);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Student Delegate Profile</h1>
        <p className="text-xs text-muted-foreground">
          Official delegate details registered for AKMM Talents Meet 2026.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-extrabold text-3xl shadow-md"
            style={{ backgroundColor: student?.team?.color || '#3B82F6' }}
          >
            {uid.slice(-3)}
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-foreground">{student?.name || 'Aarav Sharma'}</h2>
            <p className="font-mono text-sm font-bold text-blue-600">UID: {uid}</p>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="secondary">{student?.category || 'JUNIOR'}</Badge>
              <Badge variant="outline">{student?.gender || 'MALE'}</Badge>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground font-semibold block uppercase">Assigned House Team</span>
            <span className="font-bold text-sm text-foreground">{student?.team?.name || 'Ruby Royals'}</span>
          </div>

          <div>
            <span className="text-muted-foreground font-semibold block uppercase">Team Code</span>
            <span className="font-bold text-sm font-mono">{student?.team?.code || 'RUBY'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
