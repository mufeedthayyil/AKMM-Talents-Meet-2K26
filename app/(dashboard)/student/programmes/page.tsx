import { getProgrammes, getSchedule } from '@/actions/programme-actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock } from 'lucide-react';

export default async function StudentProgrammesPage() {
  const [programmes, schedule] = await Promise.all([
    getProgrammes(),
    getSchedule(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Event Schedule & Catalog</h1>
        <p className="text-xs text-muted-foreground">
          View all scheduled talent competitions, venues, and stage details.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Programme Name</TableHead>
            <TableHead>Stage Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Points Tier</TableHead>
            <TableHead>Venue & Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programmes.map((p) => {
            const sc = schedule.find((s) => s.programme_id === p.id);
            return (
              <TableRow key={p.id}>
                <TableCell className="font-mono font-bold text-blue-600">{p.code}</TableCell>
                <TableCell className="font-semibold text-foreground">{p.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{p.type.replace('_', ' ')}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{p.category}</Badge>
                </TableCell>
                <TableCell className="font-bold text-xs">Cat {p.point_category}</TableCell>
                <TableCell className="text-xs">
                  {sc ? (
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 font-semibold">
                        <MapPin className="w-3 h-3 text-blue-600" /> {sc.venue}
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                        <Clock className="w-3 h-3" /> {sc.event_date} at {sc.event_time}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">Schedule Pending</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
