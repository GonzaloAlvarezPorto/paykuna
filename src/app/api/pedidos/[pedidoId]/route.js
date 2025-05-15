import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), "public", "data", "pedidos.json");

// Leer pedidos (versión async)
const leerPedidos = async () => {
    const data = await readFile(filePath, "utf-8");
    return JSON.parse(data);
};

export async function GET(request, { params }) {
    const { pedidoId } = params;

    if (!pedidoId) {
        return new Response(JSON.stringify({ error: "ID de pedido no proporcionado" }), { status: 400 });
    }

    const pedidos = await leerPedidos();
    const pedido = pedidos.find(p => p.id === parseInt(pedidoId));

    if (!pedido) {
        return new Response(JSON.stringify({ error: "Pedido no encontrado" }), { status: 404 });
    }

    return new Response(JSON.stringify(pedido), { status: 200 });
}

export async function PUT(request, { params }) {
  try {
    const { pedidoId } = await params;
    const { estado, pagado } = await request.json();

    const data = await readFile(filePath, 'utf-8');
    const pedidos = JSON.parse(data);

    const pedidoIndex = pedidos.findIndex(p => String(p.id) === String(pedidoId));
    if (pedidoIndex === -1) {
      return new Response(JSON.stringify({ error: 'Pedido no encontrado' }), { status: 404 });
    }

    if (estado !== undefined) {
      pedidos[pedidoIndex].estado = estado;
    }
    if (pagado !== undefined) {
      pedidos[pedidoIndex].pagado = pagado;
      pedidos[pedidoIndex].deuda = pedidos[pedidoIndex].total - pagado;
    }

    await writeFile(filePath, JSON.stringify(pedidos, null, 2));

    return new Response(JSON.stringify(pedidos[pedidoIndex]), { status: 200 });
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
  }
}
