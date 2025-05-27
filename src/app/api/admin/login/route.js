import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, password } = await request.json();

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const response = NextResponse.json({ success: true });

    // ✅ setear cookie en la respuesta, no con cookies()
    response.cookies.set('admin-auth', 'true', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 8,
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
