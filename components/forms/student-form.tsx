'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Student, Team } from '@/types';
import { createStudent, updateStudent } from '@/actions/student-actions';
import { toast } from 'sonner';

interface StudentFormProps {
  student?: Student;
  teams: Team[];
  onSuccess?: () => void;
}

export function StudentForm({ student, teams, onSuccess }: StudentFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const payload = {
      uid: (form.get('uid') as string).toUpperCase(),
      name: form.get('name') as string,
      gender: form.get('gender') as any,
      category: form.get('category') as any,
      team_id: form.get('team_id') as string,
      photo_url: (form.get('photo_url') as string) || undefined,
    };

    try {
      if (student?.id) {
        const res = await updateStudent(student.id, payload);
        if (res.success) {
          toast.success(res.message);
          if (onSuccess) onSuccess();
        } else {
          toast.error(res.message);
        }
      } else {
        const res = await createStudent(payload);
        if (res.success) {
          toast.success(res.message);
          if (onSuccess) onSuccess();
        } else {
          toast.error(res.message);
        }
      }
    } catch (err: any) {
      toast.error('Failed to save student details');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">UID</label>
          <Input name="uid" defaultValue={student?.uid || ''} placeholder="ATM2026-001" required />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Full Name</label>
          <Input name="name" defaultValue={student?.name || ''} placeholder="John Doe" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Gender</label>
          <select
            name="gender"
            defaultValue={student?.gender || 'MALE'}
            className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Category</label>
          <select
            name="category"
            defaultValue={student?.category || 'JUNIOR'}
            className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="JUNIOR">Junior</option>
            <option value="SENIOR">Senior</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-muted-foreground">Assigned Team</label>
        <select
          name="team_id"
          defaultValue={student?.team_id || teams[0]?.id || ''}
          className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
          required
        >
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.code})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-muted-foreground">Photo URL</label>
        <Input
          name="photo_url"
          defaultValue={student?.photo_url || ''}
          placeholder="https://..."
        />
      </div>

      <div className="pt-2 flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : student?.id ? 'Update Student' : 'Add Student'}
        </Button>
      </div>
    </form>
  );
}
