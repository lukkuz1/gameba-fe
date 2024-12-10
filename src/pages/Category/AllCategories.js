// src/pages/CategoriesPage.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories, addCategorie } from '../../hooks/categories/categoriesApi';
import { useAuth } from '../../hooks/authentification/authcontext';
import Modal from '../../components/Modal';
import './AllCategories.css';

export function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ Name: '', Description: '' });
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddCategory = async () => {
    if (!auth?.accessToken) {
      alert('You must be logged in to add categories.');
      return;
    }

    try {
      const response = await addCategorie(newCategory, auth.accessToken);
      setCategories([...categories, response]); // Add the new category to the list
      setIsAddModalOpen(false); // Close the modal
      setNewCategory({ Name: '', Description: '' }); // Reset the form
    } catch (error) {
      console.error('Failed to add category:', error);
      alert('Failed to add category. Make sure you are an admin.');
    }
  };

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
          {auth?.accessToken ? (
            <button onClick={handleLogout} className="auth-button">Logout</button>
          ) : (
            <>
              <Link to="/login">
                <button className="auth-button">Login</button>
              </Link>
              <Link to="/register">
                <button className="auth-button">Register</button>
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="categories-section">
        <h2>Game Categories</h2>
        <button className="info-button" onClick={() => setIsModalOpen(true)}>Show Info</button>
        {auth?.accessToken && (
          <button className="add-button" onClick={() => setIsAddModalOpen(true)}>
            Add Category
          </button>
        )}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Welcome to Gameba</h2>
          <p>Explore the best game categories and find your next adventure!</p>
        </Modal>
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <h2>Add New Category</h2>
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory.Name}
            onChange={(e) => setNewCategory({ ...newCategory, Name: e.target.value })}
          />
          <textarea
            placeholder="Category Description"
            value={newCategory.Description}
            onChange={(e) => setNewCategory({ ...newCategory, Description: e.target.value })}
          />
          <button onClick={handleAddCategory} className="submit-button">Add</button>
        </Modal>
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
