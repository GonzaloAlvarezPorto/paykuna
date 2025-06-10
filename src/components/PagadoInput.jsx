'use client';

import { useState } from 'react';

export default function PagadoInput({ pagadoInicial, totalCompra, orderId, onPagadoChange }) {
  const [input, setInput] = useState(0);
  const [pagado, setPagado] = useState(pagadoInicial);
  const [loading, setLoading] = useState(false);

  async function actualizarPagado() {
    const incremento = Number(input);
    if (isNaN(incremento) || incremento <= 0) {
      alert('Ingresá un monto válido');
      return;
    }

    const nuevoPagado = Math.min(pagado + incremento, totalCompra); // no excede el total
    setLoading(true);

    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pagado: nuevoPagado }),
    });

    if (res.ok) {
      setPagado(nuevoPagado);
      onPagadoChange(nuevoPagado); // notifica al padre
      setInput(0);
    } else {
      alert('Error al actualizar pagado');
    }

    setLoading(false);
  }

  async function completarPagado() {
    if (pagado >= totalCompra) return;
    setLoading(true);

    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pagado: totalCompra }),
    });

    if (res.ok) {
      setPagado(totalCompra);
      onPagadoChange(totalCompra); // notifica al padre
      setInput(0);
    } else {
      alert('Error al completar el pago');
    }

    setLoading(false);
  }

  return (
    <div>
      <input
        type="number"
        value={input}
        onChange={(e) => setInput(Number(e.target.value))}
        min={0}
        max={999999}
        disabled={loading || pagado >= totalCompra}
      />
      <button onClick={actualizarPagado} disabled={loading || pagado >= totalCompra}>
        Agregar
      </button>
      <button onClick={completarPagado} disabled={loading || pagado >= totalCompra}>
        Pago completo
      </button>
    </div>
  );
}
