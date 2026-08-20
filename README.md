# ⚠️ RAMA EXPERIMENTAL: `interfacesExp`

> **IMPORTANTE / ADVERTENCIA:**  
> **NO MERGEAR ESTA RAMA CON LA RAMA PRINCIPAL (`main`, `master` o `develop`).**  
> Esta rama (`interfacesExp`) fue creada exclusivamente con fines de **experimentación de diseño, maquetación de interfaces y demostración de UI/UX para reuniones con el cliente y el equipo**. Contiene componentes de prueba, mocks estáticos y rutas de demostración sin autenticación obligatoria.

---

## 📋 Contenido de esta rama

En esta rama se unificó la lógica base y se implementaron dos versiones completas de las interfaces de administración:

1. **Versión 1 (V1 - Base)**: Maquetación base adaptada a componentes funcionales de React (`src/pages/admin/v1/`).
2. **Versión 2 (V2 - Propuesta Mejorada)**: Rediseño visual moderno y optimizado (`src/pages/admin/v2/`), que incorpora:
   - Paleta armónica basada en el azul institucional (`#003C71`) y amarillo (`#FEDD00`).
   - KPIs con indicadores de tendencia (+/-).
   - Gráficos interactivos con Chart.js (actividad semanal, distribución y rendimiento de becarios).
   - Barras de progreso de horas cumplidas por becario.
   - Inventario estructurado por tarjetas con iconografía representativa.
   - Timeline cronológico para solicitudes pendientes y aprobadas.
   - Logo UAP con orientación corregida y fondo transparente.

---

## 🚀 Cómo ejecutar el proyecto localmente

1. Posicionarse en la carpeta del Frontend:
   ```bash
   cd Frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador: [http://localhost:5173](http://localhost:5173)

---

## 🗺️ Mapa de Rutas para Demostración

Ambas versiones están disponibles simultáneamente para comparar:

| Sección | Versión 2 (Moderna / Recomendada) | Versión 1 (Base Original) |
| :--- | :--- | :--- |
| **Panel General** | `/admin` o `/v2/admin` | `/v1/admin` |
| **Eventos** | `/v2/admin/eventos` | `/v1/admin/eventos` |
| **Solicitudes** | `/v2/admin/solicitudes` | `/v1/admin/solicitudes` |
| **Calendario** | `/v2/admin/calendario` | `/v1/admin/calendario` |
| **Becarios** | `/v2/admin/becarios` | `/v1/admin/becarios` |
| **Inventario** | `/v2/admin/inventario` | `/v1/admin/inventario` |
| **Estadísticas** | `/v2/admin/estadisticas` | `/v1/admin/estadisticas` |

---

## 📁 Estructura del proyecto

```
FrontendAplicada/
├── README.md                     # Advertencias y documentación de la rama
└── Frontend/
    ├── .gitignore                # Configuración de exclusiones (ignora node_modules, interfacesBase, etc.)
    ├── public/
    │   ├── Logo.png              # Logo UAP azul con fondo transparente
    │   └── Logo_white.png        # Logo UAP blanco para sidebars oscuros
    └── src/
        ├── components/admin/
        │   ├── Sidebar.jsx       # Sidebar de la V1
        │   └── v2/SidebarV2.jsx  # Sidebar de la V2 (con badges y avatar)
        ├── pages/admin/
        │   ├── v1/               # 7 Vistas base
        │   └── v2/               # 7 Vistas mejoradas
        ├── dashboard.css         # Estilos base V1
        ├── dashboard-v2.css      # Estilos modernos V2
        └── App.jsx               # Enrutador con V1 y V2
```
