import React from 'react';
import { InfoUsuario } from "./InfoUsuario";
import "./sideBar.css";

export function SideBar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-bottom">
        <InfoUsuario />
      </div>

    </aside>
  );
}