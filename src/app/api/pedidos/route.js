import fs from 'fs/promises';
import path from 'path';

// Ruta al archivo de pedidos.json
const pedidosFilePath = path.join(process.cwd(), 'public', 'data', 'pedidos.json');

export async function GET() {
  try {
    // Leer el archivo de pedidos de forma asíncrona
    const pedidosData = await fs.readFile(pedidosFilePath, 'utf8');
    
    // Parsear los datos a JSON
    const pedidos = JSON.parse(pedidosData);

    // Filtrar solo los campos que necesitás
    const pedidosFiltrados = pedidos.map(pedido => ({
      email: pedido.email,
      nombreCompleto: `${pedido.nombre} ${pedido.apellido}`,
      fecha: pedido.fecha,
      pedidoId: pedido.id,
      deuda: pedido.deuda,
      estado: pedido.estado,
      pagado: pedido.pagado,
      total: pedido.total,
      clienteId: pedido.clienteId,
      retiro: pedido.retiro
    }));

    // Devolver la respuesta JSON
    return new Response(JSON.stringify(pedidosFiltrados), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Archivo no existe: devolvemos array vacío para no romper la app
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error('Error al leer el archivo de pedidos:', error);
    return new Response('Error al obtener los pedidos', { status: 500 });
  }
}
