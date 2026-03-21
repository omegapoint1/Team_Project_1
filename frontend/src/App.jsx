import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, NavLink} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PlannerPage from './pages/PlannerPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
  import Overview from './pages/Dashboard_Overview';
  import MitigationPlans from './pages/Dashboard_MitigationPlans';
  import ScenarioComparison from './pages/Dashboard_ScenarioComparison';
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
import Terms from './pages/TermsPage';
import ProfilePage from './pages/ProfilePage';
import HelpPage from './pages/HelpPage.jsx';

function App() {
  const [user, setUser] = useState(null);
  const isPlanner = user?.role === 'planner';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleUserLogin = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('userLogin', handleUserLogin);
    return () => window.removeEventListener('userLogin', handleUserLogin);
  }, []);
  
  return (
  <BrowserRouter>
      <nav className="navbar">
        
        <div className="navbar-left">
          <Link to="/dashboard">
            <img src="/static/logo.png" alt="Website Logo" className="websiteLogo" />
          </Link>
          <span className="nav-title">Neighborhood Noise</span>
        </div>
      
        <div className = "navbar-right">
          <Link to="/user-dashboard" className="nav-link">My Dashboard</Link>
          {isPlanner && (
            <Link to="/dashboard" className="nav-link">Dashboard+</Link>
          )}
          <Link to="/game" className="nav-link">Quests</Link>
          <Link to="/report" className="nav-link">Report incident</Link>
          <Link to="/help" className="nav-link">Help</Link>

          <Link
            to={user ? "/profile" : "/login"}
            className="nav-link-icon"
          >
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
        <Route path="/report" element={<FormPage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/help" element={<HelpPage />} />

        
        <Route path="/dashboard" element={ isPlanner ? <Dashboard /> : <Navigate to="/user-dashboard" replace />}>
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="reportProcessing" element={<Incidents />} />
          <Route path="mitigation" element={<MitigationTab />} />
          <Route path="comparison" element={<ScenarioTab />} />
          <Route path="ExportingReport" element={<Navigate to="/report" replace />} />
          <Route path="tracker" element={<IncidentManagement />} />
          <Route path="hotspots" element={<HotspotAnalytics />} />

        </Route>

        {/*<Route path="*" element={<NotFoundPage />} />*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
