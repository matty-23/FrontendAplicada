import Sidebar from "../../../components/admin/Sidebar";

const inventario = [
  { nombre: "Proyector Epson",        codigo: "P-104",  estado: "Disponible",   tipo: "success" },
  { nombre: "Laptop Dell XPS",        codigo: "L-221",  estado: "En Reparación",tipo: "warning" },
  { nombre: "Cámara Canon DSLR",      codigo: "C-099",  estado: "Disponible",   tipo: "success" },
  { nombre: "Micrófono Condensador",  codigo: "M-012",  estado: "Disponible",   tipo: "success" },
  { nombre: "Monitor LG Ultrawide",   codigo: "MO-301", estado: "Disponible",   tipo: "success" },
];

export default function InventarioPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="top-header">
          <div className="header-info">
            <span className="breadcrumb">Sistema / Gestión / Inventario</span>
            <h1>Control de Inventario</h1>
            <p>Gestión y registro de todos los activos de hardware.</p>
          </div>
          <div className="header-actions">
            <button className="btn-outline-header"><i className="fa-solid fa-file-export"></i> Exportar CSV</button>
            <button className="btn-primary-action"><i className="fa-solid fa-plus"></i> Nuevo Equipo</button>
          </div>
        </header>

        <div className="page-container flex-fill">
          <div className="controls-row">
            <div className="search-bar search-bar-large border-dark">
              <input type="text" placeholder="Buscar activo..." />
              <i className="fa-solid fa-magnifying-glass text-muted"></i>
            </div>
            <div className="filter-group">
              <select className="custom-select border-dark"><option>Categoría</option></select>
              <select className="custom-select border-dark"><option>+ Filtros</option></select>
              <button className="btn-primary-outline border-dark">Buscar</button>
            </div>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Nombre Equipo</th><th>Código</th><th>Estado</th><th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {inventario.map((item) => (
                  <tr key={item.codigo}>
                    <td>{item.nombre}</td>
                    <td>{item.codigo}</td>
                    <td>
                      <span className={`badge-status badge-${item.tipo}`}>
                        {item.estado} <i className="fa-solid fa-xmark"></i>
                      </span>
                    </td>
                    <td className="text-right"><i className="fa-solid fa-expand action-icon"></i></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-wrapper">
            <ul className="pagination">
              {[1,2,null,4,5,6].map((p, i) =>
                p === null
                  ? <li className="page-item empty" key={`e${i}`}>…</li>
                  : <li className={`page-item${p === 1 ? " active" : ""}`} key={p}>{p}</li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

