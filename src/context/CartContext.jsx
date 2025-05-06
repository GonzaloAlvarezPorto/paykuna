"use client"
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [carrito, setCarrito] = useState(() => {
        const guardado = localStorage.getItem("carrito");
        return guardado ? JSON.parse(guardado) : {};
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

    return (
        <CartContext.Provider value={{ carrito, calcularTotalProductos, actualizarCarrito }}>
            {children}
        </CartContext.Provider>
    );
};


export const useCart = () => {
    return useContext(CartContext);
}