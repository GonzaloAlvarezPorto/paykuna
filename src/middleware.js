import { NextResponse } from 'next/server';

export function middleware(request) {
  const auth = request.cookies.get('admin-auth');

  // Proteger la ruta /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!auth || auth.value !== 'true') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // Aplica middleware a todas las rutas /admin
};
