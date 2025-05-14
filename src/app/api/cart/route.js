import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

const fileCostosPath = path.join(process.cwd(), "public", "data", "costosEnvio.json");
const costosEnvio = JSON.parse(fs.readFileSync(fileCostosPath, "utf-8"));

function generarResumenHTML(pedido) {
  const { carrito, retiro, direccionCliente, localidadCliente } = pedido;
  let total = 0;

  const productos = Object.values(carrito)
    .map((producto) => {
      const subtotal = producto.precio * producto.cantidad;
      total += subtotal;
      return `
        <tr>
          <td>${producto.nombre}</td>
          <td>${producto.cantidad}</td>
          <td>$${producto.precio.toLocaleString()}</td>
          <td>$${subtotal.toLocaleString()}</td>
        </tr>
      `;
    })
    .join("");

  let costoEnvio = 0;
if (retiro === "envio" && localidadCliente) {
  const localidad = costosEnvio.find((localidadObj) => localidadObj.nombre === localidadCliente);
  if (localidad) {
    costoEnvio = localidad.costo;
  }
}

  return `
    <h2>Resumen de tu pedido</h2>
    <p><strong>Retiro:</strong> ${retiro === "envio" ? "Envío a domicilio" : "Retiro en local"}</p>
    ${retiro === "envio" ? `
      <p><strong>Dirección:</strong> ${direccionCliente}</p>
      <p><strong>Localidad:</strong> ${localidadCliente}</p>
      <p><strong>Costo de envío:</strong> $${costoEnvio.toLocaleString()}</p>
    ` : ""}
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio Unitario</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${productos}
      </tbody>
      <tfoot>
        ${retiro === "envio" ? `
          <tr>
            <td colspan="3"><strong>Envío</strong></td>
            <td>$${costoEnvio.toLocaleString()}</td>
          </tr>` : ""}
        <tr>
          <td colspan="3"><strong>Total</strong></td>
          <td><strong>$${total.toLocaleString()}</strong></td>
        </tr>
      </tfoot>
    </table>
  `;
}

export async function POST(req) {
  try {
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
      (retiro === "envio" && (!direccionCliente || !localidadCliente))
    ) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // Cálculo del costo de envío
    let costoEnvio = 0;
    if (retiro === "envio" && localidadCliente) {
      const localidad = costosEnvio.find((localidadObj) => localidadObj.nombre === localidadCliente);
      if (localidad) {
        costoEnvio = localidad.costo;
      }
    }

    // Cálculo del total
    let total = 0;
    const productos = Object.values(carrito)
      .map((producto) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        return subtotal;
      })
      .join("");

    // Sumar costo de envío al total
    total += costoEnvio;

    // Inicialización de pagado y deuda
    const pagado = 0; // Este valor puede ser modificado según el pago inicial
    const deuda = total - pagado;

    // Guardado en archivo JSON
    const filePath = path.join(process.cwd(), "public", "data", "pedidos.json");
    const existe = fs.existsSync(filePath);
    const data = existe ? fs.readFileSync(filePath, "utf-8") : "[]";
    const carritos = JSON.parse(data);

    const ultimoId = carritos.reduce((max, pedido) => (pedido.id > max ? pedido.id : max), 0);

    const nuevoPedido = {
      id: ultimoId + 1,
      email: emailCliente,
      telefono: telefonoCliente,
      nombre: nombreCliente,
      apellido: apellidoCliente,
      retiro,
      tipoPago,
      carrito,
      direccionCliente: retiro === "envio" ? direccionCliente : "",
      localidadCliente: retiro === "envio" ? localidadCliente : "",
      costoEnvio,
      total, // Total final del pedido
      pagado, // Monto pagado (inicialmente vacío)
      deuda,  // Monto pendiente
      fecha: new Date().toISOString(),
    };

    carritos.push(nuevoPedido);
    fs.writeFileSync(filePath, JSON.stringify(carritos, null, 2));

    // Envío de email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const resumenHTML = generarResumenHTML(nuevoPedido);

    const mailOptionsCliente = {
      from: process.env.ADMIN_EMAIL,
      to: emailCliente,
      subject: "Resumen de tu pedido a Almacén Paykuna",
      html: resumenHTML,
    };

    const mailOptionsAdmin = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `Nuevo pedido de ${emailCliente}`,
      html: resumenHTML,
    };

    await transporter.sendMail(mailOptionsCliente);
    await transporter.sendMail(mailOptionsAdmin);

    return NextResponse.json({
      mensaje: "Pedido registrado y correos enviados correctamente",
      id: nuevoPedido.id,
    });

  } catch (error) {
    console.error("Error en el manejo del pedido:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

