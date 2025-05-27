"use client"

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
    <div>
      <h1>Clientes</h1>
      {clients.length === 0 ? (
        <p>No hay clientes.</p>
      ) : (
        <ul>
          {clients.map((client) => (
            <li key={client.id}>
              <strong>ID:</strong> {client.id} — <strong>Email:</strong> {client.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientsPage;
