import './App.css';
import { BrowserRouter, Routes, Route, Link, NavLink} from 'react-router-dom';
import LoginPage from './pages/LoginPage'; 
import PlannerPage from './pages/PlannerPage';  
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
  import Overview from './pages/Dashboard_Overview';
  import MitigationPlans from './pages/Dashboard_MitigationPlans';
  import ScenarioComparison from './pages/Dashboard_ScenarioComparison';
  import ScenarioTab from './components/planner/Scenarios';
  import IncidentManagement from './pages/Dashboard_IncidentManagement';
  import GenerateReport from './pages/Dashboard_GenerateReport';
  import HotspotAnalytics from './pages/Dashboard_HotspotAnalytics';
  import FormPage from './pages/FormPage';
  import UserDashboard from './pages/UserDashboard';
import ScenarioTab from './components/planner/Scenarios';
import MitigationTab from './components/planner/MitigationTab';
import Incidents from './components/planner/Incidents';
import Reports from './components/planner/Reports';
import GamePage from './pages/GamePage';
function App() {
  return (
<BrowserRouter>
      <nav className="navbar">
        
        <div className="navbar-left">
          <Link to="/dashboard">
            <img src="/logo.png" alt="Website Logo" className="websiteLogo" />
          </Link>
          <span className="nav-title">Neighborhood Noise</span>
        </div>
      
        <div className = "navbar-right">
          <Link to="/user-dashboard" className="nav-link">My Dashboard</Link>
          <Link to="/dashboard" className="nav-link">Dashboard+</Link>
          <Link to="/game" className="nav-link">Quests</Link>
          <Link to="/dashboard/report" className="nav-link">Report incident</Link>

          <Link to="/"        className = "nav-link-icon">
            <span className="nav-user-icon">👤</span>
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/"         element={<LoginPage/>} />
        <Route path="/planner"  element={<PlannerPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/game" element={<GamePage/>} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/user-dashboard" element={<UserDashboard />} />

        
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="reportProcessing" element={<Incidents />} />
          <Route path="mitigation" element={<MitigationTab />} />
          <Route path="comparison" element={<ScenarioTab />} />
          <Route path="ExportingReport" element={<Reports />} />
          {/*<Route path="tracker" element={<ImplementationTracker />} />*/}
          <Route path="report" element={<FormPage />} />
          <Route path="hotspots" element={<HotspotAnalytics />} />
        </Route>


        {/*<Route path="*" element={<NotFoundPage />} />*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
