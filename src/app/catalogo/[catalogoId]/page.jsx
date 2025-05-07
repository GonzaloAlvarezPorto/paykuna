"use client";

import { useCart } from "@/context/CartContext";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ProductoPage = () => {
    const { catalogoId } = useParams();  // Asegúrate de que catalogoId esté siendo pasado aquí
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [cantidades, setCantidades] = useState(0);

    const { actualizarCarrito } = useCart();

    useEffect(() => {
        if (catalogoId) {
            const fetchProducto = async () => {
                try {
                    console.log("Fetching producto con ID:", catalogoId);
                    setLoading(true);
                    const res = await fetch(`/api/products/${catalogoId}`);

                    if (!res.ok) throw new Error("Producto no encontrado");

                    const data = await res.json();
                    console.log("Producto recibido:", data);
                    setProducto(data);
                } catch (error) {
                    console.error("Error al obtener el producto:", error);
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchProducto();
        }
    }, [catalogoId]);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;
    if (!producto) return <div>No se encontró el producto.</div>;

    // Solo mostrar el origen si existe y tiene datos
    const mostrarOrigen = producto.origen && producto.origen.localidad && producto.origen.provincia;

    const handleCantidadChange = (id, cambio) => {
        setCantidades(prev => ({
            ...prev,
            [id]: Math.max((prev[id] || 0) + cambio, 0)
        }));
    };

    const handleAgregarAlCarrito = (producto, cantidad) => {
        actualizarCarrito(prev => {
            const actualizado = { ...prev };
            const cantidadActual = actualizado[producto.id]?.cantidad || 0;

            actualizado[producto.id] = {
                ...producto,
                cantidad: cantidadActual + cantidad
            };

            return actualizado;
        });

        toast(
            <div>
                {cantidad} {cantidad > 1 ? "unidades" : "unidad"} de <strong>{producto.nombre}</strong> agregado{cantidad > 1 ? "s" : ""} al carrito.
                <br /><br />
                Se suman <strong>${cantidad * producto.precio}</strong> al total final.
            </div>,
            { type: "success" }
        );

        setCantidades(prev => ({ ...prev, [producto.id]: 0 }));
    };

    return (
        <div className="producto-detail">
            <div className="img_container">
                <img src={producto.imagen} alt={producto.nombre} />
            </div>
            <div className="info_container">
                <div>
                    <p>{producto.nombre} - {producto.descripcion}</p>
                </div>
                <p>📋 <strong>Donde encontrarlo: </strong>{producto.categoria}</p>
                <p>💸 <strong>Precio: </strong>${producto.precio}</p>

                {mostrarOrigen && (
                    <p>🚩 <strong>Origen: </strong>{producto.origen.localidad}, {producto.origen.provincia}</p>
                )}
                <p>📦 <strong>Stock: </strong>disponible</p>
                <div className='count-btns'>
                    <button onClick={() => handleCantidadChange(producto.id, -1)}>-</button>
                    <input
                        type="number"
                        value={cantidades[producto.id] || 0}
                        min="0"
                        onChange={(e) => {
                            const nuevaCantidad = e.target.value === "" ? 0 : Math.max(parseInt(e.target.value), 0);
                            setCantidades(prev => ({ ...prev, [producto.id]: nuevaCantidad }));
                        }} />
                    <button onClick={() => handleCantidadChange(producto.id, 1)}>+</button>
                </div>
                <button className='add-btn' onClick={() => {
                        const cantidad = cantidades[producto.id] || 0;
                        if (cantidad > 0) {
                            handleAgregarAlCarrito(producto, cantidad);
                        }
                    }}
                    >
                        <strong>Agregar al carrito</strong>
                    </button>
                <a href="/catalogo">⬅ Volver al catálogo</a>
            </div>
        </div>
    );
};

export default ProductoPage;
