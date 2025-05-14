'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch('/api/pedidos');
        if (!response.ok) throw new Error('Error al obtener los pedidos');
        const data = await response.json();

        const pedidosOrdenados = data.sort((a, b) => b.pedidoId - a.pedidoId)
        setPedidos(pedidosOrdenados);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className='admin_dashboard'>
      <strong><p className='dashboard_title'>Panel de administración</p></strong>

      {loading ? (
        <p>Cargando pedidos...</p>
      ) : (
        <ul>
          {pedidos.map((pedido) => (
            <li key={pedido.pedidoId}>
              <Link href={`/admin/${pedido.pedidoId}`}>
                <p><strong>ID Pedido:</strong> {pedido.pedidoId}</p>
                <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}</p>
                <p><strong>Email:</strong> {pedido.email}</p>
                <p><strong>Estado:</strong> ""</p>
                <p><strong>Deuda:</strong> ${pedido.deuda}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
