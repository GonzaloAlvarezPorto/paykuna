import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, password } = await request.json();

  // Comprobar las credenciales de administrador desde las variables de entorno
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Si las credenciales son correctas, crear una respuesta positiva con la cookie de autenticación
    const response = NextResponse.json({ success: true });

    response.cookies.set('admin-auth', 'true', {
      httpOnly: true,   // Evita acceso a las cookies desde JavaScript
      path: '/',        // Disponible en todo el sitio
      maxAge: 60 * 60 * 8, // La cookie caduca en 8 horas
      secure: process.env.NODE_ENV === 'production', // Solo para producción en HTTPS
    });

    return response;
  }

  // Si las credenciales son incorrectas, devolver un error 401
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
