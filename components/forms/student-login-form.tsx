'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginWithStudentUID } from '@/actions/auth-actions';
import { User, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function StudentLoginForm() {
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!uid.trim()) {
      toast.error('Please enter your Student UID');
      return;
    }

    setLoading(true);
    try {
      const res = await loginWithStudentUID(uid);
      if (res.success) {
        toast.success(res.message);
        router.push('/student');
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error('Failed to log in with UID');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Student Unique Identification (UID)
        </label>
        <div className="relative">
          <User className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="e.g. ATM2026-001"
            className="pl-9 tracking-widest font-mono uppercase"
            required
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          Enter your unique delegate UID provided on your Registration Slip.
        </p>
      </div>

      <Button type="submit" disabled={loading} className="w-full h-11 text-base font-semibold bg-emerald-600 hover:bg-emerald-700">
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Verifying UID...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Access Student Portal
            <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </Button>
    </form>
  );
}
