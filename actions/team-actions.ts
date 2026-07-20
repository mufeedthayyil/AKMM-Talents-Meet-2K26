'use server';

import { createClient } from '@/lib/supabase/server';
import { Team, ActionResponse } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getTeams(): Promise<Team[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('teams')
    .select(`
      *,
      leader:users!fk_teams_leader(*),
      assistant:users!fk_teams_assistant(*)
    `)
    .order('total_points', { ascending: false });

  if (error) {
    console.error('Error fetching teams:', error);
    // Return default 4 mock teams if database not seeded yet
    return [
      { id: '11111111-1111-1111-1111-111111111111', name: 'Ruby Royals', code: 'RUBY', color: '#EF4444', total_points: 120, created_at: '', updated_at: '' },
      { id: '22222222-2222-2222-2222-222222222222', name: 'Sapphire Knights', code: 'SAPH', color: '#3B82F6', total_points: 95, created_at: '', updated_at: '' },
      { id: '33333333-3333-3333-3333-333333333333', name: 'Emerald Titans', code: 'EMLD', color: '#10B981', total_points: 80, created_at: '', updated_at: '' },
      { id: '44444444-4444-4444-4444-444444444444', name: 'Diamond Eagles', code: 'DMND', color: '#8B5CF6', total_points: 65, created_at: '', updated_at: '' },
    ];
  }

  return data as Team[];
}

export async function updateTeam(teamId: string, payload: Partial<Team>): Promise<ActionResponse> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('teams')
    .update({
      name: payload.name,
      color: payload.color,
      logo_url: payload.logo_url,
      leader_id: payload.leader_id,
      assistant_id: payload.assistant_id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', teamId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/teams');
  revalidatePath('/leader');
  return { success: true, message: 'Team details updated successfully' };
}
