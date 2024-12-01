import './Style.css';
import React from 'react';

function Register() {
  return (
    <div className="auth-page">
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
    </div>
  );
}

export default Register;
