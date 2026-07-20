import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase-ref.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key',
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

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Protect Admin Routes
  if (path.startsWith('/admin')) {
    if (!user) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    const role = user.user_metadata?.role || 'STUDENT';
    if (role !== 'ADMIN') {
      url.pathname = role === 'LEADER' || role === 'ASSISTANT' ? '/leader' : '/student';
      return NextResponse.redirect(url);
    }
  }

  // Protect Leader Routes
  if (path.startsWith('/leader')) {
    if (!user) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    const role = user.user_metadata?.role || 'STUDENT';
    if (role !== 'LEADER' && role !== 'ASSISTANT' && role !== 'ADMIN') {
      url.pathname = '/student';
      return NextResponse.redirect(url);
    }
  }

  // Protect Student Routes
  if (path.startsWith('/student')) {
    if (!user && !studentUidCookie) {
      url.pathname = '/student-login';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
