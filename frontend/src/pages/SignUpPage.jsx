import { useState } from 'react';
import './LoginPage.css';
import './SignUpPage.css';
import { Link, useNavigate } from 'react-router-dom';

// SignUpPage component provides a user interface for new users to create an account,
// including form validation for password strength and matching, as well as handling form submission to the backend API for registration.
function SignUpPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [matchError, setMatchError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [error, setError] = useState('');

  // Function to validate password strength based on defined criteria and return an array of error messages for any unmet requirements.
  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) errors.push('at least 8 characters');
    if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
    if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
    if (!/[0-9]/.test(password)) errors.push('one number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('one special character');

    return errors;
  };

  // Function to handle form submission for user registration, including validation checks for password matching and terms acceptance,
  // and communicating with the backend API to create a new user account.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMatchError('');
    setTermsError('');
    setError('');

    if (!acceptedTerms) {
      setTermsError('You must accept the Terms and Conditions');
      return;
    }

    if (password !== confirmPassword) {
      setMatchError('Passwords do not match');
      return;
    }

    const validationErrors = validatePassword(password);
    setPasswordErrors(validationErrors);

    if (validationErrors.length > 0) {
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        console.log('Registration successful:', data);
        navigate('/login', { replace: true });
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error. Please try again.');
    }
  };

  //Rendering the sign-up form with input fields for email and password, and displaying any error messages that occur during the registration process.
  // The form submission is handled by the handleSubmit function, which communicates with the backend API to create a new user account.
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
              setConfirmPassword(e.target.value);
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

        {matchError && <div className="password-errors">{matchError}</div>}
        {termsError && <div className="password-errors">{termsError}</div>}
        {error && <div className="password-errors">{error}</div>}

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

        <button type="submit">Sign up</button>
      </form>

      <div className="signup-section">
        <p>Already have an account?</p>
        <Link to="/login">
          <button type="button" className="login-button">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}

export default SignUpPage;