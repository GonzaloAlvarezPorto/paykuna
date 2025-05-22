import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    const clientesFilePath = path.join(process.cwd(), 'public', 'data', 'clientes.json');
    const fileContents = await fs.readFile(clientesFilePath, 'utf8');
    const clientes = JSON.parse(fileContents);
    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Error al leer clientes.json:', error);
    return NextResponse.json({ error: 'No se pudo leer el archivo de clientes.' }, { status: 500 });
  }
}
