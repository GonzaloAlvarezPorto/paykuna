// src/app/admin/[pedidoId]/page.jsx

import fs from 'fs/promises';
import Link from 'next/link';
import path from 'path';

export default async function PedidoPage({ params }) {
    // Usamos pedidoId porque es el nombre del parámetro en la URL
    const { pedidoId } = await params;

    const filePath = path.join(process.cwd(), 'public', 'data', 'pedidos.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const pedidos = JSON.parse(data);

    // Busca el pedido utilizando pedidoId
    const pedido = pedidos.find(p => String(p.id) === String(pedidoId));

    if (!pedido) {
        return <div>Pedido no encontrado</div>;
    }

    return (
        <div>
            <h1>Pedido #{pedido.id}</h1>
            <p><strong>Email:</strong> {pedido.email}</p>
            <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}</p>
            <p><strong>Total:</strong> ${pedido.total}</p>
            <p><strong>Pagado:</strong> ${pedido.pagado ?? 0}</p>
            <p><strong>Deuda:</strong> ${pedido.deuda ?? (pedido.total - (pedido.pagado ?? 0))}</p>

            <h2>Productos:</h2>
            <ul>
                {Object.entries(pedido.carrito).map(([productId, item]) => (
                    <li key={productId}>
                        {item.nombre} x{item.cantidad} - ${item.precio}
                    </li>
                ))}
            </ul>
            <Link href="/admin">Volver al panel de control</Link>
        </div>
    );
}
