'use server';

import { createClient } from '@/lib/supabase/server';
import { Result, ActionResponse } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getResults(onlyPublished: boolean = true): Promise<Result[]> {
  const supabase = await createClient();

  let query = supabase
    .from('results')
    .select(`
      *,
      programme:programmes(*),
      first_place_student:students!first_place_student_id(*),
      second_place_student:students!second_place_student_id(*),
      third_place_student:students!third_place_student_id(*),
      first_place_team:teams!first_place_team_id(*),
      second_place_team:teams!second_place_team_id(*),
      third_place_team:teams!third_place_team_id(*)
    `)
    .order('updated_at', { ascending: false });

  if (onlyPublished) {
    query = query.eq('status', 'PUBLISHED');
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching results:', error);
    return [];
  }

  return data as Result[];
}

export async function upsertResult(payload: Partial<Result>): Promise<ActionResponse> {
  const supabase = await createClient();

  // 1. Automatically populate team IDs from winners' student records if available
  if (payload.first_place_student_id && !payload.first_place_team_id) {
    const { data: s1 } = await supabase.from('students').select('team_id').eq('id', payload.first_place_student_id).single();
    if (s1) payload.first_place_team_id = s1.team_id;
  }
  if (payload.second_place_student_id && !payload.second_place_team_id) {
    const { data: s2 } = await supabase.from('students').select('team_id').eq('id', payload.second_place_student_id).single();
    if (s2) payload.second_place_team_id = s2.team_id;
  }
  if (payload.third_place_student_id && !payload.third_place_team_id) {
    const { data: s3 } = await supabase.from('students').select('team_id').eq('id', payload.third_place_student_id).single();
    if (s3) payload.third_place_team_id = s3.team_id;
  }

  if (payload.status === 'PUBLISHED' && !payload.published_at) {
    payload.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from('results').upsert([payload]);

  if (error) {
    return { success: false, message: error.message };
  }

  // Manually trigger team points update helper if trigger not enabled
  await recalculateAllTeamPoints(supabase);

  revalidatePath('/admin/results');
  revalidatePath('/leader/results');
  revalidatePath('/student/results');
  revalidatePath('/admin');
  revalidatePath('/leader');
  return { success: true, message: `Result saved as ${payload.status || 'DRAFT'}` };
}

async function recalculateAllTeamPoints(supabase: any) {
  try {
    const { data: publishedResults } = await supabase
      .from('results')
      .select('*, programme:programmes(*)')
      .eq('status', 'PUBLISHED');

    const teamScores: Record<string, number> = {};

    (publishedResults || []).forEach((res: any) => {
      const isCatA = res.programme?.point_category === 'A';
      const pts1 = isCatA ? 7 : 20;
      const pts2 = isCatA ? 5 : 10;
      const pts3 = isCatA ? 3 : 5;

      if (res.first_place_team_id) {
        teamScores[res.first_place_team_id] = (teamScores[res.first_place_team_id] || 0) + pts1;
      }
      if (res.second_place_team_id) {
        teamScores[res.second_place_team_id] = (teamScores[res.second_place_team_id] || 0) + pts2;
      }
      if (res.third_place_team_id) {
        teamScores[res.third_place_team_id] = (teamScores[res.third_place_team_id] || 0) + pts3;
      }
    });

    const { data: teams } = await supabase.from('teams').select('id');
    if (teams) {
      for (const t of teams) {
        const total = teamScores[t.id] || 0;
        await supabase.from('teams').update({ total_points: total }).eq('id', t.id);
      }
    }
  } catch (err) {
    console.error('Error recalculating team points:', err);
  }
}
