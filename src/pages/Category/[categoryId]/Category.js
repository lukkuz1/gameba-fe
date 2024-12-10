import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Category.css';
import { useAuth } from '../../../hooks/authentification/authcontext';
import { addGame } from '../../../hooks/games/gamesApi';
import { deleteCategorie } from '../../../hooks/categories/categoriesApi';

export function Category() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [newGameData, setNewGameData] = useState({ title: '', description: '' });
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch category details
    axios
      .get(`https://squid-app-xuzxl.ondigitalocean.app/api/v1/categories/${categoryId}`)
      .then((response) => {
        setCategory(response.data);
        setEditData(response.data); // Pre-fill form with current category data
      })
      .catch((err) => setError(err.message));

    // Fetch games in the category
    axios
      .get(`https://squid-app-xuzxl.ondigitalocean.app/api/v1/categories/${categoryId}/games`)
      .then((response) => setGames(response.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId]);

  const handleDeleteCategory = async () => {
    if (!auth?.accessToken) {
      alert('You must be logged in to delete categories.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await deleteCategorie(categoryId, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      alert('Category deleted successfully.');
      navigate('/categories'); // Redirect to categories list
    } catch (error) {
      console.error('Failed to delete category:', error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        alert('Unauthorized: You do not have permission to delete this category.');
      } else {
        alert('Failed to delete category. Please try again.');
      }
    }
  };

  const handleAddGameToggle = () => {
    setIsAddingGame(!isAddingGame);
  };

  const handleNewGameChange = (e) => {
    const { name, value } = e.target;
    setNewGameData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddGame = async () => {
    if (!auth?.accessToken) {
      alert('You must be logged in to add games.');
      return;
    }

    const gameData = {
      ...newGameData,
      categoryId: parseInt(categoryId, 10),
    };

    try {
      const addedGame = await addGame(categoryId, gameData, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      setGames((prevGames) => [...prevGames, addedGame]);
      setNewGameData({ title: '', description: '' });
      setIsAddingGame(false);
      alert('Game added successfully.');
    } catch (error) {
      console.error('Failed to add game:', error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        alert('Unauthorized: You do not have permission to add games.');
      } else {
        alert('Failed to add game. Please try again.');
      }
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
    <div className="category-page">
      <div className="category-header">
        <h1 className="category-title">{category.Name}</h1>
          <button onClick={handleDeleteCategory} className="delete-button">
            Delete Category
          </button>
      </div>

      <div className="category-details">
        <p><strong>Description:</strong> {category.Description}</p>
        <p><strong>Additional Description:</strong> {category.AdditionalDescription || 'N/A'}</p>
        <p><strong>Rating:</strong> {category.Rating}</p>
      </div>

      <div className="games-section">
        <h2>Games in this Category</h2>
        {games.length > 0 ? (
          <div className="games-list">
            {games.map((game) => (
              <div className="game-card" key={game.Id}>
                <h3>{game.Title}</h3>
                <p>{game.Description}</p>
                <p><strong>Rating:</strong> {game.Rating}</p>
                <p><strong>Release Date:</strong> {new Date(game.ReleaseDate).toLocaleDateString()}</p>
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

      <div className="add-game-section">
        <h2>Add a New Game</h2>
        {isAddingGame ? (
          <>
            <input
              type="text"
              name="title"
              value={newGameData.title}
              onChange={handleNewGameChange}
              placeholder="Game Title"
            />
            <textarea
              name="description"
              value={newGameData.description}
              onChange={handleNewGameChange}
              placeholder="Game Description"
            />
            <div className="add-game-actions">
              <button onClick={handleAddGame} className="save-button">
                Add Game
              </button>
              <button onClick={handleAddGameToggle} className="cancel-button">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <button onClick={handleAddGameToggle} className="add-button">
            Add Game
          </button>
        )}
      </div>
    </div>
  );
}

export default Category;
