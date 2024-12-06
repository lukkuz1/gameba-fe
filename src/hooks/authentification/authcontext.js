import React, { createContext, useContext, useState, useEffect } from 'react';
import { refreshAccessToken } from './authentification';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, accessToken: null });

  const logout = () => {
    setAuth({ user: null, accessToken: null });
    localStorage.removeItem('refreshToken');
  };

  const refreshAuth = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;
    try {
      const { AccessToken } = await refreshAccessToken(refreshToken);
      setAuth((prev) => ({ ...prev, accessToken: AccessToken }));
    } catch {
      logout();
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
