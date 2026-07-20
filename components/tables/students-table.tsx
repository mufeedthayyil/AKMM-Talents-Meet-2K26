'use client';

import { useState } from 'react';
import { Student, Team } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { exportToExcel, parseExcelFile, exportToCSV, generateStudentsPDF, generateIDCardsPDF } from '@/lib/export-utils';
import { bulkImportStudents } from '@/actions/student-actions';
import { Search, Download, Upload, CreditCard, FileSpreadsheet, Plus, Edit3, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface StudentsTableProps {
  initialStudents: Student[];
  teams: Team[];
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: string) => void;
  onAddClick?: () => void;
}

export function StudentsTable({ initialStudents, teams, onEdit, onDelete, onAddClick }: StudentsTableProps) {
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredStudents = initialStudents.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.uid.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = teamFilter === 'all' || s.team_id === teamFilter;
    const matchesCat = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesTeam && matchesCat;
  });

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await parseExcelFile(file);
      const res = await bulkImportStudents(data);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error('Failed to parse Excel file');
    }
  }

  function handleExcelExport() {
    const exportData = filteredStudents.map((s) => ({
      UID: s.uid,
      Name: s.name,
      Gender: s.gender,
      Category: s.category,
      Team: s.team?.name || 'N/A',
    }));
    exportToExcel(exportData, 'students_roster');
    toast.success('Students exported to Excel');
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-card p-4 border border-border rounded-xl">
        <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search name or UID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Team Filter */}
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold"
          >
            <option value="all">All Teams</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
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
          </select>

          {/* Export Excel */}
          <Button variant="outline" size="sm" onClick={handleExcelExport}>
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Export Excel
          </Button>

          {/* Generate PDF ID Cards */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateIDCardsPDF(filteredStudents, 3)}
          >
            <CreditCard className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Print ID Cards
          </Button>

          {/* Import Excel */}
          <label className="cursor-pointer">
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
            <span className="inline-flex items-center justify-center h-8 px-3 rounded-md text-xs font-medium border border-input bg-background hover:bg-accent">
              <Upload className="w-3.5 h-3.5 mr-1" />
              Import
            </span>
          </label>

          {onAddClick && (
            <Button size="sm" onClick={onAddClick}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Student
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UID</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Assigned Team</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No students found matching your filters.
              </TableCell>
            </TableRow>
          ) : (
            filteredStudents.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono font-bold text-blue-600">{s.uid}</TableCell>
                <TableCell className="font-semibold text-foreground">{s.name}</TableCell>
                <TableCell>{s.gender}</TableCell>
                <TableCell>
                  <Badge variant={s.category === 'JUNIOR' ? 'secondary' : 'default'}>
                    {s.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: s.team?.color || '#3B82F6' }}
                  >
                    {s.team?.name || 'Unassigned'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {onEdit && (
                      <Button variant="ghost" size="icon" onClick={() => onEdit(s)}>
                        <Edit3 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="ghost" size="icon" onClick={() => onDelete(s.id)}>
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
