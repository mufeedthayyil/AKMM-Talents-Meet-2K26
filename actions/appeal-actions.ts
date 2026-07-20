'use server';

import { createClient } from '@/lib/supabase/server';
import { Appeal, ActionResponse } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getAppeals(teamId?: string): Promise<Appeal[]> {
  const supabase = await createClient();

  let query = supabase
    .from('appeals')
    .select('*, programme:programmes(*), team:teams(*), submitter:users!submitted_by(*)')
    .order('created_at', { ascending: false });

  if (teamId) {
    query = query.eq('team_id', teamId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching appeals:', error);
    return [];
  }

  return data as Appeal[];
}

export async function submitAppeal(payload: {
  programme_id: string;
  team_id: string;
  submitted_by: string;
  title: string;
  description: string;
  proof_url?: string;
}): Promise<ActionResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('appeals')
    .insert([
      {
        ...payload,
        status: 'PENDING',
      },
    ])
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/leader/appeals');
  revalidatePath('/admin/appeals');
  return { success: true, message: 'Appeal submitted successfully', data };
}

export async function resolveAppeal(
  appealId: string,
  status: 'ACCEPTED' | 'REJECTED',
  adminResponse: string
): Promise<ActionResponse> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('appeals')
    .update({
      status,
      admin_response: adminResponse,
      updated_at: new Date().toISOString(),
    })
    .eq('id', appealId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/appeals');
  revalidatePath('/leader/appeals');
  return { success: true, message: `Appeal ${status.toLowerCase()} successfully` };
}
