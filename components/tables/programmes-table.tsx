'use client';

import { useState } from 'react';
import { Programme } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toggleProgrammeStatus } from '@/actions/programme-actions';
import { Search, Lock, Unlock, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface ProgrammesTableProps {
  initialProgrammes: Programme[];
  onAddClick?: () => void;
  isAdmin?: boolean;
}

export function ProgrammesTable({ initialProgrammes, onAddClick, isAdmin = false }: ProgrammesTableProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredProgrammes = initialProgrammes.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesType && matchesCat;
  });

  async function handleToggleStatus(id: string, currentStatus: string) {
    try {
      const res = await toggleProgrammeStatus(id, currentStatus);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error('Failed to update status');
    }
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-card p-4 border border-border rounded-xl">
        <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search programme name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Stage Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold"
          >
            <option value="all">All Stages</option>
            <option value="ON_STAGE">On Stage</option>
            <option value="OFF_STAGE">Off Stage</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold"
          >
            <option value="all">All Categories</option>
            <option value="JUNIOR">Junior</option>
            <option value="SENIOR">Senior</option>
            <option value="GENERAL">General</option>
          </select>

          {isAdmin && onAddClick && (
            <Button size="sm" onClick={onAddClick}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Programme
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Programme Name</TableHead>
            <TableHead>Stage Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Points Tier</TableHead>
            <TableHead>Max / Team</TableHead>
            <TableHead>Status</TableHead>
            {isAdmin && <TableHead className="text-right">Lock / Unlock</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProgrammes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No programmes found.
              </TableCell>
            </TableRow>
          ) : (
            filteredProgrammes.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono font-bold text-blue-600">{p.code}</TableCell>
                <TableCell className="font-semibold text-foreground">{p.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{p.type.replace('_', ' ')}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={p.category === 'GENERAL' ? 'warning' : 'secondary'}>
                    {p.category}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold text-xs">Category {p.point_category}</TableCell>
                <TableCell className="font-mono">{p.max_participants_per_team}</TableCell>
                <TableCell>
                  <Badge variant={p.status === 'OPEN' ? 'success' : 'destructive'}>
                    {p.status}
                  </Badge>
                </TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(p.id, p.status)}
                    >
                      {p.status === 'OPEN' ? (
                        <Lock className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Unlock className="w-4 h-4 text-emerald-500" />
                      )}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
