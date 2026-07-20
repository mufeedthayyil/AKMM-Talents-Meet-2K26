'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginWithEmail } from '@/actions/auth-actions';
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function LoginForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginWithEmail(formData);
      if (res && !res.success) {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Email Address
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            name="email"
            type="email"
            placeholder="admin@akmm.edu"
            className="pl-9"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Password
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            className="pl-9"
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full h-11 text-base font-semibold">
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Authenticating...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Sign In to Dashboard
          </span>
        )}
      </Button>
    </form>
  );
}
