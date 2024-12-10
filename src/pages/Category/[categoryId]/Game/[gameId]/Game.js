import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../hooks/authentification/authcontext';
import { getGame, updateGame, deleteGame } from '../../../../../hooks/games/gamesApi';
import { getComments, addComment } from '../../../../../hooks/comments/commentsApi';
import './Game.css';

export function Game() {
  const { categoryId, gameId } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [updatedGame, setUpdatedGame] = useState({
    Title: '',
    Description: '',
    Rating: '',
  });

  // Fetch game details
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const gameData = await getGame(categoryId, gameId);
        setGame(gameData);
        setUpdatedGame({
          Title: gameData.Title,
          Description: gameData.Description,
          Rating: gameData.Rating,
        });
        setLoading(false);
      } catch (err) {
        setError('Error fetching game data: ' + err.message);
        setLoading(false);
      }
    };

    fetchGameData();
  }, [categoryId, gameId]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await getComments(categoryId, gameId);
        setComments(commentsData);
      } catch (err) {
        setError('Error fetching comments: ' + err.message);
      }
    };

    fetchComments();
  }, [categoryId, gameId]);

  // Handle game update
  const handleEditGame = async () => {
    try {
      const updatedGameData = await updateGame(categoryId, gameId, updatedGame);
      setGame(updatedGameData);
      setEditMode(false);
    } catch (err) {
      setError('Error updating game: ' + err.message);
    }
  };

  // Handle game deletion
  const handleDeleteGame = async () => {
    try {
      await deleteGame(categoryId, gameId);
      navigate(`/categories/${categoryId}`);
    } catch (err) {
      setError('Error deleting game: ' + err.message);
    }
  };

  // Handle adding a new comment
  const handleAddComment = async () => {
    try {
      const newCommentData = await addComment(categoryId, gameId, { Content: newComment });
      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment('');
    } catch (err) {
      setError('Error adding comment: ' + err.message);
    }
  };

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
      <div className="game-header">
        {editMode ? (
          <div>
            <input
              type="text"
              value={updatedGame.Title}
              onChange={(e) => setUpdatedGame({ ...updatedGame, Title: e.target.value })}
              placeholder="Game Title"
            />
            <textarea
              value={updatedGame.Description}
              onChange={(e) => setUpdatedGame({ ...updatedGame, Description: e.target.value })}
              placeholder="Game Description"
            />
            <input
              type="number"
              value={updatedGame.Rating}
              onChange={(e) => setUpdatedGame({ ...updatedGame, Rating: e.target.value })}
              placeholder="Game Rating"
            />
            <button onClick={handleEditGame}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        ) : (
          <>
            <h1 className="game-title">{game.Title}</h1>
            <p className="game-description">{game.Description}</p>
            <button onClick={() => setEditMode(true)}>Edit Game</button>
            <button onClick={handleDeleteGame}>Delete Game</button>
          </>
        )}
      </div>

      <div className="game-details">
        <p>
          <strong>Rating:</strong> {game.Rating}
        </p>
        <p>
          <strong>Release Date:</strong> {new Date(game.ReleaseDate).toLocaleDateString()}
        </p>
      </div>

      <div className="comments-section">
        <h2>Comments</h2>
        <div className="add-comment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleAddComment}>Post Comment</button>
        </div>
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
                    <p>{comment.Content}</p>
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
