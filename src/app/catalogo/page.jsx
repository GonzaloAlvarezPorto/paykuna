"use client";

import { useState, useEffect } from "react";

const CatalogoPage = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="catalogo">
      <div className="lat-menu">
        menu lateral, ahora te re cagué
      </div>
      <div className="products-container">
        {/* <h1>Catálogo de Productos</h1> */}
        {productos.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          <div className="products">
            {productos.map((producto) => (
              <div className="product-card" key={producto.id}>
                <h2>{producto.nombre}</h2>
                <div className="product-img-container">
                  <img className="product-img" src={producto.imagen} alt={producto.nombre} />
                </div>
                <p className="product-price">${producto.precio}</p>
                <div className="product-buttons">
                  <button className="minus-btn">-</button>
                  <input type="number" />
                  <button className="plus-btn">+</button>
                </div>
                <button className="product-add">Agregar al carrito</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogoPage;
