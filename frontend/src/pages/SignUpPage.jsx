import { useState } from 'react';
import './LoginPage.css';
import { Link } from 'react-router-dom';

function LoginPage() {

  const [email, setEmail] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  };

  return (

    <div className="page">
      <h1>Sign up to X</h1>
      <form onSubmit={handleSubmit}>


        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="confirm-password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>


        <button type="submit">Sign up</button>
      </form>

      <div className="signup-section">
        <p> Already have an account? </p>

        <Link to="/login">
          <button type="button" className="signup-button">
            Log in
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;