import './Style.css';
import React from 'react';

function Register() {
  return (
    <div className="auth-page">
      <header className="auth-header">
        <h1>Gameba</h1>
        <p>Your favorite game marketplace</p>
      </header>

      <div className="auth-container">
        <div className="auth-content">
          <h2 className="auth-heading">Join Gameba</h2>
          <form className="auth-form">
            <input type="email" placeholder="Email" className="auth-input" required />
            <input type="password" placeholder="Password" className="auth-input" required />
            <input type="password" placeholder="Confirm Password" className="auth-input" required />
            <button type="submit" className="auth-button">Register</button>
          </form>
        </div>
      </div>

      <footer className="auth-footer">
        <p>&copy; 2024 Gameba - All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default Register;
