import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Game.css';

export function Game() {
  const { categoryId, gameId } = useParams();
  const [game, setGame] = useState(null);
  const [comments, setComments] = useState([]); // State for storing comments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch game data
  useEffect(() => {
    axios
      .get(`https://squid-app-xuzxl.ondigitalocean.app/api/v1/categories/${categoryId}/games/${gameId}`)
      .then((response) => {
        setGame(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching game data: ' + err.message);
        setLoading(false);
      });
  }, [categoryId, gameId]);

  // Fetch comments for the game
  useEffect(() => {
    axios
      .get(`https://squid-app-xuzxl.ondigitalocean.app/api/v1/categories/${categoryId}/games/${gameId}/comments`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((err) => {
        setError('Error fetching comments: ' + err.message);
      });
  }, [categoryId, gameId]);

  if (loading) {
    return <div className="loading">Loading game details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!game) {
    return <div className="error">Game not found.</div>;
  }

  return (
    <div className="game-page">
      <h1 className="game-title">{game.Title}</h1>
      <p className="game-description">{game.Description}</p>
      <div className="game-details">
        <p>
          <strong>Rating:</strong> {game.Rating}
        </p>
        <p>
          <strong>Release Date:</strong> {new Date(game.ReleaseDate).toLocaleDateString()}
        </p>
        {/* <p>
          <strong>Category ID:</strong> {game.CategoryId}
        </p>
        <p>
          <strong>User ID:</strong> {game.UserId}
        </p> */}
      </div>

      {/* Display comments section */}
      <div className="comments-section">
        <h2>Comments:</h2>
        {comments.length > 0 ? (
          <ul className="comments-list">
            {comments.map((comment) => (
              <li key={comment.Id}>
                <Link to={`/categories/${categoryId}/games/${gameId}/comments/${comment.Id}`}>
                  <div className="comment-card">
                    <div className="comment-user">
                      <span className="username">{comment.UserName}</span>
                      <span className="timestamp">{new Date(comment.CreatedAt).toLocaleString()}</span>
                    </div>
                    <p>{comment.Content}</p> {/* Display the comment's content */}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments available for this game.</p>
        )}
      </div>
    </div>
  );
}

export default Game;
