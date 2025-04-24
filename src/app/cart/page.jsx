"use client"
import React, { useState, useEffect } from "react";

const CartPage = () => {
  const [carrito, setCarrito] = useState({});

  // Cargar el carrito desde localStorage cuando se monta el componente
  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  // Calcular el total del carrito
  const calcularTotal = () => {
    return Object.values(carrito).reduce((total, producto) => {
      return total + producto.precio * producto.cantidad;
    }, 0);
  };

  // Calcular el total de productos (cantidad total de productos)
  const calcularTotalProductos = () => {
    return Object.values(carrito).reduce((total, producto) => {
      return total + producto.cantidad;
    }, 0);
  };

  // Vaciar el carrito
  const vaciarCarrito = () => {
    setCarrito({});
    localStorage.removeItem("carrito");
  };

  // Modificar cantidad de un producto en el carrito
  const modificarCantidad = (id, cambio) => {
    setCarrito((prev) => {
      const nuevoCarrito = JSON.parse(JSON.stringify(prev)); // Copia profunda para evitar problemas de referencia
  
      if (nuevoCarrito[id]) {
        nuevoCarrito[id].cantidad = Math.max(nuevoCarrito[id].cantidad + cambio, 0);
  
        if (nuevoCarrito[id].cantidad === 0) {
          delete nuevoCarrito[id];
        }
      }
  
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
      return nuevoCarrito;
    });
  };

  return (
    <div>
      <h1>🛒 Carrito de Compras</h1>

      {Object.keys(carrito).length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div>
          <ul>
            {Object.values(carrito).map((producto) => (
              <li key={producto.id}>
                <img src={producto.imagen} alt={producto.nombre} width="50" />
                <strong>{producto.nombre}</strong> - {producto.cantidad} x ${producto.precio}
                <span> = ${producto.precio * producto.cantidad}</span>
                <button onClick={() => modificarCantidad(producto.id, -1)}>➖</button>
                <button onClick={() => modificarCantidad(producto.id, 1)}>➕</button>
              </li>
            ))}
          </ul>

          <h3>
            Total: ${calcularTotal()} &nbsp; | &nbsp; Total productos: {calcularTotalProductos()}
          </h3>
          <button onClick={vaciarCarrito}>🗑 Vaciar Carrito</button>
          <button>✅ Confirmar pedido</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
