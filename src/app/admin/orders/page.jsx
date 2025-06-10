"use client"

import Link from 'next/link';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const OrdersPage = () => {

    const params = useParams();
    const orderId = params.orderId;

    const [orders, setOrders] = useState([])


    useEffect(() => {
        fetch('/api/orders')
            .then((res) => res.json())
            .then((data) => setOrders(data))
            .catch((err) => console.error("No se pudieron obtener los pedidos:", err));
    }, [orderId])

    return (
        <div>
            <span>PANEL DE ADMINISTRACIÓN</span>
            <div>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id}>
                            <div className='divRow'>
                                <Link className="link" href={`/admin/orders/${order.id}`}>
                                    {order.numeroOrden}
                                </Link>
                                <p>{order.nombreCliente}</p>
                                <p>{order.apellidoCliente}</p>
                                <p>{order.emailCliente}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay pedidos para mostrar</p>
                )}
            </div>
        </div>
    )
}

export default OrdersPage