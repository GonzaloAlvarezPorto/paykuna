import EstadoButtons from '@/components/EstadoButtons';
import PagadoInput from '@/components/PagadoInput';
import fs from 'fs/promises';
import Link from 'next/link';
import path from 'path';

export default async function PedidoPage({ params }) {
    const { pedidoId } = await params;

    const filePath = path.join(process.cwd(), 'public', 'data', 'pedidos.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const pedidos = JSON.parse(data);

    const pedido = pedidos.find(p => String(p.id) === String(pedidoId));

    if (!pedido) {
        return <div>Pedido no encontrado</div>;
    }

    return (
        <div>
            <p>Pedido #{pedido.id} para {pedido.retiro === "envio" ? "enviar a " : "retirar por almacén de "}{pedido.nombre} {pedido.apellido}</p>
            <p>Email: {pedido.email}</p>

            {pedido.retiro === "envio" && (
                <p>Se debe enviar a: {pedido.direccionCliente}, {pedido.localidadCliente}.</p>
            )}
            <p>Fecha: {new Date(pedido.fecha).toLocaleString()}</p>
            <p>Total: ${pedido.total}</p>
            <p>Pagado: ${pedido.pagado ?? 0}</p>

            <PagadoInput pagadoInicial={pedido.pagado ?? 0} pedidoId={pedido.id} />

            <p>Deuda: ${pedido.deuda ?? (pedido.total - (pedido.pagado ?? 0))}</p>
            <p>Estado: {pedido.estado}</p>

            <p>Modificar estado:</p>
            <EstadoButtons estadoActual={pedido.estado} pedidoId={pedido.id} />

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
