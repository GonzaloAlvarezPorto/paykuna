"use client"

import Link from "next/link";
import React, { useEffect, useState } from "react";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/clients");
        if (!res.ok) throw new Error("Error al obtener los clientes");

        const data = await res.json();
        setClients(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los clientes");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <div>Cargando clientes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="sctnPnl">
      {clients.length === 0 ? (
        <p>No hay clientes.</p>
      ) : (
        <div className="pnlCol">
          <p className="title">Listado de clientes</p>
          <table>
            <thead className="title">
              <tr>
                <th>Email</th>
                <th>Nombre completo</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <Link className="link" href={`/admin/clients/${client.id}`}>
                      {client.email}
                    </Link>
                  </td>
                  <td className="txt">{client.nombre} {client.apellido}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      )}
      <Link className='backMenu' href="/admin">⬅ Volver al panel de control</Link>
    </div>
  );
};

export default ClientsPage;
