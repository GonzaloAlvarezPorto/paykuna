"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const AboutUsAdminPage = () => {
    const [parrafos, setParrafos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nuevoParrafo, setNuevoParrafo] = useState({ parrafo: '' });

    useEffect(() => {
        fetch("/api/aboutus")
            .then((res) => res.json())
            .then((data) => {
                setParrafos(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error cargando textos:", err);
                setLoading(false);
            });
    }, []);

    const handleNuevoParrafoChange = (e) => {
        const { name, value } = e.target;
        setNuevoParrafo((prev) => ({ ...prev, [name]: value }));
    };

    const handleCrearNuevoParrafo = async () => {
        if (!nuevoParrafo.parrafo.trim()) {
            alert("Por favor, ingresá el párrafo");
            return;
        }

        try {
            const res = await fetch(`/api/aboutus`, {
                method: "POST",  //
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ parrafo: nuevoParrafo.parrafo }),
            });

            if (!res.ok) throw new Error("Error creando párrafo");
            const nuevo = await res.json();
            setParrafos([...parrafos, nuevo]);
            setNuevoParrafo({ parrafo: '' });
        } catch (error) {
            console.error("Error creando párrafo:", error);
            alert("No se pudo crear el párrafo");
        }
    };

    return (
        <div className='sctnPnlAboutUs'>
            <div className='subPnl'>
                <div className='pnlCol rightSpace'>
                    <p className='title'>Agregar párrafo</p>
                    <input
                        className='addText'
                        type="text"
                        name="parrafo"
                        value={nuevoParrafo.parrafo}
                        placeholder="Párrafo"
                        onChange={handleNuevoParrafoChange}
                    />
                    <button className='boxBtnB' onClick={handleCrearNuevoParrafo}>Crear</button>
                </div>
                <div className='pnlCol'>
                    <span className='title'>Lista de párrafos</span>
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <ul>
                            {parrafos
                                .sort((a, b) => a.order - b.order)
                                .map((p) => (
                                    <li className='pnlRow' key={p.id}>
                                        <Link className='link' title={`Panel del texto ${p.order}`} href={`/admin/aboutus/${p.id}`}>{p.order}</Link>
                                        <span className='txt'>{p.parrafo}</span>
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>
            </div>
            <Link className='backMenu' href={"/admin"}>⬅ Volver al panel de control</Link>
        </div>
    );
};

export default AboutUsAdminPage;
