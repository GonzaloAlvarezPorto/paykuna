import Link from 'next/link'
import React from 'react'

export const Logo = () => {
    return (
            <Link href={"/"} className="logo__link">
                <div className="logo__img">
                    <img src="/favicon.ico" alt="logo paykuna" />
                </div>
                <div className="logo__text">
                    <img src="/texto__almacen__paykuna.png"
                        alt="texto logo paykuna" />
                </div>
            </Link>
       
    )
}
