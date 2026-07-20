'use server';

import { createClient } from '@/lib/supabase/server';
import { AppDocument, ActionResponse } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getDocuments(userRole: string = 'PUBLIC', search?: string): Promise<AppDocument[]> {
  const supabase = await createClient();

  let query = supabase.from('documents').select('*').order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  // Filter based on user visibility role
  if (userRole === 'STUDENT') {
    query = query.in('visibility', ['PUBLIC', 'STUDENT']);
  } else if (userRole === 'LEADER' || userRole === 'ASSISTANT') {
    query = query.in('visibility', ['PUBLIC', 'LEADER', 'STUDENT']);
  } else if (userRole === 'PUBLIC') {
    query = query.eq('visibility', 'PUBLIC');
  }
  // Admin gets all documents

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }

  return data as AppDocument[];
}

export async function uploadDocumentRecord(payload: {
  title: string;
  description?: string;
  file_url: string;
  file_size: number;
  file_type: string;
  visibility: 'ADMIN' | 'LEADER' | 'STUDENT' | 'PUBLIC';
  uploaded_by?: string;
}): Promise<ActionResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('documents')
    .insert([payload])
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/documents');
  revalidatePath('/leader/documents');
  revalidatePath('/student/documents');
  return { success: true, message: 'Document published successfully', data };
}

export async function incrementDownloadCount(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: doc } = await supabase.from('documents').select('download_count').eq('id', id).single();
  if (doc) {
    await supabase.from('documents').update({ download_count: doc.download_count + 1 }).eq('id', id);
  }
}

export async function deleteDocument(id: string): Promise<ActionResponse> {
  const supabase = await createClient();

  const { error } = await supabase.from('documents').delete().eq('id', id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/documents');
  return { success: true, message: 'Document deleted successfully' };
}
