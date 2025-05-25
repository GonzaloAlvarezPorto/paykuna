"use client"

import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const DeliveryCostsPage = () => {
    const [localidades, setLocalidades] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [form, setForm] = useState({ localidad: '', precio: '' });
    const [nuevaLocalidad, setNuevaLocalidad] = useState({ localidad: '', precio: '' });

    useEffect(() => {
        fetch("/api/deliveryCosts")
            .then((res) => res.json())
            .then((data) => setLocalidades(data))
            .catch((err) => console.error("Error cargando localidades:", err));
    }, []);

    const handlerEliminarLocalidad = async (id) => {
        try {
            const res = await fetch(`/api/deliveryCosts/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Error eliminando localidad");
            setLocalidades(localidades.filter((l) => l.id !== id));
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar la localidad");
        }
    };

    const handleEditarClick = (localidad) => {
        setEditandoId(localidad.id);
        setForm({ localidad: localidad.localidad, precio: localidad.precio });
    };

    const handleEditarLocalidad = async (id) => {
        try {
            const res = await fetch(`/api/deliveryCosts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    localidad: form.localidad,
                    precio: Number(form.precio)
                })
            });
            if (!res.ok) throw new Error("Error editando localidad");

            setLocalidades(localidades.map(l =>
                l.id === id ? { ...l, ...form, precio: Number(form.precio) } : l
            ));
            setEditandoId(null);
            setForm({ localidad: '', precio: '' });
        } catch (error) {
            console.error("Error actualizando costo:", error);
            alert("No se pudo editar la localidad");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

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
            const res = await fetch(`/api/deliveryCosts`, {
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
        <div className='costs_form'>
            <div className='form_addCost'>
                <p><strong>Agregar nueva tarifa</strong></p>
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
                <button onClick={handleCrearNuevaLocalidad}>Agregar</button>
            </div>

            <div className='form_editCost'>
                <p><strong>Editar o eliminar tarifa</strong></p>
                {localidades.map((loc) => (
                    <div key={loc.id}>
                        {editandoId === loc.id ? (
                            <div>
                                <input
                                    type="text"
                                    name="localidad"
                                    value={form.localidad}
                                    onChange={handleInputChange}
                                    placeholder="Localidad"
                                />
                                <input
                                    type="number"
                                    name="precio"
                                    value={form.precio}
                                    onChange={handleInputChange}
                                    placeholder="Precio"
                                />
                                <button onClick={() => handleEditarLocalidad(loc.id)}>💾 Guardar</button>
                                <button onClick={() => setEditandoId(null)}>✖ Cancelar</button>
                            </div>
                        ) : (
                            <div>
                                <strong>{loc.localidad}</strong>
                                <span>${loc.precio}</span> 
                                <button title='Editar' onClick={() => handleEditarClick(loc)}>🖋</button>
                                <button title="Eliminar" onClick={() => handlerEliminarLocalidad(loc.id)}>🗑</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <Link href={"/admin"}>⬅ Volver al panel de control</Link>
        </div>
    )
}

export default DeliveryCostsPage;
