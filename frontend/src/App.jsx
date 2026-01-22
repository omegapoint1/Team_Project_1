import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; 
import PlannerPage from './pages/PlannerPage';  

function App() {
  return (
    <BrowserRouter>
      <nav className = "navbar">
        <Link to="/"        className = "nav-link">Login</Link>
        <Link to="/planner" className="nav-link">Planner Screen</Link>
      </nav>
      <Routes>
        <Route path="/"         element={<LoginPage/>} />
        <Route path="/planner"  element={<PlannerPage/>} />
        {/*<Route path="*" element={<NotFoundPage />} />*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
