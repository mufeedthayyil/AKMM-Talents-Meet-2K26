'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Programme } from '@/types';
import { createProgramme, updateProgramme } from '@/actions/programme-actions';
import { toast } from 'sonner';

interface ProgrammeFormProps {
  programme?: Programme;
  onSuccess?: () => void;
}

export function ProgrammeForm({ programme, onSuccess }: ProgrammeFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const payload = {
      code: (form.get('code') as string).toUpperCase(),
      name: form.get('name') as string,
      type: form.get('type') as any,
      category: form.get('category') as any,
      point_category: form.get('point_category') as any,
      max_participants_per_team: parseInt(form.get('max_participants_per_team') as string, 10),
      status: form.get('status') as any,
    };

    try {
      if (programme?.id) {
        const res = await updateProgramme(programme.id, payload);
        if (res.success) {
          toast.success(res.message);
          if (onSuccess) onSuccess();
        } else {
          toast.error(res.message);
        }
      } else {
        const res = await createProgramme(payload);
        if (res.success) {
          toast.success(res.message);
          if (onSuccess) onSuccess();
        } else {
          toast.error(res.message);
        }
      }
    } catch (err: any) {
      toast.error('Failed to save programme');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Code</label>
          <Input name="code" defaultValue={programme?.code || ''} placeholder="P101" required />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Programme Name</label>
          <Input name="name" defaultValue={programme?.name || ''} placeholder="Light Music Solo" required />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Stage Type</label>
          <select
            name="type"
            defaultValue={programme?.type || 'ON_STAGE'}
            className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="ON_STAGE">On Stage</option>
            <option value="OFF_STAGE">Off Stage</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Category</label>
          <select
            name="category"
            defaultValue={programme?.category || 'JUNIOR'}
            className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="JUNIOR">Junior</option>
            <option value="SENIOR">Senior</option>
            <option value="GENERAL">General</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Point Category</label>
          <select
            name="point_category"
            defaultValue={programme?.point_category || 'A'}
            className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="A">Cat A (7, 5, 3)</option>
            <option value="B">Cat B (20, 10, 5)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Max / Team</label>
          <Input
            type="number"
            name="max_participants_per_team"
            defaultValue={programme?.max_participants_per_team || 1}
            min={1}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Status</label>
          <select
            name="status"
            defaultValue={programme?.status || 'OPEN'}
            className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="OPEN">Open</option>
            <option value="LOCKED">Locked</option>
          </select>
        </div>
      </div>

      <div className="pt-2 flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : programme?.id ? 'Update Programme' : 'Add Programme'}
        </Button>
      </div>
    </form>
  );
}
