import { getResults } from '@/actions/result-actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default async function StudentResultsPage() {
  const results = await getResults(true); // Only published results

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Official Published Results</h1>
        <p className="text-xs text-muted-foreground">
          View winners for evaluated competitions.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Programme</TableHead>
            <TableHead>🥇 1st Place (Winner)</TableHead>
            <TableHead>🥈 2nd Place</TableHead>
            <TableHead>🥉 3rd Place</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No results published yet.
              </TableCell>
            </TableRow>
          ) : (
            results.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-bold text-foreground">{r.programme?.name}</TableCell>
                <TableCell className="text-xs font-bold text-amber-600">
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
  );
}
