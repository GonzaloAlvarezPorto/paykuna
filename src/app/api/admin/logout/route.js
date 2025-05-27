// src/app/api/admin/logout/route.js

import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Eliminar la cookie
  response.cookies.set('admin-auth', '', {
    path: '/',
    maxAge: 0,  // Caduca inmediatamente
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
