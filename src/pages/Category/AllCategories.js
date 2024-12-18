import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addCategorie, getCategories } from "../../hooks/categories/categoriesApi";
import { useAuth } from "../../hooks/authentification/authcontext";
import Modal from "../../components/Modal";
import CategoryCard from "../../components/CategoryCard";
import AddCategoryModal from "../../components/AddCategoryModal";
import "./AllCategories.css";

export function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Toggle for Add Category Modal
  const [newCategory, setNewCategory] = useState({ Name: "", Description: "", AdditionalDescription: "" });
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
    navigate("/login");
  };

  const handleAddCategory = async () => {
    if (!auth?.accessToken) {
      alert("You must be logged in to add categories.");
      return;
    }

    if (!newCategory.Name.trim() || !newCategory.Description.trim()) {
      alert("Category Name and Description are required.");
      return;
    }

    try {
      const response = await addCategorie(newCategory, auth.accessToken);
      setCategories((prevCategories) => [...prevCategories, response]);
      setIsAddModalOpen(false);
      setNewCategory({ Name: "", Description: "", AdditionalDescription: "" });
    } catch (error) {
      alert("Failed to add category. Ensure you have admin privileges.");
    }
  };

  if (loading) return <div className="loading">Loading categories...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="logo">Gameba</h1>
        <nav className="auth-buttons">
          {auth?.accessToken ? (
            <button onClick={handleLogout} className="gameba-auth-button">
              Logout
            </button>
          ) : (
            <>
              <button className="gameba-auth-button" onClick={() => navigate("/login")}>Login</button>
              <button className="gameba-auth-button" onClick={() => navigate("/register")}>Register</button>
            </>
          )}
        </nav>
      </header>

      <main className="categories-section">
        <h2>Game Categories</h2>
        <button onClick={() => setIsModalOpen(true)} className="info-button">
          What is Gameba?
        </button>

        {auth?.accessToken && (
          <button onClick={() => setIsAddModalOpen(true)} className="add-button">
            Add Category
          </button>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Welcome to Gameba</h2>
          <p>Explore the best game categories and find your next adventure!</p>
        </Modal>

        <AddCategoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          handleAddCategory={handleAddCategory}
        />

        {categories.length > 0 ? (
          <div className="category-list">
            {categories.map((category) => (
              <CategoryCard key={category.Id} category={category} />
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
