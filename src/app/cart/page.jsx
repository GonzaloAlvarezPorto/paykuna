"use client";
import { useCart } from "@/context/CartContext";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CartPage = () => {
  const { carrito, actualizarCarrito, calcularTotalProductos } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const calcularTotal = () => {
    return Object.values(carrito).reduce((total, producto) => {
      return total + producto.precio * producto.cantidad;
    }, 0);
  };

  const vaciarCarrito = () => {
    actualizarCarrito(() => ({}));

    toast(
      <div>
        Carrito vaciado
      </div>,
      { type: "success" }
    );
    localStorage.removeItem("carrito");
  };

  const handleCambiar = (id, cambio) => {
    const producto = carrito[id];
    if (producto) {
      const nuevoCarrito = {
        ...carrito,
        [id]: { ...producto, cantidad: producto.cantidad + cambio },
      };
      actualizarCarrito(() => nuevoCarrito);

      toast(
        <div>
          Unidad de <strong>{producto.nombre}</strong> {cambio > 0 ? "añadida al" : "eliminada del"} carrito.
          <br /><br />
        </div>,
        { type: "success" }
      );
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    }
  };

  if (!isClient) return null; // ⚠️ Evita render hasta que estés en el cliente

  return (
    <div className="cart">
      {Object.keys(carrito).length === 0 ? (
        <div className="cart_message">
          <span>
            <p>Tu carrito está vacío volvé a nuestro catálogo para ver nuestros productos y precios.</p>
            <a href="/catalogo"><strong>⬅ Ir al catálogo</strong></a>
          </span>
        </div>
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
                    <button onClick={() => handleCambiar(producto.id, -1)}>➖</button>
                    <span>Cantidad pedida: </span>
                    <p>{producto.cantidad}</p>
                    <button onClick={() => handleCambiar(producto.id, 1)}>➕</button>
                  </div>
                  <span>Total del producto: ${producto.precio * producto.cantidad}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="btns_resume">
            <div>
              <span>
                <p>Total a pagar por la compra:</p>
                <p className="mount">${calcularTotal()}</p>
              </span>
              <span>
                <p>Total de productos comprados:</p>
                <p className="mount">{calcularTotalProductos()}</p>
              </span>
              <button onClick={vaciarCarrito}>🗑 Vaciar Carrito</button>
              <button>✅ Confirmar pedido</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
