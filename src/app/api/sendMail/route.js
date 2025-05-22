//DEBERIA BORRARLO
// 
import nodemailer from 'nodemailer';

function generarResumenHTML(carrito) {
    let total = 0;

    const productos = Object.values(carrito)
        .map(producto => {
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
        .join('');

    return `
    <p>Resumen de tu pedido</p>
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
        <tr>
          <td colspan="3"><strong>Total</strong></td>
          <td><strong>$${total.toLocaleString()}</strong></td>
        </tr>
      </tfoot>
    </table>
  `;
}


export async function POST(request) {
    const { emailCliente, carrito } = await request.json();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.APP_PASSWORD,
        },
    });

    const resumenHTML = generarResumenHTML(carrito);

    const mailOptionsCliente = {
        from: process.env.ADMIN_EMAIL,
        to: emailCliente,
        subject: 'Resumen de tu pedido a Almacén Paykuna',
        html: resumenHTML,
    };

    const mailOptionsAdmin = {
        from: process.env.ADMIN_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: `Nuevo pedido de ${emailCliente}`,
        html: resumenHTML,
    };

    try {
        // Enviar correos
        await transporter.sendMail(mailOptionsCliente);
        await transporter.sendMail(mailOptionsAdmin);

        return new Response(
            JSON.stringify({ message: 'Correo enviado correctamente' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return new Response(
            JSON.stringify({ error: 'Hubo un error al enviar el correo' }),
            { status: 500 }
        );
    }
}
