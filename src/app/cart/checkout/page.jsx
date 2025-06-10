"use client";
import { useCart } from "@/context/CartContext";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const CheckOutPage = () => {

  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [retiro, setRetiro] = useState("presencial");
  const [tipoPago, setTipoPago] = useState("efectivo");
  const [direccion, setDireccion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [localidadesDisponibles, setLocalidadesDisponibles] = useState([]);

  const { carrito, calcularTotalProductos, calcularTotal, actualizarCarrito } = useCart();
  const [cartLoaded, setCartLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/shipping")
      .then((res) => res.json())
      .then((data) => {
        setLocalidadesDisponibles(data); // Directamente setea el array de objetos
      })
      .catch((error) => console.error("Error al cargar las localidades:", error));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCartLoaded(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const carritoArray = Array.isArray(carrito) ? carrito : Object.values(carrito);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailCliente: email,
          telefonoCliente: telefono,
          nombreCliente: nombre,
          apellidoCliente: apellido,
          retiro,
          tipoPago,
          ...(retiro === "envio" && {
            direccionCliente: direccion,
            localidadCliente: localidad,
            costoEnvio,
          }),
          carrito: carritoArray,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        actualizarCarrito(() => ({}));
        toast.success(`El pedido fue enviado a ${email}. ¡Gracias por tu compra!`);
        router.push("/");
      } else {
        toast.error(`Error: ${data.error || "Hubo un error al procesar el pedido."}`);
      }
    } catch (error) {
      console.error("Error al enviar el carrito:", error);
      toast.error(`Error: ${error.message || "Hubo un error al enviar el carrito."}`);
    }
  };

  if (!cartLoaded) return <p>Cargando...</p>;

  return (
<div>
      <div>
        <p>Ya falta poco...</p>
        <form onSubmit={handleSubmit}>
          <span>
            <div>
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <label htmlFor="apellido">Apellido</label>
              <input id="apellido" type="text" required value={apellido} onChange={(e) => setApellido(e.target.value)} />
            </div>
            <div>
              <label htmlFor="email">Correo electrónico</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <label htmlFor="telefono">Teléfono</label>
              <input id="telefono" type="text" required value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
            <div>
              <label htmlFor="tipoPago">Forma de pago</label>
              <select id="tipoPago" value={tipoPago} onChange={(e) => setTipoPago(e.target.value)} required>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
              </select>
              <label htmlFor="retiro">Retiro</label>
              <select
                id="retiro"
                required
                value={retiro}
                onChange={(e) => {
                  setRetiro(e.target.value);
                  // Reiniciar envío si cambia a retiro en local
                  if (e.target.value !== "envio") {
                    setLocalidad("");
                    setCostoEnvio(0);
                  }
                }}
              >
                <option value="">Seleccionar</option>
                <option value="retiro">Retiro en el local</option>
                <option value="envio">Envío a domicilio</option>
              </select>
            </div>
            <div>
              {retiro === "envio" && (
                <>
                  <label htmlFor="direccion">Dirección</label>
                  <input
                    id="direccion"
                    type="text"
                    required
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />

                  <label htmlFor="localidad">Localidad</label>
                  <select
                    id="localidad"
                    required
                    value={localidad}
                    onChange={(e) => {
                      const localidadSeleccionada = localidadesDisponibles.find(
                        (localidad) => localidad.localidad === e.target.value
                      );
                      setLocalidad(localidadSeleccionada?.localidad || "");
                      setCostoEnvio(localidadSeleccionada?.precio || 0);
                    }}
                  >
                    <option value="">Seleccionar localidad</option>
                    {localidadesDisponibles.map(({ localidad, precio }) => (
                      <option key={localidad} value={localidad}>
                        {localidad} (+${precio})
                      </option>
                    ))}
                  </select>


                </>
              )}
            </div>
          </span>
          <button type="submit">Enviar</button>
          <span>
            <p><strong>Total de productos:</strong> {calcularTotalProductos()}</p>
            <p><strong>Total productos:</strong> ${calcularTotal()}</p>
            {retiro === "envio" && localidad && (
              <p><strong>Envío ({localidad}):</strong> ${costoEnvio}</p>
            )}
            <p><strong>Total a pagar:</strong> ${calcularTotal() + (retiro === "envio" ? costoEnvio : 0)}</p>
          </span>
        </form>
      </div>
    </div>
  );
};

export default CheckOutPage;
