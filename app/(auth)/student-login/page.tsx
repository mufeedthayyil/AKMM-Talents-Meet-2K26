import { StudentLoginForm } from '@/components/forms/student-login-form';
import Link from 'next/link';
import { UserCheck } from 'lucide-react';

export default function StudentLoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-2xl mx-auto shadow-lg shadow-emerald-600/30">
            S
          </div>
          <h1 className="text-2xl font-black tracking-tight">Student Delegate Portal</h1>
          <p className="text-xs text-muted-foreground">
            Enter your assigned UID to access events and printable ID card
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <StudentLoginForm />
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Faculty or Team Leader?{' '}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Go to Staff Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
