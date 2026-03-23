import { NavLink, Outlet } from 'react-router-dom';
import './Dashboard.css'

// This is the planner navbar that gets rendered,
// all planner pages are rendered within the Outlet component, which allows for nested routing and dynamic content based on the selected tab.
const tabs = [
  { name: "Overview", to: "overview" },
  { name: "Mitigation Plans", to: "mitigation" },
  { name: "Scenario Comparison", to: "comparison" },
  { name: "Incident Management", to: "tracker" },
  { name: "Generate Report", to: "/report" },
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