import EstadoButtons from '@/components/EstadoButtons';
import PagadoInput from '@/components/PagadoInput';
import { getPedidoById } from '@/lib/getPedido';
import Link from 'next/link';

export default async function OrderPage({ params }) {
    const { orderId } = await params;
    const pedido = await getPedidoById(orderId);

    if (!pedido) return <div>Pedido no encontrado</div>;

    return (
        <div className='order_form'>
            <div className='form_header'>
                <div>
                    <img src="/favicon.ico" alt="logo paykuna" />
                </div>
                <div className='shop_data'>
                    <span className='title'>Almacén Paykuna | Almacén Orgánico</span>
                    <p><strong>Dirección:</strong> Carlos Croce 385</p>
                    <p><strong>Localidad:</strong> Lomas de Zamora</p>
                    <p><strong>Teléfono:</strong> 15-5928-0540</p>
                    <p><strong>Mail:</strong> paykunaalmacen@gmail.com</p>
                </div>
                <div className='order_data'>
                    <span className='title'>ORDEN</span>
                    <p><strong>Pedido:</strong> {pedido.id}</p>
                    <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}</p>
                    <p>{pedido.retiro === "envío" ? (
                        <strong>Pedido con envío</strong>
                    ) : (
                        <strong>Retira por almacén</strong>
                    )}
                    </p>
                    <p className='state'><strong>Estado: </strong>{pedido.estado}</p>
                </div>
            </div>
            <div className='form_client'>
                <span className='title'>DATOS DEL CLIENTE</span>
                <p><strong>Nombre: </strong>{pedido.nombre} {pedido.apellido}</p>
                <p><strong>Contacto: </strong>{pedido.telefono}</p>
                {pedido.retiro === "envío" && (
                    <p><strong>Dirección envío: </strong>{pedido.direccionCliente}, {pedido.localidadCliente}.</p>

                )}
                <p><strong>Email: </strong><Link href={`/admin/clients/${pedido.clienteId}`}>
                    <span title="Ver ficha de cliente">{pedido.email}</span>
                </Link></p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>P Unit</th>
                        <th>Total prod</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(pedido.carrito).map(([productId, item]) => (
                        <tr key={productId}>
                            <td>{item.nombre}</td>
                            <td>{item.cantidad}</td>
                            <td>${item.precio}</td>
                            <td>${item.precio * item.cantidad}</td>
                        </tr>
                    ))}
                    {pedido.retiro === "envío" && pedido.costoEnvio && (
                        <tr className='envio'>
                            <td>📦 Envío</td>
                            <td></td>
                            <td></td>
                            <td>${pedido.costoEnvio}</td>
                        </tr>
                    )}
                </tbody>

                <tfoot>
                    <tr>
                        <td><strong>TOTAL A PAGAR</strong></td>
                        <td></td>
                        <td></td>
                        <td>${pedido.total}</td>
                    </tr>
                    <tr>
                        <td><strong>TOTAL PAGADO</strong></td>
                        <td></td>
                        <td></td>
                        <td>${pedido.pagado ?? 0}</td>
                    </tr>
                    <tr
                        className={
                            (pedido.deuda !== 0 && (pedido.deuda != null || (pedido.total - (pedido.pagado ?? 0)) !== 0))
                                ? 'deuda-row'
                                : ''
                        }
                    >
                        <td><strong>{(pedido.deuda === 0 || (pedido.deuda == null && (pedido.total - (pedido.pagado ?? 0)) === 0)) ? 'SIN DEUDA' : 'DEUDA'}</strong></td>
                        <td></td>
                        <td></td>
                        <td>${pedido.deuda ?? (pedido.total - (pedido.pagado ?? 0))}</td>
                    </tr>
                </tfoot>
            </table>
            <div className='form_btns'>
                <div className='btns_update'>
                    <p><strong>Actualizar monto pagado: </strong></p>
                    <PagadoInput totalPedido={pedido.total} pagadoInicial={pedido.pagado ?? 0} orderId={pedido.id} />
                </div>
                <div className='btns_state'>
                    <p><strong>Modificar estado: </strong></p>
                    <EstadoButtons totalPedido={pedido.total} estadoActual={pedido.estado} orderId={pedido.id} />
                </div>
            </div>

            <Link href="/admin"><strong>⬅ Volver al panel de control</strong></Link>
        </div>
    );
}
