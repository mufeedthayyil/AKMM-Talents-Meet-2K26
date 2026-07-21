import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase-ref.supabase.co';
  const url = rawUrl.trim().replace(/\/+$/, '');
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key').trim();

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check student UID cookie if present
  const studentUidCookie = request.cookies.get('atmms_student_uid')?.value;

  const reqUrl = request.nextUrl.clone();
  const path = reqUrl.pathname;

  // Protect Admin Routes
  if (path.startsWith('/admin')) {
    if (!user) {
      reqUrl.pathname = '/login';
      return NextResponse.redirect(reqUrl);
    }
    const role = user.user_metadata?.role || 'STUDENT';
    if (role !== 'ADMIN') {
      reqUrl.pathname = role === 'LEADER' || role === 'ASSISTANT' ? '/leader' : '/student';
      return NextResponse.redirect(reqUrl);
    }
  }

  // Protect Leader Routes
  if (path.startsWith('/leader')) {
    if (!user) {
      reqUrl.pathname = '/login';
      return NextResponse.redirect(reqUrl);
    }
    const role = user.user_metadata?.role || 'STUDENT';
    if (role !== 'LEADER' && role !== 'ASSISTANT' && role !== 'ADMIN') {
      reqUrl.pathname = '/student';
      return NextResponse.redirect(reqUrl);
    }
  }

  // Protect Student Routes
  if (path.startsWith('/student')) {
    if (!user && !studentUidCookie) {
      reqUrl.pathname = '/student-login';
      return NextResponse.redirect(reqUrl);
    }
  }

  return supabaseResponse;
}
