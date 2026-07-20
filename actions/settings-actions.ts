'use server';

import { createClient } from '@/lib/supabase/server';
import { ActionResponse } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getSettings(): Promise<Record<string, any>> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('settings').select('*');

  if (error || !data) {
    return {
      event_info: {
        title: 'AKMM Annual Talents Meet 2026',
        college_name: 'AKMM College of Excellence',
        academic_year: '2025-2026',
        venue: 'Main Campus Auditorium',
        start_date: '2026-08-10',
        end_date: '2026-08-12',
      },
    };
  }

  const map: Record<string, any> = {};
  data.forEach((s) => {
    map[s.key] = s.value;
  });

  return map;
}

export async function updateSetting(key: string, value: any): Promise<ActionResponse> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('settings')
    .upsert([{ key, value, updated_at: new Date().toISOString() }], { onConflict: 'key' });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/settings');
  return { success: true, message: 'Settings saved successfully' };
}
