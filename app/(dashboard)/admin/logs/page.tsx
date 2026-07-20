import { getLogs } from '@/actions/report-actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity } from 'lucide-react';

export default async function AdminLogsPage() {
  const logs = await getLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-600" />
          Audit Trail & Activity Logs
        </h1>
        <p className="text-xs text-muted-foreground">
          Track system activities, logins, result updates, and administrative modifications.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>User</TableHead>
            <TableHead>IP Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No recent activity recorded.
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs">{new Date(log.created_at).toLocaleString()}</TableCell>
                <TableCell className="font-semibold text-xs text-blue-600">{log.action}</TableCell>
                <TableCell className="text-xs">{log.entity} ({log.entity_id || 'N/A'})</TableCell>
                <TableCell className="text-xs">{log.user?.full_name || 'System Auto'}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{log.ip_address || '127.0.0.1'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
