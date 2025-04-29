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

    return (
        <div className="producto-detail">
            <p>{producto.nombre}</p>
            <img src={producto.imagen} alt={producto.nombre} />
            <p>{producto.descripcion}</p>
            <p>Precio: ${producto.precio}</p>
            <button onClick={() => toast.success("Producto agregado al carrito")}>
                Agregar al carrito
            </button>
        </div>
    );
};

export default ProductoPage;
