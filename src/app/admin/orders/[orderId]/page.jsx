'use client';

import EstadoButtons from '@/components/EstadoButtons';
import PagadoInput from '@/components/PagadoInput';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderPage() {
    const { orderId } = useParams();
    const [pedido, setPedido] = useState(null);

    const [estadoPedido, setEstadoPedido] = useState('');
    const [estadoPagado, setEstadoPagado] = useState(0);

    useEffect(() => {
        fetch(`/api/orders/${orderId}`)
            .then((res) => res.json())
            .then((data) => setPedido(data))
            .catch((err) => console.error("No se pudo obtener el pedido:", err));
    }, [orderId]);

    if (!pedido) return <p>Cargando pedido...</p>;

    return (
        <div>
            <div>
                <div>
                    <img src="/favicon.ico" alt="logo paykuna" />
                </div>
                <div>
                    <span>Almacén Paykuna | Almacén Orgánico</span>
                    <p><strong>Dirección:</strong> Carlos Croce 385</p>
                    <p><strong>Localidad:</strong> Lomas de Zamora</p>
                    <p><strong>Teléfono:</strong> 15-5928-0540</p>
                    <p><strong>Mail:</strong> paykunaalmacen@gmail.com</p>
                </div>
                <div>
                    <span>ORDEN</span>
                    <p><strong>Pedido:</strong> {pedido.numeroOrden}</p>
                    <p><strong>Fecha del pedido:</strong> {pedido.fechaIngreso}</p>
                    <p>
                        {pedido.retiro === "envío" ? (
                            <strong>Pedido con envío</strong>
                        ) : (
                            <strong>Retira por almacén</strong>
                        )}
                    </p>
                    <p><strong>Estado: </strong>{estadoPedido}</p>
                </div>
            </div>

            <div>
                <span>DATOS DEL CLIENTE</span>
                <p><strong>Nombre: </strong>{pedido.nombreCliente} {pedido.apellidoCliente}</p>
                <p><strong>Contacto: </strong>{pedido.telefonoCliente}</p>
                {pedido.retiro === "envío" && (
                    <p><strong>Dirección envío: </strong>{pedido.direccionCliente}, {pedido.localidadCliente}.</p>
                )}
                <p>
                    <strong>Email: </strong>
                    <Link href={`/admin/clients/${pedido.clienteId}`}>
                        <span title="Ver ficha de cliente">{pedido.emailCliente}</span>
                    </Link>
                </p>
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
                        <tr>
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
                        <td>${pedido.totalCompra}</td>
                    </tr>
                    <tr>
                        <td><strong>TOTAL PAGADO</strong></td>
                        <td></td>
                        <td></td>
                        <td>${estadoPagado}</td>
                    </tr>
                    <tr>
                        <td>
                            <strong>
                                {(pedido.totalCompra - estadoPagado) <= 0 ? 'SIN DEUDA' : 'DEUDA'}
                            </strong>
                        </td><td></td>
                        <td></td>
                        <td>${pedido.totalCompra - estadoPagado}</td>
                    </tr>
                </tfoot>
            </table>

            <div>
                <div>
                    <p><strong>Agregar monto pagado: </strong></p>
                    <PagadoInput totalCompra={pedido.totalCompra} pagadoInicial={pedido.pagado ?? 0} orderId={pedido.id} onPagadoChange={setEstadoPagado} />
                </div>
                <div>
                    <p><strong>Modificar estado: </strong></p>
                    <EstadoButtons totalCompra={pedido.totalCompra} estadoActual={pedido.estado} orderId={pedido.id} onEstadoChange={setEstadoPedido} />
                </div>
            </div>

            <Link className='backMenu' href="/admin/orders">⬅ Volver al panel de control</Link>
        </div>
    );
}
