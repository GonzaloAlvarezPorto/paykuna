"use client";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SocialPage = () => {
  const params = useParams();
  const router = useRouter();
  const socialId = params.socialId;

  const [social, setSocial] = useState({
    descripcion: '',
    enlaceRed: '',
    imagenRed: '',
    nombreRed: ''
  });

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!socialId) return;

    fetch(`/api/socials/${socialId}`)
      .then((res) => res.json())
      .then((data) => setSocial(data))
      .catch((err) => console.error("Error cargando la red:", err));
  }, [socialId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocial({ ...social, [name]: value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/socials/${socialId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(social)
      });

      if (res.ok) {
        alert("Red social actualizada");
        setEditMode(false);
      } else {
        throw new Error("Error al actualizar");
      }
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("¿Estás seguro de eliminar esta red social?");
    if (!confirm) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/socials/${socialId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Red social eliminada");
        router.push("/admin/socials");
      } else {
        throw new Error("Error al eliminar");
      }
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al eliminar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='sctnPnlSocials'>
      <div className='subPnl column'>
        <div className="pnlCol">
          {editMode ? (
            <div className='divCol'>
              <p className="title">Cambiar nombre de red:</p>
              <input
                className='createInput'
                type="text"
                name="nombreRed"
                value={social.nombreRed}
                placeholder="Nombre Red"
                onChange={handleChange}
              />
              <p className="title">Cambiar descripción de red:</p>
              <textarea
                className='addText'
                type="text"
                name="descripcion"
                value={social.descripcion}
                placeholder="Descripción"
                onChange={handleChange}
              />
              <p className="title">Cambiar enlace de la red:</p>
              <input
                className='createInput'
                type="text"
                name="enlaceRed"
                value={social.enlaceRed}
                placeholder="Enlace (https://...)"
                onChange={handleChange}
              />
              <p className="title">Cambiar logo de la red:</p>
              <input
                className='createInput'
                type="text"
                name="imagenRed"
                value={social.imagenRed}
                placeholder="URL de la imagen"
                onChange={handleChange}
              />
              <button className='boxBtnB' disabled={loading} onClick={handleUpdate}>
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          ) : (
            <div className='divCol'>
              <div className="divRow">
                <span className='title'>Red Social: </span>
                <p className='txt'>{social.nombreRed}</p>
              </div>
              <div className="divRow">
                <span className='title'>Descripción:</span>
                <p className='txt'>{social.descripcion}</p>
              </div>
              <div className="divRow">
                <span className='title'>Enlace:</span>
                <a className='link' href={social.enlaceRed} target="_blank">{social.enlaceRed}</a>
              </div>
              <div className="divRow jstfCntCntr">
                <button className='boxBtnB rightSpace' onClick={() => setEditMode(true)}>Editar</button>
                <button className='boxBtnB' disabled={loading} onClick={handleDelete}>
                  {loading ? "Eliminando..." : "Eliminar red social"}
                </button>
              </div>
            </div>
          )}

        </div>
        <Link className='backMenu' href={"/admin/socials"}>⬅ Volver al panel de control</Link>
      </div>
    </div>
  );
};

export default SocialPage;
