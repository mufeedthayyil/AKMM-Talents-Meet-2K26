'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Programme, Team } from '@/types';
import { submitAppeal } from '@/actions/appeal-actions';
import { AlertCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

interface AppealFormProps {
  programmes: Programme[];
  team: Team;
  userId: string;
  onSuccess?: () => void;
}

export function AppealForm({ programmes, team, userId, onSuccess }: AppealFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const payload = {
      programme_id: form.get('programme_id') as string,
      team_id: team.id,
      submitted_by: userId,
      title: form.get('title') as string,
      description: form.get('description') as string,
      proof_url: (form.get('proof_url') as string) || undefined,
    };

    try {
      const res = await submitAppeal(payload);
      if (res.success) {
        toast.success(res.message);
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error('Failed to submit appeal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-border rounded-xl bg-card">
      <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-500" />
        File Official Result Appeal
      </h3>

      <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-muted-foreground">Select Programme</label>
        <select
          name="programme_id"
          className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
          required
        >
          <option value="">-- Choose Programme --</option>
          {programmes.map((p) => (
            <option key={p.id} value={p.id}>
              [{p.code}] {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-muted-foreground">Appeal Subject / Title</label>
        <Input name="title" placeholder="e.g. Discrepancy in Judgement Scoring" required />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-muted-foreground">Detailed Statement</label>
        <textarea
          name="description"
          rows={3}
          className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="State clear reasons and facts regarding your appeal..."
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-muted-foreground">Supporting Proof URL (Optional)</label>
        <Input name="proof_url" placeholder="https://drive.google.com/..." />
      </div>

      <Button type="submit" disabled={loading} className="w-full font-semibold">
        <Send className="w-4 h-4 mr-2" />
        {loading ? 'Submitting...' : 'Submit Appeal to Admin Desk'}
      </Button>
    </form>
  );
}
