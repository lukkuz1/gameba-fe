import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../hooks/authentification/authcontext';
import { getGame, updateGame, deleteGame } from '../../../../../hooks/games/gamesApi';
import { getComments, addComment } from '../../../../../hooks/comments/commentsApi';
import './Game.css';

export function Game() {
  const { categoryId, gameId } = useParams();
  const { auth } = useAuth(); // Get the authentication context
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
    ReleaseDate: '',
    Developer: '',
    Platform: ''
  });

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const gameData = await getGame(categoryId, gameId);
        setGame(gameData);
        setUpdatedGame({
          Title: gameData.Title,
          Description: gameData.Description,
          Rating: gameData.Rating,
          ReleaseDate: gameData.ReleaseDate,
          Developer: gameData.Developer,
          Platform: gameData.Platform
        });
        setLoading(false);
      } catch (err) {
        setError('Error fetching game data: ' + err.message);
        setLoading(false);
      }
    };

    fetchGameData();
  }, [categoryId, gameId]);

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

  const handleEditGame = async () => {
    if (!auth?.accessToken) {
      alert("You must be logged in to edit this game.");
      return;
    }

    try {
      const updatedGameData = await updateGame(
        categoryId,
        gameId,
        updatedGame,
        { headers: { Authorization: `Bearer ${auth.accessToken}` } }
      );
      setGame(updatedGameData);
      setEditMode(false);
      alert("Game updated successfully.");
    } catch (err) {
      setError('Error updating game: ' + err.message);
    }
  };

  const handleDeleteGame = async () => {
    if (!auth?.accessToken) {
      alert("You must be logged in to delete this game.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this game?")) {
      return;
    }

    try {
      await deleteGame(categoryId, gameId, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      alert("Game deleted successfully.");
      navigate(`/categories/${categoryId}`);
    } catch (err) {
      console.error("Error deleting game:", err);
      setError("Error deleting game: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAddComment = async () => {
    if (!auth?.accessToken) {
      alert("You must be logged in to add a comment.");
      return;
    }

    if (!newComment.trim()) {
      alert("Comment content cannot be empty.");
      return;
    }

    try {
      const newCommentData = await addComment(categoryId, gameId, 
        { Content: newComment }, 
        { headers: { Authorization: `Bearer ${auth.accessToken}` } }
      );
      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment('');
      alert("Comment added successfully.");
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Error adding comment: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <div className="game-page__loading">Loading game details...</div>;
  }

  if (error) {
    return <div className="game-page__error">{error}</div>;
  }

  if (!game) {
    return <div className="game-page__error">Game not found.</div>;
  }

  return (
    <div className="game-page">
      <div className="game-page__header">
        {editMode ? (
          <div className="game-page__edit-form">
            <h2>Edit Game Details</h2>
            <input
              type="text"
              value={updatedGame.Title}
              onChange={(e) => setUpdatedGame({ ...updatedGame, Title: e.target.value })}
              placeholder="Game Title"
              className="game-page__input-field"
            />
            <textarea
              value={updatedGame.Description}
              onChange={(e) => setUpdatedGame({ ...updatedGame, Description: e.target.value })}
              placeholder="Game Description"
              className="game-page__textarea-field"
            />
            <input
              type="number"
              value={updatedGame.Rating}
              onChange={(e) => setUpdatedGame({ ...updatedGame, Rating: e.target.value })}
              placeholder="Game Rating"
              className="game-page__input-field"
            />
            <input
              type="date"
              value={updatedGame.ReleaseDate}
              onChange={(e) => setUpdatedGame({ ...updatedGame, ReleaseDate: e.target.value })}
              className="game-page__input-field"
            />
            <input
              type="text"
              value={updatedGame.Developer}
              onChange={(e) => setUpdatedGame({ ...updatedGame, Developer: e.target.value })}
              placeholder="Developer"
              className="game-page__input-field"
            />
            <input
              type="text"
              value={updatedGame.Platform}
              onChange={(e) => setUpdatedGame({ ...updatedGame, Platform: e.target.value })}
              placeholder="Platform"
              className="game-page__input-field"
            />
            <div className="game-page__form-actions">
              <button onClick={handleEditGame} className="game-page__btn--primary">Save Changes</button>
              <button onClick={() => setEditMode(false)} className="game-page__btn--secondary">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="game-page__title">{game.Title}</h1>
            <p className="game-page__description">{game.Description}</p>
            <div className="game-page__actions">
              {/* Conditionally render Edit and Delete buttons based on auth */}
              {auth?.accessToken && (
                <>
                  <button onClick={() => setEditMode(true)} className="game-page__btn--primary">Edit Game</button>
                  <button onClick={handleDeleteGame} className="game-page__btn--danger">Delete Game</button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div className="game-page__details">
        <p><strong>Rating:</strong> {game.Rating}</p>
        <p><strong>Release Date:</strong> {new Date(game.ReleaseDate).toLocaleDateString()}</p>
        <p><strong>Developer:</strong> {game.Developer}</p>
        <p><strong>Platform:</strong> {game.Platform}</p>
      </div>

      <div className="game-page__comments">
        <h2>Comments</h2>
        <div className="game-page__comment-form">
          {/* Conditionally render Add Comment button based on auth */}
          {auth?.accessToken && (
            <>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="game-page__textarea-field"
              />
              <button onClick={handleAddComment} className="game-page__btn--primary">Post Comment</button>
            </>
          )}
        </div>

        {comments.length > 0 ? (
          <ul className="game-page__comments-list">
            {comments.map((comment) => (
              <li key={comment.Id} className="game-page__comment-item">
                <Link to={`/categories/${categoryId}/games/${gameId}/comments/${comment.Id}`}>
                  <div className="game-page__comment-card">
                    <div className="game-page__comment-header">
                      <span className="game-page__comment-author">{comment.UserName}</span>
                      <span className="game-page__comment-timestamp">{new Date(comment.CreatedAt).toLocaleString()}</span>
                    </div>
                    <p className="game-page__comment-content">{comment.Content}</p>
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