
import axios from 'axios';
const BASE_URL = 'https://squid-app-xuzxl.ondigitalocean.app/api/v1/categories';



// Get all categories
const getCategories = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch categories');
  }
};

// Get a single category by ID
const getCategorie = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || `Failed to fetch category with ID: ${id}`);
  }
};

const addCategorie = async (categoryData, token) => {
  try {
    const response = await axios.post(BASE_URL, categoryData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to add category');
  }
};
// Update an existing category
const updateCategorie = async (id, categoryData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, categoryData);
    return response.data;
  } catch (error) {
    throw new Error(error.message || `Failed to update category with ID: ${id}`);
  }
};

// Delete a category by ID
const deleteCategorie = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || `Failed to delete category with ID: ${id}`);
  }
};

export {
  getCategories,
  getCategorie,
  addCategorie,
  updateCategorie,
  deleteCategorie,
};
