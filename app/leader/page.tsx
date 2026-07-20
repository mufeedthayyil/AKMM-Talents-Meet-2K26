import { getTeams } from '@/actions/team-actions';
import { getStudents } from '@/actions/student-actions';
import { getAssignments } from '@/actions/assignment-actions';
import { StatCard } from '@/components/common/stat-card';
import { LeaderboardChart } from '@/components/charts/leaderboard-chart';
import { Button } from '@/components/ui/button';
import { Shield, Users, UserCheck, Trophy } from 'lucide-react';
import Link from 'next/link';

export default async function LeaderDashboardOverview() {
  const teams = await getTeams();
  const myTeam = teams[0] || { name: 'Ruby Royals', code: 'RUBY', total_points: 120, color: '#EF4444' };
  
  const [students, assignments] = await Promise.all([
    getStudents({ team_id: myTeam.id }),
    getAssignments(myTeam.id),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: myTeam.color }} />
          {myTeam.name} Leader Portal
        </h1>
        <p className="text-xs text-muted-foreground">
          Manage event registrations, track points, and submit score appeals.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Team Points" value={myTeam.total_points} icon={Trophy} description="Championship Standing" />
        <StatCard title="Team Roster" value={students.length} icon={Users} description="Registered Delegates" />
        <StatCard title="Event Registrations" value={assignments.length} icon={UserCheck} description="Current Registrations" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <LeaderboardChart teams={teams} />
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-foreground">Team Leader Actions</h3>
          <div className="space-y-2">
            <Link href="/leader/assign-students" className="block">
              <Button className="w-full justify-start font-semibold bg-blue-600 hover:bg-blue-700">
                <UserCheck className="w-4 h-4 mr-2" />
                Register Students for Events
              </Button>
            </Link>

            <Link href="/leader/my-team" className="block">
              <Button variant="outline" className="w-full justify-start font-semibold">
                <Users className="w-4 h-4 mr-2 text-blue-600" />
                View Team Members
              </Button>
            </Link>

            <Link href="/leader/appeals" className="block">
              <Button variant="outline" className="w-full justify-start font-semibold">
                Lodge Official Appeal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
