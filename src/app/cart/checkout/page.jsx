"use client";
import { useCart } from "@/context/CartContext";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 👈 Importar router

const CheckOutPage = () => {
  const [email, setEmail] = useState("");
  const { carrito, calcularTotalProductos, calcularTotal, actualizarCarrito } = useCart();
  const [cartLoaded, setCartLoaded] = useState(false);
  const router = useRouter(); // 👈 Instanciar router

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCartLoaded(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email ingresado:", email);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, carrito })
      });

      if (response.ok) {
        alert(`Correo recibido: ${email}. El carrito ha sido guardado.`);

        // Vaciar carrito
        actualizarCarrito(() => ({}));

        // Redireccionar a inicio
        router.push("/"); // 👈 Redirección
      } else {
        const data = await response.json();
        alert(`Error: ${data.error || 'Hubo un error al guardar el carrito.'}`);
      }
    } catch (error) {
      console.error("Error al enviar el carrito:", error);
      alert("Hubo un error al enviar el carrito.");
    }
  };

  if (!cartLoaded) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h1>Finalizar pedido</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <h3>Total de productos: {calcularTotalProductos()}</h3>
          <h3>Total a pagar: ${calcularTotal()}</h3>
        </div>

        <div>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default CheckOutPage;
