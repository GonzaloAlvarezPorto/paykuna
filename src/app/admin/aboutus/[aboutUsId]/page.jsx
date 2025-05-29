"use client"

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const AboutUsIndividualAdminPage = () => {
  const params = useParams();
  const aboutUsId = params.aboutUsId;

  const [parrafo, setParrafo] = useState({
    order: '',
    parrafo: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!aboutUsId) return;

    fetch(`/api/aboutus/${aboutUsId}`)
      .then((res) => res.json())
      .then((data) => setParrafo(data))
      .catch((err) => console.error("Error cargando el párrafo:", err));
  }, [aboutUsId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParrafo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuardar = async () => {
    setLoading(true);
    try {
      const payload = {
        ...parrafo,
        order: Number(parrafo.order), // Aseguramos que sea número
      };

      // 🔍 Verificar si ya existe otro párrafo con ese mismo orden
      const resAll = await fetch('/api/aboutus');
      const allParrafos = await resAll.json();

      const ordenDuplicado = allParrafos.find(p =>
        p.order === payload.order && p._id !== aboutUsId
      );

      if (ordenDuplicado) {
        alert("Ya existe un párrafo con ese número de orden. Elegí otro.");
        return;
      }

      // ✅ Si no hay conflicto, hacer el PUT
      const res = await fetch(`/api/aboutus/${aboutUsId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log("Respuesta del backend:", data);

      if (!res.ok) {
        throw new Error(data.error || 'Error desconocido al guardar');
      }

      alert("Párrafo actualizado correctamente");
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al guardar los cambios");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarParrafo = async () => {
    try {
      await fetch(`/api/aboutus/${aboutUsId}`, {
        method: 'DELETE'
      });

      window.location.href = "/admin/aboutus";
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  return (
    <div className='sctnPnl'>
      <div className='subPnl'>
        <div className='pnlRow rightSpace'>
          <label className='title'>Orden:</label>
          <input
            type="number"
            name="order"
            value={parrafo.order}
            onChange={handleInputChange}
          />
        </div>

        <div className='pnlRow rightSpace'>
          <label className='title'>Párrafo:</label>
          <textarea
            className='addText rightSpace'
            name="parrafo"
            rows={6}
            value={parrafo.parrafo}
            onChange={handleInputChange}
          />
          <div className='pnlCol'>
            <button className='boxBtnB' onClick={handleGuardar} disabled={loading}>
              {loading ? "Guardando..." : "💾 Guardar"}
            </button>
            <button className='boxBtnB' onClick={handleEliminarParrafo}>
              🗑 Eliminar
            </button>
          </div>
        </div>
      </div>
      <Link className='backMenu' href={"/admin/aboutus"}>⬅ Volver al panel de control</Link>
    </div>
  );
};

export default AboutUsIndividualAdminPage;
