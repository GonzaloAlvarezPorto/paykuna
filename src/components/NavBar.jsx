"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import novedades from "../../public/data/novedades.json";

const EXPIRATION_TIME = 1 * 60 * 60 * 1000; // 1 hora en milisegundos

const NavBar = () => {
    const [showGallery, setShowGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        const galleryClosed = localStorage.getItem("galleryClosed");
        const closedTime = localStorage.getItem("galleryClosedTime");

        if (galleryClosed && closedTime) {
            const elapsedTime = Date.now() - parseInt(closedTime, 10);
            if (elapsedTime >= EXPIRATION_TIME) {
                localStorage.removeItem("galleryClosed");
                localStorage.removeItem("galleryClosedTime");
                setShowGallery(true);
            }
        } else {
            setShowGallery(true);
        }
    }, []);

    const toggleGallery = () => {
        setShowGallery(true);
        setCurrentIndex(0);
        setIsPlaying(true);
        localStorage.removeItem("galleryClosed");
        localStorage.removeItem("galleryClosedTime");
    };

    const closeGallery = () => {
        setShowGallery(false);
        setIsPlaying(false);
        localStorage.setItem("galleryClosed", "true");
        localStorage.setItem("galleryClosedTime", Date.now().toString()); // Guardamos la hora de cierre
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? novedades.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev === novedades.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        if (!showGallery || !isPlaying) return;

        const interval = setInterval(() => {
            nextImage();
        }, 2000);

        return () => clearInterval(interval);
    }, [showGallery, isPlaying, currentIndex]);

    return (
        <div className="nv__menu">
            <ul>
                <li>
                    <button className="link news" onClick={toggleGallery}>
                        <p>NOVEDADES</p>
                        <p className="news__btn">CLICK PARA VER</p>
                    </button>
                </li>
                <li>
                    <Link className="link" href="/nosotros">SOBRE NOSOTRES</Link>
                </li>
                <li>
                    <Link className="link" href="/catalogo">CATÁLOGO</Link>
                </li>
                <li>
                    <Link className="link" href="/cart">🛒</Link>
                </li>
                <li>
                    <p className="link counter">1</p>
                </li>
            </ul>

            {showGallery && (
                <div className="overlay">
                    <div className="gallery">
                        <button className="prev-btn" onClick={prevImage}>{"<"}</button>
                        <div className="carousel-content">
                            <div className="carousel-header">
                                <button className="playPause-btn" onClick={() => setIsPlaying(!isPlaying)}>
                                    {isPlaying ? "⏸" : "▶"}
                                </button>
                                <p className="newsTitle">NOVEDADES</p>
                                <button className="close-btn" onClick={closeGallery} title="Cerrar">X</button>
                            </div>
                            <div className="img-container">
                                <img src={novedades[currentIndex].image} alt={`Imagen ${currentIndex + 1}`} />
                            </div>
                            <div className="desc-container">
                                <p className="newsDesc">{novedades[currentIndex].descripcion}</p>
                            </div>
                            <Link className="goToChart" href={"/catalogo"} onClick={closeGallery} title="Ir al catálogo">Ver catálogo 🛒</Link>
                        </div>
                        <button className="next-btn" onClick={nextImage}>{">"}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavBar;
