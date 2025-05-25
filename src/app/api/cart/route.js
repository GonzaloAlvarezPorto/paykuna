import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { enviarEmailsDePedido } from "@/lib/sendMail.js";
import { searchOrCreateClient } from "@/lib/clients.js"; // Debe estar adaptado a Firebase
import { db } from "@/lib/firebase.js";
import { collection, getDocs, addDoc, setDoc, doc } from "firebase/firestore";

//Esto debería sustituirlo para obtener los costos de envío desde firestore
const fileCostosPath = path.join(process.cwd(), "public", "data", "costosEnvio.json");

export async function POST(req) {
  try {
    // Leer costosEnvio JSON local
    const costosEnvioRaw = await fs.readFile(fileCostosPath, "utf-8");
    const costosEnvio = JSON.parse(costosEnvioRaw);

    const {
      emailCliente,
      telefonoCliente,
      nombreCliente,
      apellidoCliente,
      retiro,
      tipoPago,
      carrito,
      direccionCliente,
      localidadCliente,
    } = await req.json();

    // Validación
    if (
      !emailCliente || !carrito || !telefonoCliente ||
      !nombreCliente || !apellidoCliente || !retiro || !tipoPago ||
      (retiro === "envío" && (!direccionCliente || !localidadCliente))
    ) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // Buscar o crear cliente en Firestore
    const clienteId = await searchOrCreateClient(emailCliente);

    // Cálculo costo envío
    let costoEnvio = 0;
    if (retiro === "envío" && localidadCliente) {
      const localidad = costosEnvio.find((loc) => loc.nombre === localidadCliente);
      if (localidad) costoEnvio = localidad.costo;
    }

    // Calculo total carrito + envío
    let total = 0;
    Object.values(carrito).forEach(producto => {
      total += producto.precio * producto.cantidad;
    });
    total += costoEnvio;

    const pagado = 0;
    const deuda = total - pagado;

    // Obtener todos los pedidos para generar ID único (podrías mejorar con contador en Firestore)
    const pedidosSnapshot = await getDocs(collection(db, "pedidos"));
    const pedidos = pedidosSnapshot.docs.map(doc => doc.data());

    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const fechaFormato = `${anio}${mes}${dia}`;

    let nuevoIdNumerico = 1;
    let nuevoId;
    do {
      const correlativo = String(nuevoIdNumerico).padStart(4, '0');
      nuevoId = `P-${fechaFormato}-${correlativo}`;
      nuevoIdNumerico++;
    } while (pedidos.some(p => p.id === nuevoId));

    // Nuevo pedido
    const nuevoPedido = {
      id: nuevoId,
      clienteId,
      email: emailCliente,
      telefono: telefonoCliente,
      nombre: nombreCliente,
      apellido: apellidoCliente,
      retiro,
      tipoPago,
      carrito,
      direccionCliente: retiro === "envío" ? direccionCliente : "",
      localidadCliente: retiro === "envío" ? localidadCliente : "",
      costoEnvio,
      total,
      pagado,
      deuda,
      fecha: new Date().toISOString(),
      estado: "Por preparar",
    };

    // Guardar nuevo pedido en Firestore
    await setDoc(doc(db, "pedidos", nuevoPedido.id), nuevoPedido);

    // Enviar email
    await enviarEmailsDePedido(nuevoPedido);

    return NextResponse.json({
      mensaje: "Pedido registrado y correos enviados correctamente",
      id: nuevoPedido.id,
    });

  } catch (error) {
    console.error("Error en el manejo del pedido:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
