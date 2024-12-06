import React, { useState } from 'react';
import { useAuth } from '../../hooks/authentification/authcontext';
import { login } from '../../hooks/authentification/authentification';
import { useNavigate } from 'react-router-dom';
import './Style.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { AccessToken, RefreshToken } = await login(username, password);
      if (AccessToken && RefreshToken) {
        setAuth({ user: username, accessToken: AccessToken });
        localStorage.setItem('refreshToken', RefreshToken);
        navigate('/');
      } else {
        setError('Login failed, try again!');
      }
    } catch (err) {
      setError('Invalid username or password');
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <button type="submit" className="auth-button">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Login;