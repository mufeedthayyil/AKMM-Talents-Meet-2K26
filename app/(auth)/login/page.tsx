import { LoginForm } from '@/components/forms/login-form';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-2xl mx-auto shadow-lg shadow-blue-600/30">
            A
          </div>
          <h1 className="text-2xl font-black tracking-tight">ATMMS Staff Login</h1>
          <p className="text-xs text-muted-foreground">
            Sign in as Admin, Team Leader, or Assistant
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <LoginForm />
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Are you a Student Delegate?{' '}
          <Link href="/student-login" className="text-blue-600 font-semibold hover:underline">
            Login with Student UID →
          </Link>
        </div>
      </div>
    </div>
  );
}
