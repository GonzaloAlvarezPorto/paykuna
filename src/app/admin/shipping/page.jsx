"use client"

import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const ShippingPage = () => {
    const [localidades, setLocalidades] = useState([]);
    const [nuevaLocalidad, setNuevaLocalidad] = useState({ localidad: '', precio: '' });
    const [loading, setLoading] = useState(true);

    const localidadesOrdenadas = [...localidades].sort((a, b) =>
        a.localidad.localeCompare(b.localidad)
    );

    useEffect(() => {
        fetch("/api/shipping")
            .then((res) => res.json())
            .then((data) => {
                setLocalidades(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error cargando localidades:", err);
                setLoading(false);
            });
    }, []);

    const handleNuevaLocalidadChange = (e) => {
        const { name, value } = e.target;
        setNuevaLocalidad(prev => ({ ...prev, [name]: value }));
    };

    const handleCrearNuevaLocalidad = async () => {
        if (!nuevaLocalidad.localidad || isNaN(Number(nuevaLocalidad.precio))) {
            alert("Por favor, completá una localidad válida y un precio numérico");
            return;
        }

        try {
            const res = await fetch(`/api/shipping`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    localidad: nuevaLocalidad.localidad,
                    precio: Number(nuevaLocalidad.precio)
                })
            });
            if (!res.ok) throw new Error("Error creando localidad");
            const nueva = await res.json();
            setLocalidades([...localidades, nueva]);
            setNuevaLocalidad({ localidad: '', precio: '' });
        } catch (error) {
            console.error("Error creando localidad:", error);
            alert("No se pudo crear la localidad");
        }
    };

    return (

        <div className='sctnPnl'>
            <div className='subPnl'>
                <div className='pnlCol rightSpace'>
                    <div className='divCol'>
                        <p className='title'>Agregar nueva tarifa</p>
                        <input
                            type="text"
                            name="localidad"
                            value={nuevaLocalidad.localidad}
                            onChange={handleNuevaLocalidadChange}
                            placeholder="Localidad"
                        />
                        <input
                            type="number"
                            name="precio"
                            value={nuevaLocalidad.precio}
                            onChange={handleNuevaLocalidadChange}
                            placeholder="Precio"
                        />
                        <button className='boxBtnB' onClick={handleCrearNuevaLocalidad}>Agregar</button>
                    </div>
                </div>

                <div className='pnlCol'>
                    <p className='title'>Tarifa</p>
                    {loading ? <p className='title'>Cargando tarifas...</p> : localidadesOrdenadas.map((loc) => (
                        <div className='divRow' key={loc.id}>
                            <Link className='link' href={`/admin/shipping/${loc.id}`}>{loc.localidad}</Link>
                            <span>${loc.precio}</span>
                        </div>
                    )
                    )}
                </div>
            </div >
            <Link className='backMenu' href={"/admin"}>⬅ Volver al panel de control</Link>
        </div>
    )
}

export default ShippingPage;
