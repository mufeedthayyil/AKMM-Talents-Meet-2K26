import { StatCard } from '@/components/common/stat-card';
import { LeaderboardChart } from '@/components/charts/leaderboard-chart';
import { getTeams } from '@/actions/team-actions';
import { getStudents } from '@/actions/student-actions';
import { getProgrammes } from '@/actions/programme-actions';
import { getAppeals } from '@/actions/appeal-actions';
import { Users, Shield, GraduationCap, AlertCircle, Trophy, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AdminDashboardOverview() {
  const [teams, students, programmes, appeals] = await Promise.all([
    getTeams(),
    getStudents(),
    getProgrammes(),
    getAppeals(),
  ]);

  const pendingAppeals = appeals.filter((a) => a.status === 'PENDING').length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">Admin Master Dashboard</h1>
        <p className="text-xs text-muted-foreground">
          Real-time oversight for AKMM College Talents Meet 2026.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Registered Students" value={students.length} icon={Users} description="Active delegates" />
        <StatCard title="Competing Teams" value={teams.length} icon={Shield} description="Ruby, Sapphire, Emerald, Diamond" />
        <StatCard title="Events & Programmes" value={programmes.length} icon={GraduationCap} description="On & Off stage events" />
        <StatCard title="Pending Appeals" value={pendingAppeals} icon={AlertCircle} description="Requires evaluation" />
      </div>

      {/* Leaderboard & Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <LeaderboardChart teams={teams} />
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Quick Administrative Actions
            </h3>

            <div className="space-y-2">
              <Link href="/admin/results" className="block">
                <Button className="w-full justify-start font-semibold bg-blue-600 hover:bg-blue-700">
                  <Trophy className="w-4 h-4 mr-2" />
                  Publish Event Results
                </Button>
              </Link>

              <Link href="/admin/students" className="block">
                <Button variant="outline" className="w-full justify-start font-semibold">
                  <Users className="w-4 h-4 mr-2 text-blue-600" />
                  Manage Students & Import Excel
                </Button>
              </Link>

              <Link href="/admin/appeals" className="block">
                <Button variant="outline" className="w-full justify-start font-semibold">
                  <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
                  Resolve Pending Appeals ({pendingAppeals})
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
