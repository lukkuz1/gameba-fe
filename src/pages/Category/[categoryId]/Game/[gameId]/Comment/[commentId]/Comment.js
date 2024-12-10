import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../../../../../hooks/authentification/authcontext';
import './Comment.css';

export function Comment() {
  const { categoryId, gameId, commentId } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [comment, setComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedContent, setUpdatedContent] = useState('');

  // Fetch comment data
  useEffect(() => {
    axios
      .get(`https://squid-app-xuzxl.ondigitalocean.app/api/v1/categories/${categoryId}/games/${gameId}/comments/${commentId}`)
      .then((response) => {
        setComment(response.data);
        setUpdatedContent(response.data.Content);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching comment: ' + err.message);
        setLoading(false);
      });
  }, [categoryId, gameId, commentId]);

  const handleEditComment = () => {
    axios
      .put(
        `https://squid-app-xuzxl.ondigitalocean.app/api/v1/categories/${categoryId}/games/${gameId}/comments/${commentId}`,
        { Content: updatedContent },
        { headers: { Authorization: `Bearer ${auth.accessToken}` } }
      )
      .then((response) => {
        setComment(response.data);
        setEditMode(false);
      })
      .catch((err) => {
        setError('Error updating comment: ' + err.message);
      });
  };

  const handleDeleteComment = () => {
    axios
      .delete(
        `https://squid-app-xuzxl.ondigitalocean.app/api/v1/categories/${categoryId}/games/${gameId}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${auth.accessToken}` } }
      )
      .then(() => {
        navigate(`/categories/${categoryId}/games/${gameId}`);
      })
      .catch((err) => {
        setError('Error deleting comment: ' + err.message);
      });
  };

  if (loading) {
    return <div className="loading">Loading comment...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!comment) {
    return <div className="error">Comment not found.</div>;
  }

  return (
    <div className="comment-page">
      <div className="comment-header">
        <h1 className="comment-title">Comment Details</h1>
      </div>
      <div className="comment-card">
        {editMode ? (
          <div>
            <textarea
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              placeholder="Edit your comment"
            />
            <button onClick={handleEditComment}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        ) : (
          <>
            <p>{comment.Content}</p>
            <p>
              <strong>Created at:</strong> {new Date(comment.CreatedAt).toLocaleDateString()}
            </p>
            <button onClick={() => setEditMode(true)}>Edit Comment</button>
            <button onClick={handleDeleteComment}>Delete Comment</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Comment;