import axios from 'axios';

const authUrl = 'https://squid-app-xuzxl.ondigitalocean.app/api';  // Replace with your actual authentication base URL

// Login user
const login = async (username, password) => {
  try {
    const response = await axios.post(`${authUrl}/login`, {
      userName: username,  // Correct key should be 'userName' for the backend
      password
    });

    return response.data;  // Return the response data which typically includes a token
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Register user
const register = async (userName, email, password) => {
  try {
    console.log('Register Request:', { userName, email, password });
    const response = await axios.post(`${authUrl}/register`, {
      userName,
      email,
      password
    });

    console.log('Register Response:', response.data);
    return response.data;
  } catch (error) {
    // Log error details for debugging
    console.error('Register Error - Response:', error.response);
    console.error('Error Data:', error.response?.data);
    console.error('Error Status:', error.response?.status);

    // Handle errors
    if (error.response?.data === "user name already taken") {
      throw new Error("The username is already taken. Please choose a different one.");
    } else if (error.response?.data === "User creation failed.") {
      // This is a generic message and should likely be a password validation issue
      throw new Error("Password must meet the following criteria:\n1. At least 8 characters long.\n2. Includes uppercase and lowercase letters.\n3. Contains numbers and special characters.");
    } else if (error.response?.status === 422) {
      // Handle 422 error, likely related to password validation
      throw new Error("Password must meet the following criteria:\n1. At least 8 characters long.\n2. Includes uppercase and lowercase letters.\n3. Contains numbers and special characters.");
    }

    // General fallback error handling
    throw new Error(error.message || 'Registration failed');
  }
};




// Refresh access token
const refreshAccessToken = async (refreshToken) => {
  try {
    // Log the data being sent to the server
    console.log('Refresh Token Request:', { refreshToken });

    const response = await axios.post(`${authUrl}/accessToken`, {
      refreshToken
    });

    // Log the response data
    console.log('Refresh Token Response:', response.data);

    return response.data; // Return the new access token
  } catch (error) {
    // Log error if the request fails
    console.error('Refresh Token Error:', error);
    throw new Error(error.response?.data?.message || 'Token refresh failed');
  }
};

// Logout user
const logout = async () => {
  try {
    // Log the logout request
    console.log('Logout Request: Logging out user');
    
    const response = await axios.post(`${authUrl}/logout`);

    // Log the response data
    console.log('Logout Response:', response.data);

    return response.data; // Return the logout confirmation or success message
  } catch (error) {
    // Log error if the request fails
    console.error('Logout Error:', error);
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};

export { login, register, refreshAccessToken, logout };