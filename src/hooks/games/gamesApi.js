// gamesApi.js

import axios from 'axios';

const BASE_URL = 'https://squid-app-xuzxl.ondigitalocean.app/api/v1/categories';

// Get all games in a category
const getGames = async (categoryId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${categoryId}/games`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || `Failed to fetch games for category ID: ${categoryId}`);
  }
};

// Get a specific game in a category by game ID
const getGame = async (categoryId, gameId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${categoryId}/games/${gameId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || `Failed to fetch game with ID: ${gameId} in category ID: ${categoryId}`);
  }
};

// Add a new game to a category
const addGame = async (categoryId, gameData, config) => {
  try {
    console.log('Sending Request with config:', config);
    const response = await axios.post(`${BASE_URL}/${categoryId}/games`, gameData, config);
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response || error.message);
    throw new Error(error.message || 'Failed to add game');
  }
};


// Update an existing game in a category
const updateGame = async (categoryId, gameId, gameData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${categoryId}/games/${gameId}`, gameData);
    return response.data;
  } catch (error) {
    throw new Error(error.message || `Failed to update game with ID: ${gameId} in category ID: ${categoryId}`);
  }
};

// Delete a game from a category
const deleteGame = async (categoryId, gameId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${categoryId}/games/${gameId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || `Failed to delete game with ID: ${gameId} in category ID: ${categoryId}`);
  }
};

export {
  getGames,
  getGame,
  addGame,
  updateGame,
  deleteGame,
};
