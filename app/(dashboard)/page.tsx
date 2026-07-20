import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const cookieStore = await cookies();
  const studentUid = cookieStore.get('atmms_student_uid')?.value;

  if (user) {
    const role = user.user_metadata?.role || 'ADMIN';
    if (role === 'ADMIN') redirect('/admin');
    if (role === 'LEADER' || role === 'ASSISTANT') redirect('/leader');
    redirect('/student');
  }

  if (studentUid) {
    redirect('/student');
  }

  redirect('/login');
}
