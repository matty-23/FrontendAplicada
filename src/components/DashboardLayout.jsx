import {Sidebar} from "./SideBar";
import {TopBar} from "./TopBar";

export default function DashboardLayout({ breadcrumb, title, rightActions, children }) {
  return (
    <div className="v2">
      <Sidebar />
      
      <div className="v2-main">
        <TopBar breadcrumb={breadcrumb} title={title}>
          {rightActions}
        </TopBar>
        
        <div className="v2-content">
          {children}
        </div>
      </div>
    </div>
  );
}