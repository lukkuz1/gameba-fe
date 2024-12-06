import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import './AllCategories.css';

function Modal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Welcome to Gameba</h2>
        <p>Explore the best game categories and find your next adventure!</p>
        <button onClick={onClose} className="modal-close-button">Close</button>
      </div>
    </div>
  );
}

export function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="menu-bar"></span>
          <span className="menu-bar"></span>
          <span className="menu-bar"></span>
        </div>
        <nav className={`auth-buttons ${isMenuOpen ? 'menu-open' : ''}`}>
          <Link to="/login">
            <button className="auth-button">Login</button>
          </Link>
          <Link to="/register">
            <button className="auth-button">Register</button>
          </Link>
        </nav>
      </header>

      <main className="categories-section">
        <h2>Game Categories</h2>
        <button className="info-button" onClick={() => setIsModalOpen(true)}>
          Show Info
        </button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
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

      <footer className="App-footer">
        <p>© 2024 Gameba. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
