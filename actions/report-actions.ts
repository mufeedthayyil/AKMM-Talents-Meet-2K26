'use server';

import { createClient } from '@/lib/supabase/server';
import { ActivityLog } from '@/types';

export async function getReportSummary() {
  const supabase = await createClient();

  const [{ count: studentCount }, { count: teamCount }, { count: programmeCount }, { count: resultCount }] =
    await Promise.all([
      supabase.from('students').select('*', { count: 'exact', head: true }),
      supabase.from('teams').select('*', { count: 'exact', head: true }),
      supabase.from('programmes').select('*', { count: 'exact', head: true }),
      supabase.from('results').select('*', { count: 'exact', head: true }),
    ]);

  return {
    totalStudents: studentCount || 0,
    totalTeams: teamCount || 4,
    totalProgrammes: programmeCount || 0,
    totalResults: resultCount || 0,
  };
}

export async function getLogs(): Promise<ActivityLog[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('logs')
    .select('*, user:users(*)')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching logs:', error);
    return [];
  }

  return data as ActivityLog[];
}
