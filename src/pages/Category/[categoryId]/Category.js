import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/authentification/authcontext";
import { addGame } from "../../../hooks/games/gamesApi";
import { deleteCategorie, getCategorie, updateCategorie } from "../../../hooks/categories/categoriesApi";
import { getGames } from "../../../hooks/games/gamesApi";
import "./Category.css";

export function Category() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [newGameData, setNewGameData] = useState({
    Title: "",
    Description: "",
    Developer: "",
  });
  const { auth } = useAuth(); // Access auth context
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await getCategorie(categoryId);
        setCategory(response);
        setEditData(response);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchGames = async () => {
      try {
        const response = await getGames(categoryId);
        setGames(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
    fetchGames();
  }, [categoryId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditSubmit = async () => {
    if (!auth?.accessToken) {
      alert("You must be logged in to edit categories.");
      return;
    }

    try {
      const updatedCategory = await updateCategorie(categoryId, editData, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      setCategory(updatedCategory);
      setIsEditing(false);
      alert("Category updated successfully.");
    } catch (error) {
      console.error("Failed to update category:", error);
      alert("Failed to update category. Please try again.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!auth?.accessToken) {
      alert("You must be logged in to delete categories.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await deleteCategorie(categoryId, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      alert("Category deleted successfully.");
      navigate("/"); // Redirect to categories list
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  const handleAddGameToggle = () => {
    setIsAddingGame(!isAddingGame);
  };

  const handleNewGameChange = (e) => {
    const { name, value } = e.target;
    setNewGameData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddGameSubmit = async () => {
    if (!auth?.accessToken) {
      alert("You must be logged in to add a game.");
      return;
    }

    // Ensure all fields are filled
    const { Title, Description, Developer } = newGameData;
    if (!Title || !Description || !Developer) {
      alert("All fields are required to add a game.");
      return;
    }

    try {
      const newGame = await addGame(categoryId, newGameData, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      setGames((prevGames) => [...prevGames, newGame]);
      setIsAddingGame(false);
      setNewGameData({
        Title: "",
        Description: "",
        Developer: "",
      });
      alert("Game added successfully.");
    } catch (error) {
      console.error("Failed to add game:", error);
      alert("Failed to add game. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading">Loading category and games details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!category) {
    return <div className="error">Category not found.</div>;
  }

  return (
    <div className="category-container">
      <div className="category-header">
        <h1 className="category-title">{category.Name}</h1>
      </div>

      {auth?.accessToken && (
        <div className="category-buttons">
          <button onClick={handleDeleteCategory} className="category-button">Delete Category</button>
          <button onClick={handleEditToggle} className="category-button">
            {isEditing ? "Cancel Edit" : "Edit Category"}
          </button>
          <button onClick={handleAddGameToggle} className="category-button">
            {isAddingGame ? "Cancel Add Game" : "Add New Game"}
          </button>
        </div>
      )}

      {isEditing ? (
        <div className="edit-category-form">
          <h2>Edit Category</h2>
          <input
            type="text"
            name="Name"
            value={editData.Name || ""}
            onChange={handleEditChange}
            placeholder="Category Name"
          />
          <textarea
            name="Description"
            value={editData.Description || ""}
            onChange={handleEditChange}
            placeholder="Category Description"
          />
          <textarea
            name="AdditionalDescription"
            value={editData.AdditionalDescription || ""}
            onChange={handleEditChange}
            placeholder="Additional Description"
          />
          <input
            type="number"
            name="Rating"
            value={editData.Rating || ""}
            onChange={handleEditChange}
            placeholder="Category Rating"
          />
          <button onClick={handleEditSubmit}>Save Changes</button>
        </div>
      ) : (
        <div className="category-details">
          <p><strong>Description:</strong> {category.Description}</p>
        </div>
      )}

      <div className="games-section">
        <h2>Games in this Category</h2>

        {isAddingGame && (
          <div className="add-game-form">
            <h3>Add New Game</h3>
            <input
              type="text"
              name="Title"
              value={newGameData.Title || ""}
              onChange={handleNewGameChange}
              placeholder="Game Title"
            />
            <textarea
              name="Description"
              value={newGameData.Description || ""}
              onChange={handleNewGameChange}
              placeholder="Game Description"
            />
            <input
              type="text"
              name="Developer"
              value={newGameData.Developer || ""}
              onChange={handleNewGameChange}
              placeholder="Game Developer"
            />
            <button onClick={handleAddGameSubmit}>Add Game</button>
          </div>
        )}

        {games.length > 0 ? (
          <div className="games-list">
            {games.map((game) => (
              <div className="game-card" key={game.Id}>
                <h3>{game.Title}</h3>
                <p>{game.Description}</p>
                <Link to={`/categories/${categoryId}/games/${game.Id}`} className="game-link">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No games available in this category.</p>
        )}
      </div>
    </div>
  );
}

export default Category;