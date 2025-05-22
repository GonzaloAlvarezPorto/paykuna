'use client';

import { useState } from 'react';

const estados = ['Por preparar', 'Preparando', 'Entregado', 'Pagado'];

export default function EstadoButtons({ estadoActual, pedidoId, totalPedido }) {
  const [estado, setEstado] = useState(estadoActual);
  const [loading, setLoading] = useState(false);

  async function cambiarEstado(nuevoEstado) {
    setLoading(true);
    const res = await fetch(`/api/pedidos/${pedidoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        estado: nuevoEstado,
        ...(nuevoEstado === 'Pagado' && { pagado: totalPedido }), // señal al backend
      }),
    });

    if (res.ok) {
      setEstado(nuevoEstado);
    } else {
      alert('Error al actualizar estado');
    }
    setLoading(false);
  }

  return (
    <div>
      {estados.map(e => (
        <button
          key={e}
          disabled={loading || e === estado}
          onClick={() => cambiarEstado(e)}
          style={{ fontWeight: e === estado ? 'bold' : 'normal' }}
        >
          {e}
        </button>
      ))}
    </div>
  );
}
