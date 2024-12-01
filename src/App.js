import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';

function App() {
  const [categories, setCategories] = useState([]); // State to store the fetched categories
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to store errors if any

  // Fetch categories from the API
  useEffect(() => {
    axios
      .get('https://squid-app-xuzxl.ondigitalocean.app/api/v1/categories')
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Display loading or error messages
  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Define the route for the home page */}
          <Route
            path="/"
            element={
              <div>
                <header className="App-header">
                  <div className="logo-container">
                    <h1 className="logo">Gameba</h1>
                  </div>
                  <div className="auth-buttons">
                    {/* Navigation Links for Login and Register */}
                    <Link to="/login">
                      <button className="auth-button">Login</button>
                    </Link>
                    <Link to="/register">
                      <button className="auth-button">Register</button>
                    </Link>
                  </div>
                </header>

                <main className="categories-section">
                  <h2>Game Categories</h2>
                  {categories.length > 0 ? (
                    <div className="category-list">
                      {categories.map((category) => (
                        <div className="category-card" key={category.Id}>
                          <h3>{category.Name}</h3>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No categories found.</p>
                  )}
                </main>
              </div>
            }
          />

          {/* Define routes for Login and Register pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
