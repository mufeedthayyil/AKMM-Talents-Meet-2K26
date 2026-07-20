'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Programme, Student, Team, Result } from '@/types';
import { upsertResult } from '@/actions/result-actions';
import { Trophy, CheckCircle, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ResultFormProps {
  programmes: Programme[];
  students: Student[];
  teams: Team[];
  existingResult?: Result;
  onSuccess?: () => void;
}

export function ResultForm({ programmes, students, teams, existingResult, onSuccess }: ResultFormProps) {
  const [selectedProgrammeId, setSelectedProgrammeId] = useState(existingResult?.programme_id || '');
  const [firstStudentId, setFirstStudentId] = useState(existingResult?.first_place_student_id || '');
  const [secondStudentId, setSecondStudentId] = useState(existingResult?.second_place_student_id || '');
  const [thirdStudentId, setThirdStudentId] = useState(existingResult?.third_place_student_id || '');
  const [remarks, setRemarks] = useState(existingResult?.remarks || '');
  const [loading, setLoading] = useState(false);

  async function handleSave(status: 'DRAFT' | 'PUBLISHED') {
    if (!selectedProgrammeId) {
      toast.error('Please select a programme');
      return;
    }

    setLoading(true);
    try {
      const payload: Partial<Result> = {
        id: existingResult?.id,
        programme_id: selectedProgrammeId,
        first_place_student_id: firstStudentId || undefined,
        second_place_student_id: secondStudentId || undefined,
        third_place_student_id: thirdStudentId || undefined,
        status,
        remarks,
      };

      const res = await upsertResult(payload);
      if (res.success) {
        toast.success(res.message);
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error('Failed to save result');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 p-4 border border-border rounded-xl bg-card">
      <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
        <Trophy className="w-4 h-4 text-amber-500" />
        Record Programme Winners
      </h3>

      <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-muted-foreground">Select Programme</label>
        <select
          value={selectedProgrammeId}
          onChange={(e) => setSelectedProgrammeId(e.target.value)}
          className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">-- Choose Programme --</option>
          {programmes.map((p) => (
            <option key={p.id} value={p.id}>
              [{p.code}] {p.name} (Cat {p.point_category} Points)
            </option>
          ))}
        </select>
      </div>

      {/* 1st Place */}
      <div className="space-y-1 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
        <label className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
          <span>🥇 1st Place (Winner)</span>
        </label>
        <select
          value={firstStudentId}
          onChange={(e) => setFirstStudentId(e.target.value)}
          className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">-- Select 1st Winner --</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.uid}) - {s.team?.name || 'No Team'}
            </option>
          ))}
        </select>
      </div>

      {/* 2nd Place */}
      <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          <span>🥈 2nd Place</span>
        </label>
        <select
          value={secondStudentId}
          onChange={(e) => setSecondStudentId(e.target.value)}
          className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">-- Select 2nd Runner Up --</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.uid}) - {s.team?.name || 'No Team'}
            </option>
          ))}
        </select>
      </div>

      {/* 3rd Place */}
      <div className="space-y-1 p-3 rounded-lg bg-amber-900/10 border border-amber-900/20">
        <label className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
          <span>🥉 3rd Place</span>
        </label>
        <select
          value={thirdStudentId}
          onChange={(e) => setThirdStudentId(e.target.value)}
          className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">-- Select 3rd Runner Up --</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.uid}) - {s.team?.name || 'No Team'}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => handleSave('DRAFT')}
        >
          <Save className="w-4 h-4 mr-1" />
          Save Draft
        </Button>

        <Button
          type="button"
          disabled={loading}
          onClick={() => handleSave('PUBLISHED')}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Publish Result & Update Leaderboard
        </Button>
      </div>
    </div>
  );
}
