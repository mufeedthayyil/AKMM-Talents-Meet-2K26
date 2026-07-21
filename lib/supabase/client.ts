import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase-ref.supabase.co';
  const url = rawUrl.trim().replace(/\/+$/, '');
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key').trim();

  return createBrowserClient(url, key);
}
