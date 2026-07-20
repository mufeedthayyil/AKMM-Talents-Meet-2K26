'use me';
'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ActionResponse } from '@/types';

export async function loginWithEmail(formData: FormData): Promise<ActionResponse> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, message: 'Email and password are required' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { success: false, message: error?.message || 'Invalid credentials' };
  }

  const role = data.user.user_metadata?.role || 'ADMIN';
  
  if (role === 'ADMIN') {
    redirect('/admin');
  } else if (role === 'LEADER' || role === 'ASSISTANT') {
    redirect('/leader');
  } else {
    redirect('/student');
  }
}

export async function loginWithStudentUID(uid: string): Promise<ActionResponse> {
  if (!uid || uid.trim() === '') {
    return { success: false, message: 'Student UID is required' };
  }

  const supabase = await createClient();

  // Query student from database
  const { data: student, error } = await supabase
    .from('students')
    .select('*, team:teams(*)')
    .eq('uid', uid.trim().toUpperCase())
    .single();

  if (error || !student) {
    return { success: false, message: 'Student UID not found. Please check your UID.' };
  }

  // Set student session cookie
  const cookieStore = await cookies();
  cookieStore.set('atmms_student_uid', student.uid, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
  });

  return {
    success: true,
    message: `Welcome ${student.name}!`,
    data: student,
  };
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete('atmms_student_uid');

  redirect('/login');
}
