import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { enviarEmailsDePedido } from "../../../lib/sendMail.js"

const fileCostosPath = path.join(process.cwd(), "public", "data", "costosEnvio.json");
const fileClientesPath = path.join(process.cwd(), "public", "data", "clientes.json");

async function obtenerClienteId(email) {
  let clientes = [];

  // Leer archivo si existe
  try {
    const dataClientes = await fs.readFile(fileClientesPath, "utf-8");
    clientes = JSON.parse(dataClientes);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
    // Si el archivo no existe, se inicializa vacío
  }

  // Buscar si el mail ya está registrado
  let cliente = clientes.find(c => c.email === email);
  if (cliente) return cliente.id;

  // Generar ID nuevo
  const nuevoId = `C-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  cliente = { id: nuevoId, email };
  clientes.push(cliente);

  // Guardar archivo actualizado
  await fs.writeFile(fileClientesPath, JSON.stringify(clientes, null, 2));
  return nuevoId;
}

export async function POST(req) {
  try {
    // Leo costosEnvio JSON aquí con await
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

    // Cálculo costo envío
    let costoEnvio = 0;
    if (retiro === "envío" && localidadCliente) {
      const localidad = costosEnvio.find((loc) => loc.nombre === localidadCliente);
      if (localidad) {
        costoEnvio = localidad.costo;
      }
    }

    // Calculo total
    let total = 0;
    Object.values(carrito).forEach(producto => {
      total += producto.precio * producto.cantidad;
    });
    total += costoEnvio;

    // Inicializar pagado y deuda
    const pagado = 0;
    const deuda = total - pagado;

    // Ruta archivo pedidos
    const filePath = path.join(process.cwd(), "public", "data", "pedidos.json");

    // Leer archivo pedidos (async + try/catch para existencia)
    let data = "[]";
    try {
      data = await fs.readFile(filePath, "utf-8");
    } catch (e) {
      if (e.code !== "ENOENT") throw e; // si error no es "no existe" relanzar
    }
    const carritos = JSON.parse(data);

    // Generar ID nuevo
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
    } while (carritos.some(p => p.id === nuevoId));

    const clienteId = await obtenerClienteId(emailCliente);
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
      estado: "Por preparar"
    };

    carritos.push(nuevoPedido);

    // Guardar nuevo pedido
    await fs.writeFile(filePath, JSON.stringify(carritos, null, 2));

    // Envío de email
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



