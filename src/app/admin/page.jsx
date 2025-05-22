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

        const pedidosOrdenados = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
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
      <span className='title'>PANEL DE ADMINISTRACIÓN</span>

      {loading ? (
        <p>Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p>No hay pedidos registrados.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Fecha</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Tipo</th>
                <th>Total</th>
                <th>Pagado</th>
                <th>Deuda</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.slice(0, cantidadVisible).map((pedido) => (
                <tr key={pedido.pedidoId}>
                  <td>
                    <strong><Link href={`/admin/pedidos/${pedido.pedidoId}`}>
                      <span title='Ver pedido'>{pedido.pedidoId}</span>
                    </Link></strong>
                  </td>
                  <td>{new Date(pedido.fecha).toLocaleString()}</td>
                  <td>{pedido.nombreCompleto}</td>
                  <td>
                    <Link href={`/admin/clients/${pedido.clienteId}`}>
                      <span title="Ver ficha de cliente">{pedido.email}</span>
                    </Link>
                  </td>
                  <td>{pedido.estado}</td>
                  <td>{pedido.retiro.charAt(0).toUpperCase() + pedido.retiro.slice(1)}</td>
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
