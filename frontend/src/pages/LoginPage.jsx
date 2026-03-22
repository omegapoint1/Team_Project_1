import { useState } from 'react';
import './LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';

// LoginPage component provides a user interface for logging into the application, handling form submission, and managing authentication state.
function LoginPage() {

  // State variables to manage form inputs and error messages
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous error messages before attempting to log in
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
        localStorage.setItem('user', JSON.stringify(data.user));

        window.dispatchEvent(new Event('userLogin'));

        if (data.user.role === 'planner') {
          navigate('/dashboard/overview');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error. Please try again.');
    }
  };

  //Rendering the login form with input fields for email and password, and displaying any error messages that occur during the login process.
  // The form submission is handled by the handleSubmit function, which communicates with the backend API to authenticate the user and manage navigation based on their role.
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