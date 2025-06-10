"use client"

import React, { useEffect, useState } from 'react'

const NosotrosPage = () => {

  const [textos, setTextos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const res = await fetch('/api/aboutus');
        const data = await res.json();
        setTextos(data);
      } catch (error) {
        console.error('Error al cargar textos:', error)
      }
    };

    fetchData();
  }, []);
  return (
    <div className='sctnPnl'>
      <h1>¡Hola comunidad Payku!</h1>
      {textos.length > 0 ? (
        textos.map((texto, index) => (
          <p className='txt padd1rem' key={index}>
            {texto.parrafo}
          </p>
        ))
      ) : (<p>No hay nada que mostrar</p>)}

      <p className='padd1rem tnks'>
        Gracias por estar del otro lado. Caminemos juntxs.
      </p>
      <p className='padd1rem team'>
        El equipo de Almacén Paykuna
      </p>
    </div>
  )
}

export default NosotrosPage;