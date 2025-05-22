'use client';

import { useState } from 'react';

export default function PagadoInput({ pagadoInicial, totalPedido, pedidoId }) {
  const [pagado, setPagado] = useState(pagadoInicial);
  const [input, setInput] = useState(0);
  const [loading, setLoading] = useState(false);

  async function actualizarPagado() {
    const incremento = Number(input);
    if (isNaN(incremento) || incremento <= 0) {
      alert('Ingresá un monto válido');
      return;
    }

    setLoading(true);

    const nuevoPagado = Math.min(pagado + incremento, totalPedido); // no excede el total

    const res = await fetch(`/api/pedidos/${pedidoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pagado: nuevoPagado }),
    });

    if (res.ok) {
      setPagado(nuevoPagado);
      setInput(0);
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
        onChange={e => setInput(Number(e.target.value))}
        min={0}
        max={999999}
        disabled={loading}
      />
      <button onClick={actualizarPagado} disabled={loading || pagado >= totalPedido}>
        Actualizar pagado
      </button>
    </div>
  );
}
