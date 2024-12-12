import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../../../hooks/authentification/authcontext';
import { getComment, updateComment, deleteComment } from '../../../../../../../hooks/comments/commentsApi';
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

  useEffect(() => {
    const fetchCommentData = async () => {
      try {
        const data = await getComment(categoryId, gameId, commentId);
        setComment(data);
        setUpdatedContent(data.Content);
        setLoading(false);
      } catch (err) {
        setError('Error fetching comment: ' + err.message);
        setLoading(false);
      }
    };

    fetchCommentData();
  }, [categoryId, gameId, commentId]);

  const handleEditComment = async () => {
    if (!auth?.accessToken) {
      alert("You must be logged in to edit this comment.");
      return;
    }

    try {
      const updatedComment = await updateComment(
        categoryId,
        gameId,
        commentId,
        { Content: updatedContent },
        { headers: { Authorization: `Bearer ${auth.accessToken}` } }
      );
      setComment(updatedComment);
      setEditMode(false);
      alert("Comment updated successfully.");
    } catch (err) {
      setError('Error updating comment: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteComment = async () => {
    if (!auth?.accessToken) {
      alert("You must be logged in to delete this comment.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteComment(categoryId, gameId, commentId, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      alert("Comment deleted successfully.");
      navigate(`/categories/${categoryId}/games/${gameId}`);
    } catch (err) {
      setError("Error deleting comment: " + (err.response?.data?.message || err.message));
    }
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
          <div className="edit-form">
            <textarea
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              placeholder="Edit your comment"
              className="comment-input"
            />
            <div className="buttons">
              <button onClick={handleEditComment} className="save-button">Save</button>
              <button onClick={() => setEditMode(false)} className="cancel-button">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="comment-content">
              <p>{comment.Content}</p>
              <p className="comment-timestamp">
                <strong>Created at:</strong> {new Date(comment.CreatedAt).toLocaleDateString()}
              </p>
            </div>
            
            {/* Conditionally render buttons based on authentication */}
            {auth?.accessToken && (
              <div className="comment-actions">
                <button onClick={() => setEditMode(true)} className="edit-button">Edit</button>
                <button onClick={handleDeleteComment} className="delete-button">Delete</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Comment;
