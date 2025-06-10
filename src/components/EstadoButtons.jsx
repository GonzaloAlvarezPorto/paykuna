'use client';

import { useState } from 'react';

const estados = ['Por preparar', 'Preparando', 'Entregado'];

export default function EstadoButtons({ estadoActual, orderId, onEstadoChange  }) {
  const [estado, setEstado] = useState(estadoActual);
  const [loading, setLoading] = useState(false);

  async function cambiarEstado(nuevoEstado) {
    setLoading(true);
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        estado: nuevoEstado,
      }),
    });

    if (res.ok) {
      setEstado(nuevoEstado);
      if (onEstadoChange) onEstadoChange(nuevoEstado); // 🔁 Notifica al padre
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
        >
          {e}
        </button>
      ))}
    </div>
  );
}
