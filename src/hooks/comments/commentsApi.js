// commentsApi.js

import axios from 'axios';

const BASE_URL = 'https://squid-app-xuzxl.ondigitalocean.app/api/v1/categories';

// Get all comments for a specific game in a category
const getComments = async (categoryId, gameId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${categoryId}/games/${gameId}/comments`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || `Failed to fetch comments for game ID: ${gameId} in category ID: ${categoryId}`);
  }
};

// Get a specific comment by comment ID
const getComment = async (categoryId, gameId, commentId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${categoryId}/games/${gameId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || `Failed to fetch comment with ID: ${commentId} for game ID: ${gameId} in category ID: ${categoryId}`);
  }
};

// Add a new comment to a game
const addComment = async (categoryId, gameId, commentData, options = {}) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${categoryId}/games/${gameId}/comments`,
      commentData,
      options
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to add comment"
    );
  }
};


// Update an existing comment for a game
const updateComment = async (categoryId, gameId, commentId, commentData, options = {}) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${categoryId}/games/${gameId}/comments/${commentId}`,
      commentData,
      options // Passing headers (e.g., Authorization token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.message || `Failed to update comment with ID: ${commentId} for game ID: ${gameId} in category ID: ${categoryId}`);
  }
};


// Delete a comment from a game
const deleteComment = async (categoryId, gameId, commentId, options = {}) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/${categoryId}/games/${gameId}/comments/${commentId}`,
      options
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      `Failed to delete comment with ID: ${commentId} for game ID: ${gameId} in category ID: ${categoryId}`
    );
  }
};

export {
  getComments,
  getComment,
  addComment,
  updateComment,
  deleteComment,
};
