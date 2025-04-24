"use client"

import React, { useEffect, useState } from 'react'

const NosotrosPage = () => {

  const [textos, setTextos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const res = await fetch('/data/nosotros.json');
        const data = await res.json();
        setTextos(data);
      } catch (error) {
        console.error('Error al cargar textos:', error)
      }
    };

    fetchData();
  }, []);
  return (
    <div className='aboutus'>
      <h2>¡Hola comunidad Payku!</h2>
      {textos.length > 0 ? (
        textos.map((texto, index) => (
          <p key={index}>
            {texto.parrafo}
          </p>
        ))
      ) : (<p>No hay nada que mostrar</p>)}
    </div>
  )
}

export default NosotrosPage;