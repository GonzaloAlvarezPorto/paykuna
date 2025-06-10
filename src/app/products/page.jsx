"use client";

import ProductCard from "@/components/ProductCard";
import Sidebar from "@/components/Sidebar";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ProductsPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos los productos");
  const [cantidades, setCantidades] = useState({});

  const { carrito, actualizarCarrito, calcularCantidadPorId } = useCart();

  useEffect(() => {
    // Acceder a localStorage solo en el cliente
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
      actualizarCarrito(() => JSON.parse(carritoGuardado));
    }

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
    actualizarCarrito(prev => {
      const actualizado = { ...prev };
      const cantidadActual = actualizado[producto.id]?.cantidad || 0;

      actualizado[producto.id] = {
        ...producto,
        cantidad: cantidadActual + cantidad
      };

      return actualizado;
    });

    toast(
      <div>
        {cantidad} {cantidad > 1 ? "unidades" : "unidad"} de <strong>{producto.nombre}</strong> agregado{cantidad > 1 ? "s" : ""} al carrito.
        <br /><br />
        Se suman <strong>${cantidad * producto.precio}</strong> al total final.
      </div>,
      { type: "success" }
    );

    setCantidades(prev => ({ ...prev, [producto.id]: 0 }));
  };

  const productosFiltrados = categoriaSeleccionada === "Todos los productos"
    ? productos
    : productos.filter(producto => producto.categoria === categoriaSeleccionada);

  return (
    <div>
      <Sidebar categorias={categorias} setCategoriaSeleccionada={setCategoriaSeleccionada}></Sidebar>
      <div>
        {productosFiltrados.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          <div>
            {productosFiltrados.map((producto) => (
              <ProductCard key={producto.id}
                producto={producto}
                cantidades={cantidades}
                setCantidades={setCantidades}
                handleCantidadChange={handleCantidadChange}
                handleAgregarAlCarrito={handleAgregarAlCarrito}
                calcularCantidadPorId={calcularCantidadPorId}
              >
              </ProductCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
