import React from 'react';

const ProductCard = ({ producto, cantidades, setCantidades, handleCantidadChange, setTooltip, handleAgregarAlCarrito }) => {

    return (
        <div className="product-card" key={producto.id}>
            <div className="product-title">
                <h2>{producto.nombre}</h2>
                <p
                    className="product-info"
                    onMouseEnter={(e) => setTooltip({ visible: true, text: producto.descripcion, x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setTooltip({ visible: false, text: "", x: 0, y: 0 })}
                >
                    ℹ
                </p>
            </div>
            <div className="product-img-container">
                <img className="product-img" src={producto.imagen} alt={producto.nombre} />
            </div>
            <p className="product-price">${producto.precio}</p>
            <div className="product-buttons">
                <button className="minus-btn" onClick={() => handleCantidadChange(producto.id, -1)}>-</button>
                <input
                    type="number"
                    value={cantidades[producto.id] || 0}
                    min="0"
                    onChange={(e) => {
                        const nuevaCantidad = e.target.value === "" ? 0 : Math.max(parseInt(e.target.value), 0);
                        setCantidades(prev => ({ ...prev, [producto.id]: nuevaCantidad }));
                    }}
                    style={{ textAlign: "center", width: "50px" }}
                />
                <button className="plus-btn" onClick={() => handleCantidadChange(producto.id, 1)}>+</button>
            </div>
            <button
                className="product-add"
                onClick={() => {
                    const cantidad = cantidades[producto.id] || 0;
                    if (cantidad > 0) {
                        handleAgregarAlCarrito(producto, cantidad);
                    }
                }}
            >
                Agregar al carrito
            </button>
        </div>
    );
};

export default ProductCard;
