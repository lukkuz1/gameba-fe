import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../hooks/authentification/authentification';
import './Style.css';

function Register() {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  // Password Strength Validator
  const validatePasswordStrength = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (password.length < 8) {
      setPasswordStrength('Weak password (min 8 characters)');
    } else if (!strongPasswordRegex.test(password)) {
      setPasswordStrength('Weak password (include uppercase, number & symbol)');
    } else {
      setPasswordStrength('Strong password');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(userName, email, password);
      setError('');
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError('An error occurred, please try again.');
      alert(error);  // Display error message in an alert
    }
  };

  return (
    <div className="auth-page-container">
      <header className="auth-header">
        <h1>Gameba</h1>
        <p>Your favorite game marketplace</p>
      </header>
      <div className="auth-form-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            className="auth-input-field"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="password"
            className="auth-input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePasswordStrength(e.target.value);
            }}
            required
          />
          {password && (
            <p className={`auth-password-strength ${passwordStrength === 'Strong password' ? 'strong' : 'weak'}`}>
              {passwordStrength}
            </p>
          )}
          <button type="submit" className="auth-submit-button">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;