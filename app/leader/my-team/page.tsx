import { getTeams } from '@/actions/team-actions';
import { getStudents } from '@/actions/student-actions';
import { StudentsTable } from '@/components/tables/students-table';

export default async function LeaderMyTeamPage() {
  const teams = await getTeams();
  const myTeam = teams[0];
  const students = await getStudents({ team_id: myTeam?.id });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">{myTeam?.name || 'My Team'} Roster</h1>
        <p className="text-xs text-muted-foreground">
          View all registered delegates under your team.
        </p>
      </div>

      <StudentsTable initialStudents={students} teams={teams} />
    </div>
  );
}
