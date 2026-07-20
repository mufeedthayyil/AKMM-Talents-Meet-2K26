'use server';

import { createClient } from '@/lib/supabase/server';
import { Student, ActionResponse } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getStudents(filters?: {
  search?: string;
  team_id?: string;
  category?: string;
  gender?: string;
}): Promise<Student[]> {
  const supabase = await createClient();

  let query = supabase.from('students').select('*, team:teams(*)').order('uid');

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,uid.ilike.%${filters.search}%`);
  }
  if (filters?.team_id && filters.team_id !== 'all') {
    query = query.eq('team_id', filters.team_id);
  }
  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters?.gender && filters.gender !== 'all') {
    query = query.eq('gender', filters.gender);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching students:', error);
    return [];
  }

  return data as Student[];
}

export async function getStudentByUid(uid: string): Promise<Student | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('students')
    .select('*, team:teams(*)')
    .eq('uid', uid)
    .single();

  if (error) return null;
  return data as Student;
}

export async function createStudent(payload: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<ActionResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('students')
    .insert([payload])
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/students');
  return { success: true, message: 'Student created successfully', data };
}

export async function updateStudent(id: string, payload: Partial<Student>): Promise<ActionResponse> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('students')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/students');
  return { success: true, message: 'Student updated successfully' };
}

export async function deleteStudent(id: string): Promise<ActionResponse> {
  const supabase = await createClient();

  const { error } = await supabase.from('students').delete().eq('id', id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/students');
  return { success: true, message: 'Student deleted successfully' };
}

export async function bulkImportStudents(studentsList: any[]): Promise<ActionResponse> {
  const supabase = await createClient();

  const formatted = studentsList.map((s) => ({
    uid: s.UID || s.uid,
    name: s.Name || s.name,
    gender: (s.Gender || s.gender || 'MALE').toUpperCase(),
    category: (s.Category || s.category || 'JUNIOR').toUpperCase(),
    team_id: s.TeamID || s.team_id,
  }));

  const { data, error } = await supabase.from('students').upsert(formatted, { onConflict: 'uid' });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/students');
  return { success: true, message: `Successfully imported ${studentsList.length} students` };
}
