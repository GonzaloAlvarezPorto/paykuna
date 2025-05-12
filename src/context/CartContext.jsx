//danimendezrighi dejar de seguir si no me lo devuelve y a belen.varcasia lo mismo

"use client"
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [carrito, setCarrito] = useState(() => {
        // Verificar si estamos en el navegador antes de usar localStorage
        if (typeof window !== 'undefined') {
            const guardado = localStorage.getItem("carrito");
            return guardado ? JSON.parse(guardado) : {};
        }
        return {}; // Retorna un objeto vacío si no estamos en el navegador
    });

    useEffect(() => {
        const carritoGuardado = localStorage.getItem("carrito");
        if (carritoGuardado) {
            setCarrito(JSON.parse(carritoGuardado))
        }
    }, []);

    const actualizarCarrito = (callback) => {
        setCarrito((prev) => {
            const nuevo = callback(prev);
            localStorage.setItem("carrito", JSON.stringify(nuevo));
            return nuevo;
        });
    };


    const calcularTotalProductos = () => {
        return Object.values(carrito).reduce((total, producto) => total + producto.cantidad, 0);
    };

    const calcularTotal = () => {
        return Object.values(carrito).reduce((total, producto) => {
            return total + producto.precio * producto.cantidad;
        }, 0);
    };

    const calcularCantidadPorId = (id) => {
        // Filtra los productos que coinciden con el id y suma las cantidades
        return Object.values(carrito).reduce((total, producto) => {
            if (producto.id === id) {
                return total + producto.cantidad;
            }
            return total;
        }, 0);
    };


    return (
        <CartContext.Provider value={{ carrito, calcularTotalProductos, actualizarCarrito, calcularTotal, calcularCantidadPorId }}>
            {children}
        </CartContext.Provider>
    );
};


export const useCart = () => {
    return useContext(CartContext);
}