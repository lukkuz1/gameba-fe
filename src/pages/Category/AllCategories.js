import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import './AllCategories.css';

export function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <h1 className="logo">Gameba</h1>
        </div>
        <div className="auth-buttons">
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
              <Link to={`/categories/${category.Id}`} key={category.Id} className="category-link">
                <div className="category-card">
                  <h3>{category.Name}</h3>
                  <p>{category.Description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>No categories available.</p>
        )}
      </main>
    </div>
  );
}
