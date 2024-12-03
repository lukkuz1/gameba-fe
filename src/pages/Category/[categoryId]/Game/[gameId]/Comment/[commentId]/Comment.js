import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Comment.css';

export function Comment() {
  const { categoryId, gameId, commentId } = useParams(); // Extract categoryId, gameId, and commentId from URL
  const [comment, setComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch single comment based on commentId
  useEffect(() => {
    axios
      .get(`https://squid-app-xuzxl.ondigitalocean.app/api/v1/categories/${categoryId}/games/${gameId}/comments/${commentId}`)
      .then((response) => {
        setComment(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching comment: ' + err.message);
        setLoading(false);
      });
  }, [categoryId, gameId, commentId]);

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
      <h1 className="comment-title">Comment Details</h1>
      <div className="comment-card">
        {/* <p><strong>User ID:</strong> {comment.UserId}</p> */}
        <p><strong>Comment:</strong> {comment.Body}</p>
        <p><strong>Created at:</strong> {new Date(comment.CreatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default Comment;
