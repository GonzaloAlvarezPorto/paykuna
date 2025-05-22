import nodemailer from 'nodemailer';

function generarResumenHTML(pedido) {
  const { carrito, retiro, direccionCliente, localidadCliente, costoEnvio } = pedido;
  let total = 0;

  const productos = Object.values(carrito).map(producto => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;
    return `
      <tr>
        <td>${producto.nombre}</td>
        <td>${producto.cantidad}</td>
        <td>${producto.precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
        <td>${subtotal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
      </tr>
    `;
  }).join('');

  const totalFinal = total + (retiro === "envío" ? costoEnvio : 0);

  return `
    <p>Resumen de tu pedido</p>
    <p><strong>Retiro:</strong> ${retiro === "envío" ? "Envío a domicilio" : "Retiro en local"}</p>
    ${retiro === "envío" ? `
      <p><strong>Dirección:</strong> ${direccionCliente}</p>
      <p><strong>Localidad:</strong> ${localidadCliente}</p>
      <p><strong>Costo de envío:</strong> ${costoEnvio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p>
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
        ${retiro === "envío" ? `
          <tr>
            <td colspan="3"><strong>Envío</strong></td>
            <td>${costoEnvio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
          </tr>` : ""}
        <tr>
          <td colspan="3"><strong>Total</strong></td>
          <td><strong>${totalFinal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</strong></td>
        </tr>
      </tfoot>
    </table>
  `;
}

export async function enviarEmailsDePedido(pedido) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const resumenHTML = generarResumenHTML(pedido);

  const mailOptionsCliente = {
    from: `"Almacén Paykuna" <${process.env.ADMIN_EMAIL}>`,
    to: pedido.email,
    subject: 'Resumen de tu pedido a Almacén Paykuna',
    html: resumenHTML,
  };

  const mailOptionsAdmin = {
    from: process.env.ADMIN_EMAIL,
    to: [process.env.ADMIN_EMAIL],
    subject: `Nuevo pedido de ${pedido.email}`,
    html: resumenHTML,
  };

  try {
    await transporter.sendMail(mailOptionsCliente);
    await transporter.sendMail(mailOptionsAdmin);
  } catch (err) {
    console.error("Error enviando emails:", err);
  }
}
