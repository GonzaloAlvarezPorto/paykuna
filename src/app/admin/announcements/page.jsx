"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const AnnouncementsAdminPage = () => {
    const [loading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);
    const [nuevaAnnouncement, setNuevaAnnouncement] = useState({
        descripcion: '',
        image: ''
    });
    const [zoomedImage, setZoomedImage] = useState(null);


    useEffect(() => {
        fetch("/api/announcements")
            .then((res) => res.json())
            .then((data) => {
                setAnnouncements(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error cargando Novedades:", err);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevaAnnouncement({ ...nuevaAnnouncement, [name]: value });
    };

    const handleSubmit = async () => {
        if (!nuevaAnnouncement.image) return alert('Falta ingresar la URL de la imagen');
        if (!nuevaAnnouncement.descripcion) return alert('Falta ingresar la descripción');

        try {
            const res = await fetch("/api/announcements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaAnnouncement)
            });

            if (res.ok) {
                const nueva = await res.json();
                setAnnouncements([...announcements, nueva]);
                setNuevaAnnouncement({
                    descripcion: '',
                    image: ''
                });
                alert("Novedad creada");
            } else {
                throw new Error("Error al crear novedades");
            }
        } catch (err) {
            console.error(err);
            alert("Error al guardar novedades");
        }
    };

    return (
        <div className='sctnPnl'>
            <div className='subPnl'>
                <div className='pnlCol jstfCntFlxStrt rightSpace'>
                    <p className='title'>Agregar Novedad</p>
                    <input
                        className='createInput'
                        type="text"
                        name="descripcion"
                        value={nuevaAnnouncement.descripcion}
                        placeholder="Descripción"
                        onChange={handleChange}
                    />
                    <input
                        className='createInput'
                        type="text"
                        name="image"
                        value={nuevaAnnouncement.image}
                        placeholder="URL de la imagen (https://...)"
                        onChange={handleChange}
                    />
                    <button className='boxBtnB' onClick={handleSubmit}>Crear</button>
                </div>

                <div className='pnlCol medio'>
                    <p className="title">Listado de novedades</p>
                    {
                        announcements.map((announcement) => (
                            <div className='divRow alngItmsCntr btmSpace' key={announcement.id}>
                                <Link className="link tresCuartos" href={`/admin/announcements/${announcement.id}`}>{announcement.descripcion}</Link>
                                {announcement.image && (
                                    <img
                                        className='imgSize clickable-img'
                                        src={announcement.image}
                                        alt={announcement.image}
                                        onClick={() => setZoomedImage(announcement.image)}
                                    />
                                )}
                            </div>
                        ))
                    }
                </div>
            </div>
            <Link className='backMenu' href={"/admin"}>⬅ Volver al panel de control</Link>
            {zoomedImage && (
                <div className="zoom-modal" onClick={() => setZoomedImage(null)}>
                    <img src={zoomedImage} alt="Zoom" className="zoomed-img" />
                </div>
            )}
        </div>
    );
};

export default AnnouncementsAdminPage;
