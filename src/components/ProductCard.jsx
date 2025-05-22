import Link from 'next/link';
import React from 'react';

const ProductCard = ({ producto, cantidades, setCantidades, handleCantidadChange, handleAgregarAlCarrito,calcularCantidadPorId }) => {

    return (
        <div className="product-card" key={producto.id}>
            <div className='product-img'>
                <img src={producto.imagen} alt={producto.nombre} />
            </div>
            <div className='product-info'>
                <div className='product-title'>
                    <a href={`/products/${producto.id}`}>{producto.nombre}</a>
                    <p className='precio'>-</p>
                    <p className='precio'>${producto.precio} p/u</p>
                </div>
                <div className='count-btns'>
                    <button onClick={() => handleCantidadChange(producto.id, -1)}>-</button>
                    <input
                        type="number"
                        value={cantidades[producto.id] || 0}
                        min="0"
                        onChange={(e) => {
                            const nuevaCantidad = e.target.value === "" ? 0 : Math.max(parseInt(e.target.value), 0);
                            setCantidades(prev => ({ ...prev, [producto.id]: nuevaCantidad }));
                        }}
                    />
                    <button onClick={() => handleCantidadChange(producto.id, 1)}>+</button>
                    <button className='add-btn' onClick={() => {
                        const cantidad = cantidades[producto.id] || 0;
                        if (cantidad > 0) {
                            handleAgregarAlCarrito(producto, cantidad);
                        }
                    }}
                    >
                        Agregar al carrito
                    </button>
                </div>
                <p>🛒 <strong>Cantidad en el <Link href="/cart">carrito</Link>:</strong> {calcularCantidadPorId(producto.id)}</p>
            </div>
        </div>
    );
};

export default ProductCard;
