'use server';

import { createClient } from '@/lib/supabase/server';
import { Programme, Schedule, ActionResponse } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getProgrammes(filters?: {
  search?: string;
  type?: string;
  category?: string;
  status?: string;
}): Promise<Programme[]> {
  const supabase = await createClient();

  let query = supabase.from('programmes').select('*').order('code');

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`);
  }
  if (filters?.type && filters.type !== 'all') {
    query = query.eq('type', filters.type);
  }
  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching programmes:', error);
    return [];
  }

  return data as Programme[];
}

export async function createProgramme(payload: Omit<Programme, 'id' | 'created_at' | 'updated_at'>): Promise<ActionResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('programmes').insert([payload]).select().single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/programmes');
  return { success: true, message: 'Programme created successfully', data };
}

export async function updateProgramme(id: string, payload: Partial<Programme>): Promise<ActionResponse> {
  const supabase = await createClient();

  const { error } = await supabase.from('programmes').update(payload).eq('id', id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/programmes');
  return { success: true, message: 'Programme updated successfully' };
}

export async function toggleProgrammeStatus(id: string, currentStatus: string): Promise<ActionResponse> {
  const supabase = await createClient();

  const newStatus = currentStatus === 'OPEN' ? 'LOCKED' : 'OPEN';

  const { error } = await supabase.from('programmes').update({ status: newStatus }).eq('id', id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/programmes');
  return { success: true, message: `Programme status changed to ${newStatus}` };
}

export async function getSchedule(): Promise<Schedule[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('schedule')
    .select('*, programme:programmes(*)')
    .order('event_date')
    .order('event_time');

  if (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }

  return data as Schedule[];
}

export async function upsertSchedule(payload: Partial<Schedule>): Promise<ActionResponse> {
  const supabase = await createClient();

  const { error } = await supabase.from('schedule').upsert([payload]);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/schedule');
  return { success: true, message: 'Schedule updated successfully' };
}
