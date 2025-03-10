import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://im-made-in-canada.onrender.com/api' : '/api';

const apiService = {
  // Item APIs
  getItems: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/items`);
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  },

  getItem: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/items/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching item ${id}:`, error);
      throw error;
    }
  },

  searchItems: async (query) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/items/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching items:', error);
      throw error;
    }
  },

  createItem: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/items`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  updateItem: async (id, formData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/items/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating item ${id}:`, error);
      throw error;
    }
  },

  deleteItem: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/items/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting item ${id}:`, error);
      throw error;
    }
  }
};

export default apiService;