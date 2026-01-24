import { useState } from 'react';
import './LoginPage.css';
import { Link } from 'react-router-dom';

function LoginPage() {

  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (

    <div className="page">
      <h1>Log into X</h1>
      <form onSubmit={handleSubmit}>


        <div className="form-group">
          <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder = "Enter your email"
              required
            />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type = "submit">Login</button>
      </form>

      <div className="signup-section">
        <p> Don't have an account? </p>
        
        <Link to="/signup">
          <button type ="button" className="signup-button">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;