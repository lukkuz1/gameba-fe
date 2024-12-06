import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/authentification/authcontext';

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return <button onClick={handleLogout} className="auth-button">Logout</button>;
}

export default LogoutButton;
