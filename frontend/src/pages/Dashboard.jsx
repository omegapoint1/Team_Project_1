import { NavLink, Outlet } from 'react-router-dom';
import './Dashboard.css'

const tabs = [
  { name: "Overview", to: "overview" },
  { name: "Mitigation Plans", to: "mitigation" },
  { name: "Scenario Comparison", to: "comparison" },
  { name: "Implementation Tracker", to: "tracker" },
  { name: "Generate Report", to: "report" },
  { name: "Hotspot Analytics", to: "hotspots" },
];

function DashboardPage() {
  return (
    <div className="dashboardLayout">

      <div className="DashBar">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              "dashboardTab" + (isActive ? " active" : "")
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </div>

      <div className="DashContent">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardPage;