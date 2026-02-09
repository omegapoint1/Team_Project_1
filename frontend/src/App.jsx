import './App.css';
import { BrowserRouter, Routes, Route, Link, NavLink} from 'react-router-dom';
import LoginPage from './pages/LoginPage'; 
import PlannerPage from './pages/PlannerPage';  
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
<<<<<<< backend
import Overview from './pages/Dashboard_Overview';
import MitigationPlans from './pages/Dashboard_MitigationPlans';
import ScenarioComparison from './pages/Dashboard_ScenarioComparison';
import ImplementationTracker from './pages/Dashboard_ImplementationTracker';
import GenerateReport from './pages/Dashboard_GenerateReport';
import HotspotAnalytics from './pages/Dashboard_HotspotAnalytics';
=======
  import Overview from './pages/Dashboard_Overview';
  import MitigationPlans from './pages/Dashboard_MitigationPlans';
  import ScenarioComparison from './pages/Dashboard_ScenarioComparison';
  import ImplementationTracker from './pages/Dashboard_ImplementationTracker';
  import GenerateReport from './pages/Dashboard_GenerateReport';
  import HotspotAnalytics from './pages/Dashboard_HotspotAnalytics';
>>>>>>> main
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
          <Link to="/planner" className="nav-link">Planner Screen</Link>

          <Link to="/"        className = "nav-link-icon">
            <span className="nav-user-icon">👤</span>
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/"         element={<LoginPage/>} />
        <Route path="/planner"  element={<PlannerPage/>} />
        <Route path="/login" element={<LoginPage />} />
<<<<<<< backend
=======
        <Route path="/game" element={<GamePage/>} />
        
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="mitigation" element={<MitigationPlans />} />
          <Route path="comparison" element={<ScenarioComparison />} />
          <Route path="tracker" element={<ImplementationTracker />} />
          <Route path="report" element={<GenerateReport />} />
          <Route path="hotspots" element={<HotspotAnalytics />} />
        </Route>


        {/*<Route path="*" element={<NotFoundPage />} />*/}
>>>>>>> main
      </Routes>
    </BrowserRouter>
  );
}

export default App;
