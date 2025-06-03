"use client"

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const AnnouncementIndividualAdminPage = () => {

    const params = useParams();
    const router = useRouter();
    const announcementId = params.announcementId;

    const [announcement, setAnnouncement] = useState({
        descripcion: '',
        image: ''
    })

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!announcementId) return;

        fetch(`/api/announcements/${announcementId}`) // Realiza la solicitud al endpoint de la API
            .then((res) => res.json())                 // Convierte la respuesta en un objeto JSON || res.json() devuelve una promesa que, cuando se resuelve, te da data
            .then((data) => setAnnouncement(data))     // Actualiza el estado con los datos obtenidos
            .catch((err) => console.error("Error cargando novedad:", err)); // Muestra el error en consola si falla la solicitud
    }, [announcementId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAnnouncement({ ...announcement, [name]: value });
    }

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const { descripcion, image } = announcement; // Extrae solo los campos deseados
            const updateData = { descripcion, image };

            const res = await fetch(`/api/announcements/${announcementId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData)
            });

            if (res.ok) {
                alert("Novedad actualizada");
                setEditMode(false);
            } else {
                throw new Error("Error al actualizar");
            }
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al actualizar");
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        const confirm = window.confirm("¿Estás seguro de eliminar esta novedad?");
        if (!confirm) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/announcements/${announcementId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("Novedad eliminada");
                router.push("/admin/announcements");
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
        <div className='sctnPnlAnnouncements'>
            <div className="subPnl">
                <div className="pnlCol">
                    {editMode ? (
                        <div className='divCol'>
                            <p className='title'>Cambiar descripción:</p>
                            <textarea
                                className='addText'
                                type="text"
                                name="descripcion"
                                value={announcement.descripcion}
                                placeholder="Descripción"
                                onChange={handleInputChange}
                            />
                            <p className='title'>Cambiar imagen:</p>
                            <input
                                className='createInput'
                                type="text"
                                name="image"
                                value={announcement.image}
                                placeholder="URL de la imagen"
                                onChange={handleInputChange}
                            />
                            <button className='boxBtnB' disabled={loading} onClick={handleUpdate}>
                                {loading ? "Guardando..." : "Guardar cambios"}
                            </button>
                        </div>
                    ) : (
                        <div className="divCol">
                            <div className="row">
                                <span className='title'>Descripción oferta: </span><p className='txt'>{announcement.descripcion}</p>
                            </div>
                            <div className="row">
                                <span className='title'>Ruta imagen: </span><p className='txt'>{announcement.image}</p>
                            </div>
                            {announcement.image ? (
                                <div className="row">
                                    <img className='imgMuestra' src={announcement.image} alt="Vista previa" />
                                </div>
                            ) : null}
                            <div className="row">
                                <button className="boxBtnB rightSpace" onClick={() => setEditMode(true)}>🖋 Editar</button>
                                <button className='boxBtnB' disabled={loading} onClick={handleDelete}>
                                    {loading ? "Eliminando..." : "Eliminar red social"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Link className='backMenu' href={"/admin/announcements"}>⬅ Volver al panel de control</Link>
        </div>
    )
}

export default AnnouncementIndividualAdminPage