"use client"
import React, { useEffect, useState } from 'react'

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error("Error cargando productos:", err));
    }, []);

    return (
        <div>
            <h1>AdminProductsPage</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>{product.categoria} - {product.nombre} - ${product.precio}</li>
                ))}
            </ul>
        </div>
    );
}

export default AdminProductsPage;
