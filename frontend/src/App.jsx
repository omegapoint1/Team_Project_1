import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; 
import PlannerPage from './pages/PlannerPage';  

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
