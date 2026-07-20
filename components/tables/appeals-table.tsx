'use client';

import { useState } from 'react';
import { Appeal } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { resolveAppeal } from '@/actions/appeal-actions';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface AppealsTableProps {
  appeals: Appeal[];
  isAdmin?: boolean;
}

export function AppealsTable({ appeals, isAdmin = false }: AppealsTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleResolve(id: string, status: 'ACCEPTED' | 'REJECTED') {
    const adminResponse = prompt(`Enter official decision response for this appeal:`);
    if (adminResponse === null) return;

    setLoadingId(id);
    try {
      const res = await resolveAppeal(id, status, adminResponse);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error('Failed to resolve appeal');
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Programme</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Title & Description</TableHead>
          <TableHead>Proof</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Admin Decision</TableHead>
          {isAdmin && <TableHead className="text-right">Action</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {appeals.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
              No official appeals lodged yet.
            </TableCell>
          </TableRow>
        ) : (
          appeals.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-bold text-foreground">
                {a.programme?.name || 'N/A'}
              </TableCell>
              <TableCell>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: a.team?.color || '#3B82F6' }}
                >
                  {a.team?.name || 'N/A'}
                </span>
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="font-semibold text-xs text-foreground">{a.title}</p>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{a.description}</p>
              </TableCell>
              <TableCell>
                {a.proof_url ? (
                  <a
                    href={a.proof_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 underline flex items-center gap-1"
                  >
                    View Proof <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">None</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    a.status === 'ACCEPTED'
                      ? 'success'
                      : a.status === 'REJECTED'
                      ? 'destructive'
                      : 'warning'
                  }
                >
                  {a.status}
                </Badge>
              </TableCell>
              <TableCell className="text-xs italic text-muted-foreground">
                {a.admin_response || 'Pending evaluation...'}
              </TableCell>
              {isAdmin && (
                <TableCell className="text-right">
                  {a.status === 'PENDING' ? (
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                        disabled={loadingId === a.id}
                        onClick={() => handleResolve(a.id, 'ACCEPTED')}
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        disabled={loadingId === a.id}
                        onClick={() => handleResolve(a.id, 'REJECTED')}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Resolved</span>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
