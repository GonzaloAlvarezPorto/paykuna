'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';

export default function ClientPage({ params }) {

  const resolvedParams = use(params);
  const { clientId } = resolvedParams;

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deudaTotal, setDeudaTotal] = useState(0);
  const [cliente, setCliente] = useState("")

  useEffect(() => {
    if (!clientId) return;

    const fetchData = async () => {
      try {
        const [pedidosRes, clientesRes] = await Promise.all([
          fetch('/api/pedidos'),
          fetch('/api/clientes')
        ]);

        if (!pedidosRes.ok || !clientesRes.ok) {
          console.error('Error en fetch');
          setLoading(false);
          return;
        }

        const pedidosData = await pedidosRes.json();
        const clientesData = await clientesRes.json();

        const pedidosCliente = pedidosData.filter(p => p.clienteId === clientId);
        const deuda = pedidosCliente.reduce(
          (acc, pedido) => acc + (Number(pedido.deuda) || 0),
          0
        );

        const clienteInfo = clientesData.find(c => c.id === clientId);

        setPedidos(pedidosCliente);
        setDeudaTotal(deuda);
        setCliente(clienteInfo?.email || 'No encontrado');
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  if (loading) return <p>Cargando ficha del cliente...</p>;

  return (
    <div className='client_form'>
      <div className="client_header">
        <span className='title'>DATOS DEL CLIENTE</span>
        <div>
          <p><strong>Mail cliente: </strong>{cliente}</p>
          <p><strong>Id cliente: </strong>{clientId}</p>
        </div>
      </div>
      <div className='client_pedidos'>
        {pedidos.length === 0 ? (
          <p>Este cliente no tiene pedidos.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Deuda</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.pedidoId}>
                  <td><Link href={`/admin/pedidos/${pedido.pedidoId}`}>
                    <span title='Ver pedido'>{pedido.pedidoId}</span>
                  </Link></td>
                  <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                  <td>{pedido.estado}</td>
                  <td>${pedido.deuda}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td><strong>TOTAL ADEUDADO</strong></td>
                <td></td>
                <td></td>
                <td>${deudaTotal}</td>
              </tr>
            </tfoot>
          </table>
        )}

      </div>
      <Link href="/admin"><strong>⬅ Volver al panel de control</strong></Link>
    </div>
  );
}
