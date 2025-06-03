"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const SocialsAdminPage = () => {
    const [loading, setLoading] = useState(true);
    const [socials, setSocials] = useState([]);
    const [nuevaSocial, setNuevaSocial] = useState({
        descripcion: '',
        image: '',
        imagenRed: '',
        nombreRed: ''
    });

    useEffect(() => {
        fetch("/api/socials")
            .then((res) => res.json())
            .then((data) => {
                setSocials(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error cargando redes sociales:", err);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevaSocial({ ...nuevaSocial, [name]: value });
    };

    const handleSubmit = async () => {
        if (!nuevaSocial.imagenRed) return alert('Falta ingresar la URL de la imagen');
        if (!nuevaSocial.nombreRed) return alert('Falta ingresar el nombre de la red');

        try {
            const res = await fetch("/api/socials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaSocial)
            });

            if (res.ok) {
                const nueva = await res.json();
                setSocials([...socials, nueva]);
                setNuevaSocial({
                    descripcion: '',
                    enlaceRed: '',
                    imagenRed: '',
                    nombreRed: ''
                });
                alert("Red social creada");
            } else {
                throw new Error("Error al crear la red social");
            }
        } catch (err) {
            console.error(err);
            alert("Error al guardar la red social");
        }
    };

    return (
        <div className='sctnPnlSocials'>
            <div className='subPnl'>
                <div className='pnlCol rightSpace'>
                    <p className='title'>Agregar red social</p>
                    <input
                        className='createInput'
                        type="text"
                        name="nombreRed"
                        value={nuevaSocial.nombreRed}
                        placeholder="Nombre Red"
                        onChange={handleChange}
                    />
                    <input
                        className='createInput'
                        type="text"
                        name="descripcion"
                        value={nuevaSocial.descripcion}
                        placeholder="Descripción"
                        onChange={handleChange}
                    />
                    <input
                        className='createInput'
                        type="text"
                        name="enlaceRed"
                        value={nuevaSocial.enlaceRed}
                        placeholder="Enlace (https://...)"
                        onChange={handleChange}
                    />
                    <input
                        className='createInput'
                        type="text"
                        name="imagenRed"
                        value={nuevaSocial.imagenRed}
                        placeholder="URL de la imagen (https://...)"
                        onChange={handleChange}
                    />
                    <button className='boxBtnB' onClick={handleSubmit}>Crear</button>
                </div>

                <div className='pnlCol'>
                    <p className="title">Listado de redes sociales</p>
                    {
                        socials.map((social) => (
                            <div className='divRow btmSpace' key={social.id}>
                                <Link className="link" href={`/admin/socials/${social.id}`}>{social.nombreRed}</Link>
                                {social.imagenRed && <img className='imgSize' src={social.imagenRed} alt={social.nombreRed} />}
                            </div>
                        ))
                    }
                </div>
            </div>
            <Link className='backMenu' href={"/admin"}>⬅ Volver al panel de control</Link>
        </div>
    );
};

export default SocialsAdminPage;
