"use client";

import ProductCard from "@/components/ProductCard";
import Sidebar from "@/components/Sidebar";
import Tooltip from "@/components/Tooltip";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const CatalogoPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos los productos");
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });
  const [cantidades, setCantidades] = useState({});
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : {};
  });


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

  const handleAgregarAlCarrito = (producto, cantidad) => {
    let nuevoCarrito;

    setCarrito(prev => {
      const actualizado = { ...prev };
      const cantidadActual = actualizado[producto.id]?.cantidad || 0;

      actualizado[producto.id] = { ...producto, cantidad: cantidadActual + cantidad };
      localStorage.setItem("carrito", JSON.stringify(actualizado));

      nuevoCarrito = actualizado;
      return actualizado;
    });

    toast(
      <div>
        {cantidad} {cantidad > 1 ? "unidades" : "unidad"} de <strong>{producto.nombre}</strong> agregado{cantidad > 1 ? "s" : ""} al carrito.
        <br /><br />
        Se suman <strong>${cantidad * producto.precio}</strong> al total final.
      </div>,
      { type: "success" } // Esto reemplaza a toast.success
    );

    setCantidades(prev => ({ ...prev, [producto.id]: 0 }));
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
                setTooltip={setTooltip}
                handleAgregarAlCarrito={handleAgregarAlCarrito}
              >
              </ProductCard>
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