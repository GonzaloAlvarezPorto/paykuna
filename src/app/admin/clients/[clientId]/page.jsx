'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClientPage() {

  const params = useParams();
  const clientId = params.clientId;

  const [client, setClient] = useState({
    email: '',
    nombre: '',
    apellido: ''
  });

  useEffect(() => {
    if (!clientId) return;

    fetch(`/api/clients/${clientId}`)
      .then((res) => res.json())
      .then((data) => setClient(data))
      .catch((err) => console.error("Error cargando al cliente: ", err));
  }, [clientId])

  return (
    <div className='sctnPnl'>
      {/*Este pnlCol es sobre el cliente, 
      acá se editan datos o se eliminaría de ser necesario*/}
      <div className='pnlCol'>
        <span className='title'>DATOS DEL CLIENTE</span>
        <div className='divRow'>
          <p className='title rightSpace'>Email: </p>
          <p className='txt'>{client.email}</p>
        </div>
        <div className='divRow'>
          <p className="title rightSpace">Nombre completo: </p>
          <p className='txt'>{client.nombre} {client.apellido}</p>
        </div>
        <div className='divRow jstfCntCntr'>
          <button className="boxBtnB rightSpace">Editar</button>
          <button className="boxBtnB">Eliminar</button>
        </div>
      </div>
      {/*Este pnlCol es sobre los pedidos del cliente, 
      para ver el listado de pedidos que tiene, 
      se debería hacer un fetch al pedido para 
      entrar en cada uno de querer editarlo*/}
      <div className='pnlCol'>
        <table>
          <thead className='title'>
            <tr>
              <th>ID Pedido</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Deuda</th>
            </tr>
          </thead>
          <tbody>
            {/* aca tengo que hacer el fetch para obtener 
            los pedidos? */}
          </tbody>
          <tfoot>
            <tr>
              <td><strong>TOTAL ADEUDADO</strong></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <Link className='backMenu' href="/admin/clients">⬅ Volver al panel de control</Link>
    </div>
  );
}
