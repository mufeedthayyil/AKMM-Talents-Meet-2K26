import { getResults } from '@/actions/result-actions';
import { getTeams } from '@/actions/team-actions';
import { LeaderboardChart } from '@/components/charts/leaderboard-chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default async function LeaderResultsPage() {
  const [results, teams] = await Promise.all([
    getResults(true), // Only published results
    getTeams(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Live Leaderboard & Published Results</h1>
        <p className="text-xs text-muted-foreground">
          Track official point standings and event winners updated in real-time.
        </p>
      </div>

      <LeaderboardChart teams={teams} />

      <div className="space-y-3">
        <h3 className="font-bold text-base">Published Winners Sheet</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Programme</TableHead>
              <TableHead>🥇 1st Place</TableHead>
              <TableHead>🥈 2nd Place</TableHead>
              <TableHead>🥉 3rd Place</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No published results yet. Check back soon!
                </TableCell>
              </TableRow>
            ) : (
              results.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-bold text-foreground">{r.programme?.name}</TableCell>
                  <TableCell className="text-xs font-semibold text-amber-600">
                    {r.first_place_student?.name} ({r.first_place_team?.name})
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-slate-600">
                    {r.second_place_student?.name} ({r.second_place_team?.name})
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-amber-800">
                    {r.third_place_student?.name} ({r.third_place_team?.name})
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
