import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getListings = async () => {
  try {
    const response = await api.get('/listings');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getListing = async (id) => {
  try {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createListing = async (listingData) => {
  try {
    const response = await api.post('/listings', listingData);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 