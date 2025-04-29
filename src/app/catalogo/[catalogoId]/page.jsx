"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ProductoPage = () => {
    const { catalogoId } = useParams();  // Asegúrate de que catalogoId esté siendo pasado aquí
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                <a href="/catalogo">Volver al catálogo</a>

                <button onClick={() => toast.success("Producto agregado al carrito")}>
                    <strong>Agregar al carrito</strong>
                </button>
            </div>
        </div>
    );
};

export default ProductoPage;
