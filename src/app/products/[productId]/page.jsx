"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ProductoPage = () => {
    const { productId } = useParams();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cantidades, setCantidades] = useState({});

    const { actualizarCarrito, calcularCantidadPorId } = useCart();

    useEffect(() => {
        if (!productId) return;

        const fetchProducto = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/products/${productId}`);
                if (!res.ok) throw new Error("Producto no encontrado");

                const data = await res.json();
                setProducto(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducto();
    }, [productId]);

    const mostrarOrigen = producto?.origen?.localidad && producto?.origen?.provincia;

    const handleCantidadChange = (id, cambio) => {
        setCantidades(prev => ({
            ...prev,
            [id]: Math.max((prev[id] || 0) + cambio, 0)
        }));
    };

    const handleInputChange = (e, id) => {
        const nuevaCantidad = e.target.value === "" ? 0 : Math.max(parseInt(e.target.value), 0);
        setCantidades(prev => ({ ...prev, [id]: nuevaCantidad }));
    };

    const handleAgregarAlCarrito = (producto, cantidad) => {
        if (cantidad <= 0) return;

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

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;
    if (!producto) return <p>No se encontró el producto.</p>;

    return (
        <div>
            {/* <div>
        <img src={producto.imagen} alt={producto.nombre} />
      </div> */}

            <h2>{producto.nombre}</h2>
            <p>{producto.descripcion}</p>

            <p><strong>Categoría:</strong> {producto.categoria}</p>
            <p><strong>Precio:</strong> ${producto.precio}</p>

            {mostrarOrigen && (
                <p><strong>Origen:</strong> {producto.origen.localidad}, {producto.origen.provincia}</p>
            )}

            <p><strong>Stock:</strong> disponible</p>
            <p>
                <strong>En carrito:</strong> {calcularCantidadPorId(producto.id)}
                <Link href="/cart">(ver carrito)</Link>
            </p>

            <div>
                <button onClick={() => handleCantidadChange(producto.id, -1)}>-</button>
                <input
                    type="number"
                    value={cantidades[producto.id] || 0}
                    min="0"
                    onChange={(e) => handleInputChange(e, producto.id)}
                />
                <button onClick={() => handleCantidadChange(producto.id, 1)}>+</button>
            </div>

            <button onClick={() => handleAgregarAlCarrito(producto, cantidades[producto.id] || 0)}>
                Agregar al carrito
            </button>

            <p>
                <Link href="/products">⬅ Volver al catálogo</Link>
            </p>
        </div>
    );
};

export default ProductoPage;
