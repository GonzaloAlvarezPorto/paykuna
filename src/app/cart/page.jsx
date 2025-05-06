"use client";
import { useCart } from "@/context/CartContext";
import React from "react";

const CartPage = () => {
  const { carrito, actualizarCarrito, calcularTotalProductos } = useCart();

  const calcularTotal = () => {
    return Object.values(carrito).reduce((total, producto) => {
      return total + producto.precio * producto.cantidad;
    }, 0);
  };

  const vaciarCarrito = () => {
    actualizarCarrito(() => ({}));
    localStorage.removeItem("carrito");
  };

  const modificarCantidad = (id, cambio) => {
    actualizarCarrito((prev) => {
      const nuevoCarrito = { ...prev };

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
    <div className="cart">
      {Object.keys(carrito).length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div className="cart_resume">
          <ul>
            {Object.values(carrito).map((producto) => (
              <li key={producto.id}>
                <img src={producto.imagen} alt={producto.nombre} width="50" />
                <div className="resume_info">
                  <div className="info_header">
                    <strong>{producto.nombre}</strong>
                    <p>- Precio unitario: ${producto.precio}</p>
                  </div>
                  <div className="resume_btn">
                    <button onClick={() => modificarCantidad(producto.id, -1)}>➖</button>
                    <span>Cantidad pedida: </span>
                    <p>{producto.cantidad}</p>
                    <button onClick={() => modificarCantidad(producto.id, 1)}>➕</button>
                  </div>
                  <span>Total del producto: ${producto.precio * producto.cantidad}</span>
                </div>
              </li>
            ))}
          </ul>

          <div>
            Total: ${calcularTotal()} &nbsp; | &nbsp; Total productos: {calcularTotalProductos()}
          </div>
          <button onClick={vaciarCarrito}>🗑 Vaciar Carrito</button>
          <button>✅ Confirmar pedido</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
