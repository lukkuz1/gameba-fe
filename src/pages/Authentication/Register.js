import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../hooks/authentification/authentification';
import './Style.css';

function Register() {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(userName, email, password);
      setSuccess(true);
      setError('');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('An error occurred, please try again.');
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <h1>Gameba</h1>
        <p>Your favorite game marketplace</p>
      </header>
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            className="auth-input"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="email"
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">Register</button>
        </form>
        {success && <p className="success">Registration successful! Please log in.</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Register;