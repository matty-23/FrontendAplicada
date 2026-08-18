import { useUsuario } from "../hooks/useUsuario"
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import "./infoUsuario.css";

export function InfoUsuario() {
    const { usuario, imagen } = useUsuario();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    //Esto hay que cambiar/mover al hook
    // useEffect(() => {
    //     function handleClickOutside(event) {
    //         if (menuRef.current && !menuRef.current.contains(event.target)) {
    //             setIsMenuOpen(false);
    //         }
    //     }
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => document.removeEventListener("mousedown", handleClickOutside);
    // }, []);

    //Falta cambiar nombres de las clases y definir bien las funciones (NO OLVIDAR CSS)
    // {
    //     isMenuOpen && (
    //         <div className="kebab-dropdown">
    //             <button className="dropdown-item" onClick={() => console.log("Perfil")}>
    //                 <i className="fas fa-user"></i> Mi Perfil
    //             </button>
    //             <button className="dropdown-item" onClick={() => console.log("Configuración")}>
    //                 <i className="fas fa-cog"></i> Configuración
    //             </button>
    //             <div className="dropdown-divider"></div>
    //             <button className="dropdown-item logout" /*onClick={logout}*/>
    //                 <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
    //             </button>
    //         </div>
    //     )
    // }

    //Falta cambiar esto por las verdaderas variables
    return (
        <div className="userCard">
            <div className="userImage">
                {"initials"}
            </div>

            <div className="userInfo">
                <div className="userRol">
                    {"Invitado"}
                </div>
                <div className="userEmail">
                    {"Usuario"}
                </div>
            </div>
            <div className="kebabMenu" onClick={() => setIsMenuOpen(!isMenuOpen)}>⋮ </div>


        </div>
    );
}