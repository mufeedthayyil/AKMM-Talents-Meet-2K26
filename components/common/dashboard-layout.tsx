import { Sidebar } from '@/components/common/sidebar';
import { Header } from '@/components/common/header';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const cookieStore = await cookies();
  const studentUid = cookieStore.get('atmms_student_uid')?.value;

  let role: 'ADMIN' | 'LEADER' | 'ASSISTANT' | 'STUDENT' = 'STUDENT';
  let userName = 'Student Delegate';

  if (user) {
    role = (user.user_metadata?.role as any) || 'ADMIN';
    userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Administrator';
  } else if (studentUid) {
    role = 'STUDENT';
    userName = `Student (${studentUid})`;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header userRole={role} userName={userName} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
