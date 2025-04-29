import React from 'react'

const Sidebar = ({categorias, setCategoriaSeleccionada}) => {
    return (
        <div className="lat-menu">
            <ul>
                {categorias.map((categoria) => (
                    <li key={categoria} onClick={() => setCategoriaSeleccionada(categoria)}>
                        {categoria}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Sidebar;