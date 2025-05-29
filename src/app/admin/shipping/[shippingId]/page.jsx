"use client"
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const ShippingIndividualPage = () => {

    const [localidad, setLocalidad] = useState([]);
    const [editando, setEditando] = useState(false);
    const [form, setForm] = useState({
        localidad: '',
        precio: ''
    });

    const params = useParams();
    const shippingId = params.shippingId;

    useEffect(() => {
        if (!shippingId) return;

        fetch(`/api/shipping/${shippingId}`)
            .then((res) => res.json())
            .then((data) => setLocalidad(data))
            .catch((err) => console.error("Error cargando localidad:", err));
    }, []);

    const handleEditarClick = () => {
        setEditando(true);
        setForm({
            localidad: localidad.localidad,
            precio: localidad.precio
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleGuardar = async () => {
        try {
            const res = await fetch(`/api/shipping/${shippingId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();
            setLocalidad(data);
            setEditando(false);
        } catch (err) {
            console.error("Error al guardar:", err);
        }
    };

    const handlerEliminarLocalidad = async () => {
        try {
            await fetch(`/api/shipping/${shippingId}`, {
                method: 'DELETE'
            });
            // Redirigir al panel después de eliminar
            window.location.href = "/admin/shipping";
        } catch (err) {
            console.error("Error al eliminar:", err);
        }
    };

    return (
        <div className='sctnPnl'>
            <div className='pnlCol'>
                <p className='title'>Editar o eliminar tarifa</p>
                {editando ? (
                    <div className='divCol'>
                        <input
                            type="text"
                            name="localidad"
                            value={form.localidad}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="precio"
                            value={form.precio}
                            onChange={handleInputChange}
                        />
                        <div>
                            <button className='boxBtnB' onClick={handleGuardar}>💾 Guardar</button>
                            <button className='boxBtnB' onClick={() => setEditando(false)}>✖ Cancelar</button>
                        </div>
                    </div>
                ) : (
                    <div className='divRow'>
                        <strong>{localidad.localidad}</strong>
                        <p>${localidad.precio}</p>
                        <button className='boxBtnB' title='Editar' onClick={handleEditarClick}>🖋</button>
                        <button className='boxBtnB' title='Eliminar' onClick={handlerEliminarLocalidad}>🗑</button>
                    </div>
                )}
            </div>
            <Link className='backMenu' href={"/admin/shipping"}>⬅ Volver al panel de control</Link>
        </div>

    )
}

export default ShippingIndividualPage