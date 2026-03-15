import { useState } from 'react';
import './LoginPage.css';
import './SignUpPage.css';
import { Link } from 'react-router-dom';

function LoginPage() {

  const [email, setEmail] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [matchError, setMatchError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState('');

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8)
      errors.push('at least 8 characters');

    if (!/[a-z]/.test(password))
      errors.push('one lowercase letter');

    if (!/[A-Z]/.test(password))
      errors.push('one uppercase letter');

    if (!/[0-9]/.test(password))
      errors.push('one number');

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push('one special character');

    return errors;
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  setMatchError('');
  setTermsError('');

  if (!acceptedTerms) {
    setTermsError('You must accept the Terms and Conditions');
    return;
  }

  if (password !== confirmPassword) {
    setMatchError('Passwords do not match');
    return;
  }

  if (passwordErrors.length > 0) {
    return;
  }

    try {
      const response = await fetch ('/api/register', {
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
        console.log('Registration successful:', data);
      }
    } catch (error){
      console.error('Error:', error)
    }
  };

  return (

    <div className="page">
      <h1>Sign up to Neighborhood Noise</h1>
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
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);
              setPasswordErrors(validatePassword(value));
            }}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => {
              setconfirmPassword(e.target.value);
              setMatchError('');
            }}
            placeholder="Confirm your password"
            required
          />
        </div>

        {passwordErrors.length > 0 && (
          <ul className="password-errors">
            <strong>Password should include:</strong>
            {passwordErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}

        {matchError && (
          <div className="password-errors">
            {matchError}
          </div>
        )}

        <div className="form-group terms">
          <div className="terms-row">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <label htmlFor="terms-checkbox" className="terms-label">
              I agree to the <Link to="/terms">Terms and Conditions</Link>
            </label>
          </div>
        </div>

        {termsError && (
          <div className="password-errors">
            {termsError}
          </div>
        )}

        <button type="submit">Sign up</button>
      </form>

      <div className="signup-section">
        <p> Already have an account? </p>

        <Link to="/login">
          <button type="submit" disabled={!acceptedTerms}>
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;