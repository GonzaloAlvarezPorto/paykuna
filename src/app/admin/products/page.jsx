"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [nuevoProduct, setNuevoProduct] = useState({
        categoria: '',
        descripcion: '',
        imagen: '',
        nombre: '',
        precio: ''
    })

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error("Error cargando productos:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevoProduct({ ...nuevoProduct, [name]: value });
    };

    const handleSubmit = async () => {
        if (!nuevoProduct.nombre) return alert('Falta ingresar nombre');
        if (!nuevoProduct.categoria) return alert('Falta ingresar categoría');
        if (!nuevoProduct.descripcion) return alert('Falta ingresar la descripción');
        if (!nuevoProduct.precio) return alert('Falta ingresar precio');
        if (!nuevoProduct.imagen) return alert('Falta ingresar la URL de la imagen');

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoProduct)
            });

            if (res.ok) {
                const nuevo = await res.json();
                setProducts([...products, nuevo]);
                setNuevoProduct({
                    categoria: '',
                    descripcion: '',
                    imagen: '',
                    nombre: '',
                    precio: ''
                });
                alert("Producto creado");
            } else {
                throw new Error("Error al crear productos");
            }
        } catch (err) {
            console.error(err);
            alert("Error al guardar productos");
        }
    };

    return (
        <div className='sctnPnl'>
            <div className="subPnl">
                <div className="pnlCol rightSpace">
                    <div className="divCol">
                        <p className="title">Crear producto</p>
                        <input className='createInput' type="text" name="nombre" value={nuevoProduct.nombre} onChange={handleChange} placeholder="Nombre" />
                        <input className='createInput' type="text" name="categoria" value={nuevoProduct.categoria} onChange={handleChange} placeholder="Categoría" />
                        <input className='createInput' type="text" name="descripcion" value={nuevoProduct.descripcion} onChange={handleChange} placeholder="Descripción" />
                        <input className='createInput' type="text" name="precio" value={nuevoProduct.precio} onChange={handleChange} placeholder="Precio" />
                        <input className='createInput' type="text" name="imagen" value={nuevoProduct.imagen} onChange={handleChange} placeholder="URL Imagen" />
                        <button className='boxBtnB' onClick={handleSubmit}>Agregar producto</button>
                    </div>
                </div>
                <div className="pnlCol">
                    <table>
                        <thead className='title bckGClr2'>
                            <tr>
                                <th>Categoría</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...products]
                                .sort((a, b) => a.categoria.localeCompare(b.categoria))
                                .map((product) => (
                                    <tr className='txt' key={product.id}>
                                        <td>{product.categoria}</td>
                                        <td>
                                            <Link className='link' href={`/admin/products/${product.id}`}>{product.nombre}</Link>
                                        </td>
                                        <td>{product.descripcion}</td>
                                        <td>${product.precio}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Link className='backMenu' href={"/admin"}>⬅ Volver al panel de control</Link>
        </div>
    );
}

export default AdminProductsPage;
