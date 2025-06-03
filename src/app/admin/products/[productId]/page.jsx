"use client"
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const ProductIndividualAdminPage = () => {

  const params = useParams();
  const productId = params.productId;
  const router = useRouter();

  const [product, setProduct] = useState({
    categoria: '',
    descripcion: '',
    imagen: '',
    nombre: '',
    precio: ''
  });

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!productId) return;

    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error al cargar:", err))
  }, [productId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
      });

      if (res.ok) {
        alert("Producto actualizado");
        setEditMode(false);
      } else {
        throw new Error("Error al actualizar");
      }
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("¿Estás seguro de eliminar?");
    if (!confirm) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Producto eliminado");
        router.push("/admin/products");
      } else {
        throw new Error("Error al eliminar");
      }
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al eliminar");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='sctnPnlPrdcts'>
      {editMode ? (
        <div className='pnlCol'>
          <div className='divCol'>
            <p className="title">Cambiar nombre del producto:</p>
            <input
              className='createInput'
              type="text"
              name="nombre"
              value={product.nombre}
              placeholder="Nombre producto"
              onChange={handleChange}
            />
            <p className="title">Cambiar categoría del producto:</p>
            <input
              className='createInput'
              type="text"
              name="categoria"
              value={product.categoria}
              placeholder="Categoría producto"
              onChange={handleChange}
            />
            <p className="title">Cambiar descripción del producto:</p>
            <input
              className='createInput'
              type="text"
              name="descripcion"
              value={product.descripcion}
              placeholder="Descripción"
              onChange={handleChange}
            />
            <p className="title">Cambiar precio del producto:</p>
            <input
              className='createInput'
              type="number"
              name="precio"
              value={product.precio}
              placeholder="Precio"
              onChange={handleChange}
            />
            <p className="title">Cambiar foto del producto:</p>
            <input
              className='createInput'
              type="text"
              name="imagen"
              value={product.imagen}
              placeholder="URL de la imagen"
              onChange={handleChange}
            />
            <button className='boxBtnB' disabled={loading} onClick={handleUpdate}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      ) : (
        <div className='pnlCol'>
          <p className="title">Editar o eliminar producto</p>
          <div className='divRow'>
            <p className='title'>{product.nombre}</p>
            <p className='txt'>{product.categoria}</p>
            <p className='txt'>{product.descripcion}</p>
            <p className='txt'>${product.precio}</p>
            <button className='boxBtnB rightSpace' onClick={() => setEditMode(true)}>🖋 Editar</button>
            <button className='boxBtnB' disabled={loading} onClick={handleDelete}>
              {loading ? "Eliminando..." : "🗑 Eliminar"}
            </button>
          </div>
        </div>
      )}
      <Link className='backMenu' href={"/admin/products"}>⬅ Volver al panel de control</Link>
    </div>
  )
}

export default ProductIndividualAdminPage