'use client';

import { useState } from 'react';

export default function PagadoInput({ pagadoInicial, pedidoId }) {
  const [pagado, setPagado] = useState(pagadoInicial);
  const [input, setInput] = useState(pagadoInicial);
  const [loading, setLoading] = useState(false);

  async function actualizarPagado() {
    setLoading(true);
    const res = await fetch(`/api/pedidos/${pedidoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pagado: Number(input) }),
    });

    if (res.ok) {
      setPagado(input);
    } else {
      alert('Error al actualizar pagado');
    }
    setLoading(false);
  }

  return (
    <div>
      <input
        type="number"
        value={input}
        onChange={e => setInput(e.target.value)}
        min={0}
        max={999999}
        disabled={loading}
      />
      <button onClick={actualizarPagado} disabled={loading}>
        Actualizar pagado
      </button>
    </div>
  );
}
