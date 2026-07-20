'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Student, Programme, Team } from '@/types';
import { assignStudentToProgramme } from '@/actions/assignment-actions';
import { UserCheck, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface AssignmentFormProps {
  students: Student[];
  programmes: Programme[];
  team?: Team;
  onSuccess?: () => void;
}

export function AssignmentForm({ students, programmes, team, onSuccess }: AssignmentFormProps) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedProgrammeId, setSelectedProgrammeId] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const selectedProgramme = programmes.find((p) => p.id === selectedProgrammeId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStudentId || !selectedProgrammeId) {
      toast.error('Please select both a student and a programme');
      return;
    }

    const targetTeamId = team?.id || selectedStudent?.team_id;
    if (!targetTeamId) {
      toast.error('Student must belong to a team');
      return;
    }

    setLoading(true);
    try {
      const res = await assignStudentToProgramme({
        student_id: selectedStudentId,
        programme_id: selectedProgrammeId,
        team_id: targetTeamId,
      });

      if (res.success) {
        toast.success(res.message);
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error('Failed to register student');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-border rounded-xl bg-card">
      <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
        <UserCheck className="w-4 h-4 text-blue-600" />
        New Student Programme Registration
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Student Select */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Select Student</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="">-- Choose Student --</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.uid}) - {s.category}
              </option>
            ))}
          </select>
        </div>

        {/* Programme Select */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Select Programme</label>
          <select
            value={selectedProgrammeId}
            onChange={(e) => setSelectedProgrammeId(e.target.value)}
            className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="">-- Choose Programme --</option>
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.code}] {p.name} ({p.category} | {p.type.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Realtime Validation Warning Helper */}
      {selectedStudent && selectedProgramme && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-xs text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>Rule Check:</strong> {selectedStudent.name} ({selectedStudent.category}) → {selectedProgramme.name} ({selectedProgramme.category}). Max {selectedProgramme.max_participants_per_team} participant(s) per team allowed.
          </div>
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full font-semibold">
        {loading ? 'Validating & Registering...' : 'Register Student for Event'}
      </Button>
    </form>
  );
}
