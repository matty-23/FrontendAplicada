import { useEffect, useRef } from "react";
import SidebarV2 from "../../../components/admin/v2/SidebarV2";

export default function EstadisticasPageV2() {
  const areaRef=useRef(null), pieRef=useRef(null), barRef=useRef(null);
  const charts=useRef([]);

  useEffect(()=>{
    let dead=false;
    (async()=>{
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);
      if(dead) return;
      charts.current.forEach(c=>c.destroy());
      charts.current=[];

      const blue="#003C71",yellow="#FEDD00",teal="#10b981",orange="#f59e0b";

      charts.current.push(new Chart(areaRef.current,{
        type:"line",
        data:{
          labels:["Ene","Feb","Mar","Abr","May","Jun","Jul"],
          datasets:[
            {label:"Solicitudes",data:[12,19,15,22,18,25,21],borderColor:blue,backgroundColor:"rgba(0,60,113,0.07)",borderWidth:2.5,fill:true,tension:0.45,pointRadius:5,pointBackgroundColor:blue,pointBorderColor:"white",pointBorderWidth:2},
            {label:"Eventos",    data:[4,7,5,9,6,11,8],borderColor:yellow,backgroundColor:"rgba(254,221,0,0.08)",borderWidth:2.5,fill:true,tension:0.45,pointRadius:5,pointBackgroundColor:yellow,pointBorderColor:"white",pointBorderWidth:2},
          ],
        },
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"top",align:"end",labels:{boxWidth:10,font:{size:12,family:"Inter"},padding:20}}},scales:{y:{beginAtZero:true,grid:{color:"#f1f5f9"},border:{display:false},ticks:{font:{size:11,family:"Inter"}}},x:{grid:{display:false},border:{display:false},ticks:{font:{size:11,family:"Inter"}}}}},
      }));

      const pieD={labels:["Eventos (42%)","Reservas (30%)","Permisos (20%)","Otros (8%)"],datasets:[{data:[42,30,20,8],backgroundColor:[blue,yellow,teal,orange],borderWidth:0,borderRadius:4}]};
      const pOpts={responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"right",labels:{boxWidth:10,font:{size:11,family:"Inter"},padding:12}}}};
      charts.current.push(new Chart(pieRef.current,{type:"doughnut",data:pieD,options:pOpts}));

      charts.current.push(new Chart(barRef.current,{
        type:"bar",
        data:{labels:["LM","JP","SR"],datasets:[
          {label:"Aprobadas",data:[32,20,28],backgroundColor:blue,borderRadius:6,borderRadiusTopLeft:6,borderRadiusTopRight:6},
          {label:"Pendientes",data:[16,12,8],backgroundColor:"rgba(0,60,113,0.15)",borderRadius:6},
        ]},
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"top",align:"end",labels:{boxWidth:10,font:{size:11,family:"Inter"}}}},scales:{y:{beginAtZero:true,grid:{color:"#f1f5f9"},border:{display:false},ticks:{font:{size:11}}},x:{grid:{display:false},border:{display:false},ticks:{font:{size:11}}}}},
      }));
    })();
    return ()=>{ dead=true; charts.current.forEach(c=>c.destroy()); };
  },[]);

  return (
    <div className="v2">
      <SidebarV2 />
      <div className="v2-main">
        <header className="v2-topbar">
          <div className="v2-topbar-left">
            <span className="v2-topbar-bc">Gestión / Estadísticas</span>
            <span className="v2-topbar-title">Estadísticas</span>
          </div>
          <div className="v2-topbar-right">
            <select className="v2-select"><option>Últimos 6 meses</option></select>
            <button className="v2-btn-secondary"><i className="fa-solid fa-file-export"></i> Exportar</button>
          </div>
        </header>
        <div className="v2-content">
          {/* KPI strip */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:22}}>
            {[
              {label:"Total solicitudes",  val:"112", sub:"+8% vs mes anterior", cls:"k-blue",   icon:"fa-file-lines"},
              {label:"Eventos realizados",  val:"28",  sub:"+3 nuevos en junio",  cls:"k-yellow", icon:"fa-ticket"},
              {label:"Horas aprobadas",     val:"80",  sub:"de 144 totales",      cls:"k-green",  icon:"fa-clock"},
              {label:"Equipos activos",     val:"5",   sub:"1 en reparación",     cls:"k-orange", icon:"fa-boxes-stacked"},
            ].map(k=>(
              <div className={`v2-kpi ${k.cls}`} key={k.label}>
                <div style={{marginBottom:12}}><div className="v2-kpi-icon"><i className={`fa-solid ${k.icon}`}></i></div></div>
                <div className="v2-kpi-val">{k.val}</div>
                <div className="v2-kpi-label">{k.label}</div>
                <div style={{fontSize:11,color:"var(--green-500)",fontWeight:600,marginTop:5}}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Gráficos */}
          <div className="v2-charts-grid mb-22">
            <div className="v2-card">
              <div className="v2-card-head">
                <div>
                  <div className="v2-card-title">Actividad mensual</div>
                  <div className="v2-card-sub">Solicitudes y eventos — últimos 7 meses</div>
                </div>
                <div className="flex gap-8">
                  {["Solicitudes","Eventos"].map(t=>(
                    <button className="v2-tab active" key={t} style={{padding:"5px 12px",fontSize:11}}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="v2-card-body" style={{height:280}}>
                <div className="v2-chart-area"><canvas ref={areaRef}></canvas></div>
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:18}}>
              <div className="v2-card">
                <div className="v2-card-head"><div className="v2-card-title">Distribución de solicitudes</div></div>
                <div className="v2-card-body" style={{height:180}}>
                  <div className="v2-chart-area"><canvas ref={pieRef}></canvas></div>
                </div>
              </div>
              <div className="v2-card">
                <div className="v2-card-head"><div className="v2-card-title">Horas por becario</div></div>
                <div className="v2-card-body" style={{height:160}}>
                  <div className="v2-chart-area"><canvas ref={barRef}></canvas></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
