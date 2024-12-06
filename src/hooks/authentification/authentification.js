// authentication.js

import axios from 'axios';

const authUrl = 'https://squid-app-xuzxl.ondigitalocean.app/api/v1';  // Replace with your actual authentication base URL

// Login user
const login = async (userName, password) => {
  try {
    const response = await axios.post(`${authUrl}/login`, {
      userName,
      password
    });
    return response.data; // Return the response data, typically includes a token
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Register user
const register = async (userName, email, password) => {
  try {
    const response = await axios.post(`${authUrl}/register`, {
      userName,
      Email: email,
      password
    });
    return response.data; // Return the response data, typically includes a success message or token
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Refresh access token
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${authUrl}/accessToken`, {
      refreshToken
    });
    return response.data; // Return the new access token
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Token refresh failed');
  }
};

// Logout user
const logout = async () => {
  try {
    const response = await axios.post(`${authUrl}/logout`);
    return response.data; // Return the logout confirmation or success message
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};

export { login, register, refreshAccessToken, logout };
