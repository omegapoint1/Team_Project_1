import { useState } from 'react';
import './LoginPage.css';
import { Link } from 'react-router-dom';

function LoginPage() {

  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });

      if (response.ok) {
        const data = await response.json();
        // data to be used later
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error. Please try again.');
    }
  };

  return (

    <div className="page">
      <h1>Log into Neighborhood Noise</h1>
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

        {error && (
          <div className="password-errors">
            {error}
          </div>
        )}

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