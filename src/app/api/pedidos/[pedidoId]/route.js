import { db } from '../@/lib/firebase.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function GET(request, { params }) {
  const { pedidoId } = await params; 

  if (!pedidoId) {
    return new Response(JSON.stringify({ error: 'ID de pedido no proporcionado' }), { status: 400 });
  }

  try {
    const docRef = doc(db, 'pedidos', pedidoId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return new Response(JSON.stringify({ error: 'Pedido no encontrado' }), { status: 404 });
    }

    const pedido = docSnap.data();

    return new Response(JSON.stringify({ ...pedido, id: docSnap.id }), { status: 200 });
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { pedidoId } = await params;

  if (!pedidoId) {
    return new Response(JSON.stringify({ error: 'ID de pedido no proporcionado' }), { status: 400 });
  }

  try {
    const updates = await request.json();

    // Validaciones
    if (updates.pagado !== undefined && (isNaN(updates.pagado) || Number(updates.pagado) < 0)) {
      return new Response(JSON.stringify({ error: 'El campo "pagado" debe ser un número válido mayor o igual a 0' }), {
        status: 400,
      });
    }

    if (updates.estado !== undefined && typeof updates.estado !== 'string') {
      return new Response(JSON.stringify({ error: 'El campo "estado" debe ser una cadena de texto' }), {
        status: 400,
      });
    }

    const docRef = doc(db, 'pedidos', pedidoId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return new Response(JSON.stringify({ error: 'Pedido no encontrado' }), { status: 404 });
    }

    const pedidoActual = docSnap.data();

    const nuevoEstado = {
      ...(updates.estado !== undefined && { estado: updates.estado }),
      ...(updates.pagado !== undefined && {
        pagado: Number(updates.pagado),
        deuda: Number(pedidoActual.total) - Number(updates.pagado),
      }),
    };

    await updateDoc(docRef, nuevoEstado);

    return new Response(JSON.stringify({ ...pedidoActual, ...nuevoEstado, id: docSnap.id }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
  }
}
