'use server';

import { createClient } from '@/lib/supabase/server';
import { Assignment, ActionResponse } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getAssignments(teamId?: string): Promise<Assignment[]> {
  const supabase = await createClient();

  let query = supabase
    .from('assignments')
    .select('*, student:students(*), programme:programmes(*), team:teams(*)');

  if (teamId) {
    query = query.eq('team_id', teamId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching assignments:', error);
    return [];
  }

  return data as Assignment[];
}

export async function assignStudentToProgramme(payload: {
  student_id: string;
  programme_id: string;
  team_id: string;
}): Promise<ActionResponse> {
  const supabase = await createClient();

  // 1. Fetch Student Info
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('*')
    .eq('id', payload.student_id)
    .single();

  if (studentError || !student) {
    return { success: false, message: 'Student not found' };
  }

  // 2. Fetch Programme Info
  const { data: programme, error: progError } = await supabase
    .from('programmes')
    .select('*')
    .eq('id', payload.programme_id)
    .single();

  if (progError || !programme) {
    return { success: false, message: 'Programme not found' };
  }

  // RULE 1: Programme must be OPEN
  if (programme.status !== 'OPEN') {
    return { success: false, message: 'Programme is locked and not accepting registrations.' };
  }

  // RULE 2: Category Match Check
  // Junior students -> Junior + General
  // Senior students -> Senior + General
  if (student.category === 'JUNIOR' && programme.category === 'SENIOR') {
    return { success: false, message: 'Junior students cannot participate in Senior programmes.' };
  }
  if (student.category === 'SENIOR' && programme.category === 'JUNIOR') {
    return { success: false, message: 'Senior students cannot participate in Junior programmes.' };
  }

  // RULE 3: Check duplicate assignment for same programme
  const { data: existingAssignment } = await supabase
    .from('assignments')
    .select('*')
    .eq('student_id', payload.student_id)
    .eq('programme_id', payload.programme_id)
    .maybeSingle();

  if (existingAssignment) {
    return { success: false, message: 'Student is already registered for this programme.' };
  }

  // RULE 4: Team Participant Limit Check for Programme
  const { count: teamCountInProgramme } = await supabase
    .from('assignments')
    .select('*', { count: 'exact', head: true })
    .eq('programme_id', payload.programme_id)
    .eq('team_id', payload.team_id);

  if ((teamCountInProgramme || 0) >= programme.max_participants_per_team) {
    return {
      success: false,
      message: `Team quota limit reached (${programme.max_participants_per_team} per team for this programme).`,
    };
  }

  // RULE 5: Individual Student Category Quota Limits
  // Limits:
  // Junior On Stage = 4, Junior Off Stage = 5
  // Senior On Stage = 4, Senior Off Stage = 5
  // General On Stage = 2, General Off Stage = 2
  const { data: studentAssignments } = await supabase
    .from('assignments')
    .select('*, programme:programmes(*)')
    .eq('student_id', payload.student_id);

  const currentOnStageCount = (studentAssignments || []).filter(
    (a: any) => a.programme?.type === 'ON_STAGE' && a.programme?.category !== 'GENERAL'
  ).length;

  const currentOffStageCount = (studentAssignments || []).filter(
    (a: any) => a.programme?.type === 'OFF_STAGE' && a.programme?.category !== 'GENERAL'
  ).length;

  const currentGeneralOnStageCount = (studentAssignments || []).filter(
    (a: any) => a.programme?.type === 'ON_STAGE' && a.programme?.category === 'GENERAL'
  ).length;

  const currentGeneralOffStageCount = (studentAssignments || []).filter(
    (a: any) => a.programme?.type === 'OFF_STAGE' && a.programme?.category === 'GENERAL'
  ).length;

  if (programme.category === 'GENERAL') {
    if (programme.type === 'ON_STAGE' && currentGeneralOnStageCount >= 2) {
      return { success: false, message: 'Student has reached maximum General On-Stage limit (2).' };
    }
    if (programme.type === 'OFF_STAGE' && currentGeneralOffStageCount >= 2) {
      return { success: false, message: 'Student has reached maximum General Off-Stage limit (2).' };
    }
  } else {
    const maxOnStage = student.category === 'JUNIOR' ? 4 : 4;
    const maxOffStage = student.category === 'JUNIOR' ? 5 : 5;

    if (programme.type === 'ON_STAGE' && currentOnStageCount >= maxOnStage) {
      return {
        success: false,
        message: `Student has reached maximum ${student.category} On-Stage limit (${maxOnStage}).`,
      };
    }
    if (programme.type === 'OFF_STAGE' && currentOffStageCount >= maxOffStage) {
      return {
        success: false,
        message: `Student has reached maximum ${student.category} Off-Stage limit (${maxOffStage}).`,
      };
    }
  }

  // Insert Assignment
  const { data, error } = await supabase
    .from('assignments')
    .insert([
      {
        student_id: payload.student_id,
        programme_id: payload.programme_id,
        team_id: payload.team_id,
      },
    ])
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/leader/assign-students');
  return { success: true, message: 'Student successfully registered for programme!', data };
}

export async function cancelAssignment(id: string): Promise<ActionResponse> {
  const supabase = await createClient();

  const { error } = await supabase.from('assignments').delete().eq('id', id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/leader/assign-students');
  return { success: true, message: 'Assignment cancelled successfully' };
}
