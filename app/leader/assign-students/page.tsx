'use client';

import { useState, useEffect } from 'react';
import { Student, Programme, Team, Assignment } from '@/types';
import { getTeams } from '@/actions/team-actions';
import { getStudents } from '@/actions/student-actions';
import { getProgrammes } from '@/actions/programme-actions';
import { getAssignments, cancelAssignment } from '@/actions/assignment-actions';
import { AssignmentForm } from '@/components/forms/assignment-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LeaderAssignStudentsPage() {
  const [team, setTeam] = useState<Team | undefined>(undefined);
  const [students, setStudents] = useState<Student[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const teams = await getTeams();
    const myTeam = teams[0];
    setTeam(myTeam);

    const [st, pr, as] = await Promise.all([
      getStudents({ team_id: myTeam?.id }),
      getProgrammes({ status: 'OPEN' }),
      getAssignments(myTeam?.id),
    ]);

    setStudents(st);
    setProgrammes(pr);
    setAssignments(as);
  }

  async function handleCancel(id: string) {
    if (!confirm('Are you sure you want to cancel this student registration?')) return;
    const res = await cancelAssignment(id);
    if (res.success) {
      toast.success(res.message);
      loadData();
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Student Event Registration</h1>
        <p className="text-xs text-muted-foreground">
          Register team delegates for open programmes. Automated validation enforces stage limits & category checks.
        </p>
      </div>

      {/* Registration Form */}
      <AssignmentForm
        students={students}
        programmes={programmes}
        team={team}
        onSuccess={loadData}
      />

      {/* Current Assignments Table */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-foreground">Current Team Registrations ({assignments.length})</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name & UID</TableHead>
              <TableHead>Programme</TableHead>
              <TableHead>Stage Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No registrations recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-bold text-xs">
                    {a.student?.name} <span className="font-mono text-blue-600">({a.student?.uid})</span>
                  </TableCell>
                  <TableCell className="font-semibold text-xs text-foreground">
                    {a.programme?.name} ({a.programme?.code})
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{a.programme?.type.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{a.programme?.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleCancel(a.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                    </Button>
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
