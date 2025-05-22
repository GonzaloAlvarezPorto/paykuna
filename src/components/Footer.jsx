'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export const Footer = () => {
    const [redes, setRedes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/redes');
                const data = await res.json();
                setRedes(data);
            } catch (error) {
                console.error('Error al cargar redes:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <footer className='pieDePagina'>
            <div className='pieDePagina__redes'>
                <div className='redes__contenedores'>
                    {redes.length > 0 ? (
                        redes.map((red, index) => (
                            <div key={index} className='contenedores__enlace'>
                                <Link href={red.enlaceRed} target='_blank'>
                                    <img src={red.imagenRed} className='enlace__imagen' alt={red.descripcion} />
                                </Link>
                                <Link href={red.enlaceRed} className='enlace__texto' target='_blank'>
                                    {red.descripcion}
                                </Link>
                            </div>
                        ))
                    ) : (<p>Cargando redes sociales...</p>)}
                </div>
            </div>
            <div className='pieDePagina__derechos'>
                <p>
                    Derechos reservados por Almacén Orgánico / Agroecológico Paykuna
                </p>
                <img className='derechos__imagen' src='/favicon.ico' alt="Logo Paykuna"/>
            </div>
        </footer>
    );
};
