import { cookies } from 'next/headers';
import { getStudentByUid } from '@/actions/student-actions';
import { getAssignments } from '@/actions/assignment-actions';
import { StatCard } from '@/components/common/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User, Calendar, CreditCard, Trophy } from 'lucide-react';
import Link from 'next/link';

export default async function StudentDashboardOverview() {
  const cookieStore = await cookies();
  const uid = cookieStore.get('atmms_student_uid')?.value || 'ATM2026-001';

  const student = await getStudentByUid(uid);
  const studentName = student?.name || 'Aarav Sharma';
  const teamName = student?.team?.name || 'Ruby Royals';
  const teamColor = student?.team?.color || '#EF4444';
  const category = student?.category || 'JUNIOR';

  return (
    <div className="space-y-8">
      {/* Profile Welcome Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-2xl border-2 border-white/20 shadow-inner"
            style={{ backgroundColor: teamColor }}
          >
            {uid.slice(-3)}
          </div>
          <div>
            <h1 className="text-2xl font-black">{studentName}</h1>
            <p className="text-xs text-blue-200 font-mono">UID: {uid} • Category: {category}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold">
              Team: {teamName}
            </div>
          </div>
        </div>

        <Link href="/student/id-card">
          <Button className="bg-white text-blue-900 hover:bg-blue-50 font-bold shadow-md">
            <CreditCard className="w-4 h-4 mr-2" /> Download ID Card
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" /> Event Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-muted-foreground">View venues and time slots for your registered events.</p>
            <Link href="/student/programmes">
              <Button variant="outline" size="sm" className="w-full mt-2">View Events</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Published Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-muted-foreground">Check official winner lists and team score updates.</p>
            <Link href="/student/results">
              <Button variant="outline" size="sm" className="w-full mt-2">View Results</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" /> Printable Delegate Badge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-muted-foreground">Generate high-res PDF ID Card with verified QR code.</p>
            <Link href="/student/id-card">
              <Button variant="outline" size="sm" className="w-full mt-2">Generate PDF</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
