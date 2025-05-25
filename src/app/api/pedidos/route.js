// app/api/pedidos/route.js (si usás App Router)
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const pedidosSnapshot = await getDocs(collection(db, 'pedidos'));

    const pedidosFiltrados = pedidosSnapshot.docs.map(doc => {
      const pedido = doc.data();
      return {
        email: pedido.email || '',
        nombreCompleto: `${pedido.nombre || ''} ${pedido.apellido || ''}`.trim(),
        fecha: pedido.fecha || '',
        pedidoId: pedido.id || doc.id, // usá el id del doc si no hay campo 'id'
        deuda: pedido.deuda || 0,
        estado: pedido.estado || '',
        pagado: pedido.pagado || false,
        total: pedido.total || 0,
        clienteId: pedido.clienteId || '',
        retiro: pedido.retiro || ''
      };
    });

    return new Response(JSON.stringify(pedidosFiltrados), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error al obtener pedidos desde Firebase:', error);
    return new Response('Error al obtener los pedidos', { status: 500 });
  }
}
