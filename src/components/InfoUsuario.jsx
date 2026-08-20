import { useUsuario } from "../hooks/useUsuario"
import { useSeccion } from "../hooks/useSeccions";
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import "./infoUsuario.css";
import { useAuth } from "../hooks/useAuth";

export function InfoUsuario() {
    const usuario= useUsuario();
    const auth= useAuth();
    const secciones = useSeccion();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    //Para que al apretar fuera se cierre el mini modal
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    //Falta poner las variables reales del usuario
    return (
        <div className="userCard" ref={menuRef}>
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
                {isMenuOpen && (
            <div className="kebabOpciones">
                <button className="itemMenu" onClick={secciones.perfil}>
                    Mi Perfil
                </button>
                <button className="itemMenu" onClick={secciones.configuracion}>
                    Configuración
                </button>
                <div className="itemMenuDivisor"></div>
                <button className="itemMenu logout" onClick={auth.manejoBotonLogout}>
                    Cerrar Sesión
                </button>
            </div>)}
        </div>
    );
}