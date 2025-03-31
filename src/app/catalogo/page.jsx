"use client";

import ProductCard from "@/components/ProductCard";
import Sidebar from "@/components/Sidebar";
import Tooltip from "@/components/Tooltip";
import { useState, useEffect } from "react";

const CatalogoPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos los productos");
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();
        setProductos(data);

        // Extraer categorías únicas
        const categoriasUnicas = ["Todos los productos", ...new Set(data.map((producto) => producto.categoria))];
        setCategorias(categoriasUnicas);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductos();
  }, []);

  const handleCantidadChange = (id, cambio) => {
    setCantidades(prev => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) + cambio, 0)
    }));
  };

  const productosFiltrados = categoriaSeleccionada === "Todos los productos"
    ? productos
    : productos.filter(producto => producto.categoria === categoriaSeleccionada);

  return (
    <div className="catalogo">
      <Sidebar categorias={categorias} setCategoriaSeleccionada={setCategoriaSeleccionada}></Sidebar>
      <div className="products-container">
        {productosFiltrados.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          <div className="products">
            {productosFiltrados.map((producto) => (
              <ProductCard key={producto.id}
              producto={producto}
              cantidades={cantidades}
              setCantidades={setCantidades}
              handleCantidadChange={handleCantidadChange}
              setTooltip={setTooltip}></ProductCard>
            ))}
          </div>
        )}
      </div>
      {tooltip.visible && (
        <Tooltip tooltip={tooltip}></Tooltip>
      )}
    </div>
  );
};

export default CatalogoPage;