import fs from 'fs';
import path from 'path';

// Ruta al archivo de pedidos.json
const pedidosFilePath = path.join(process.cwd(), 'public','data','pedidos.json');

export async function GET() {
  try {
    // Leer el archivo de pedidos
    const pedidosData = fs.readFileSync(pedidosFilePath, 'utf8');
    
    // Parsear los datos a JSON
    const pedidos = JSON.parse(pedidosData);

    // Filtrar solo los campos email y fecha
    const pedidosFiltrados = pedidos.map(pedido => ({
      email: pedido.email,
      fecha: pedido.fecha,
      pedidoId: pedido.id,
      deuda: pedido.deuda,
      estado: pedido.estado,
      pagado: pedido.pagado,
      total: pedido.total
    }));

    // Devolver los pedidos filtrados
    return new Response(JSON.stringify(pedidosFiltrados), {
      status: 200,
    });
  } catch (error) {
    console.error('Error al leer el archivo de pedidos:', error);
    return new Response('Error al obtener los pedidos', { status: 500 });
  }
}
