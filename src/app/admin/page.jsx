'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cantidadVisible, setCantidadVisible] = useState(3);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch('/api/pedidos');
        if (!response.ok) throw new Error('Error al obtener los pedidos');
        const data = await response.json();

        const pedidosOrdenados = data.sort((a, b) => b.pedidoId - a.pedidoId);
        setPedidos(pedidosOrdenados);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const verMas = () => {
    setCantidadVisible((prev) => prev + 3);
  };

  const hayMas = pedidos.length > cantidadVisible;

  return (
    <div className='admin_dashboard'>
      <strong><p className='dashboard_title'>Panel de administración</p></strong>

      {loading ? (
        <p>Cargando pedidos...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Fecha</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Monto total</th>
                <th>Monto pagado</th>
                <th>Deuda</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.slice(0, cantidadVisible).map((pedido) => (
                <tr key={pedido.pedidoId}>
                  <td className='id_pedido'>
                    <Link href={`/admin/${pedido.pedidoId}`}>
                      {pedido.pedidoId}
                    </Link>
                  </td>
                  <td>{new Date(pedido.fecha).toLocaleString()}</td>
                  <td>{pedido.email}</td>
                  <td>{pedido.estado}</td>
                  <td>${pedido.total}</td>
                  <td>${pedido.pagado}</td>
                  <td>${pedido.deuda}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {hayMas && (
            <div className='ver-mas-container'>
              <button onClick={verMas} className='ver-mas-btn'>Ver más</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
