import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Category.css';

export function Category() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://squid-app-xuzxl.ondigitalocean.app/api/v1/categories/${categoryId}`)
      .then((response) => {
        setCategory(response.data);
      })
      .catch((err) => {
        setError(err.message);
      });

    axios
      .get(`https://squid-app-xuzxl.ondigitalocean.app/api/v1/categories/${categoryId}/games`)
      .then((response) => {
        setGames(response.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryId]);

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
        <p className="category-description">{category.Description}</p>
        {category.AdditionalDescription && (
          <p className="category-additional">{category.AdditionalDescription}</p>
        )}
      </div>

      <div className="category-details">
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
    </div>
  );
}

export default Category;