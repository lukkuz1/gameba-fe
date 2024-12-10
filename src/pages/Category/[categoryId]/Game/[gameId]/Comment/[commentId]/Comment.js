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

  // Fetch comment data
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

  // Handle comment update
  const handleEditComment = async () => {
    try {
      const updatedComment = await updateComment(categoryId, gameId, commentId, { Content: updatedContent });
      setComment(updatedComment);
      setEditMode(false);
    } catch (err) {
      setError('Error updating comment: ' + err.message);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async () => {
    try {
      await deleteComment(categoryId, gameId, commentId);
      navigate(`/categories/${categoryId}/games/${gameId}`);
    } catch (err) {
      setError('Error deleting comment: ' + err.message);
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
            />
            <div className="buttons">
              <button onClick={handleEditComment}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <p>{comment.Content}</p>
            <p>
              <strong>Created at:</strong> {new Date(comment.CreatedAt).toLocaleDateString()}
            </p>
            <div className="buttons">
              <button onClick={() => setEditMode(true)}>Edit Comment</button>
              <button onClick={handleDeleteComment}>Delete Comment</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Comment;
