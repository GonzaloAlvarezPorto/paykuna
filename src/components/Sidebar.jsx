import React from 'react'

const Sidebar = ({categorias, setCategoriaSeleccionada}) => {
    return (
        <div className="lat-menu">
            <ul>
                {categorias.map((categoria) => (
                    <li key={categoria} onClick={() => setCategoriaSeleccionada(categoria)} style={{ cursor: "pointer" }}>
                        {categoria}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Sidebar;