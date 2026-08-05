// Endpoint calls for the three recommendation algorithms
import axiosClient from './axiosClient';

const recommendationApi = {
  recordView: (productId) => axiosClient.post('/recommendations/views', { product_id: productId }),
  getTrending: (limit = 10) => axiosClient.get('/recommendations/trending', { params: { limit } }),
  getRelated: (productId, limit = 10) => axiosClient.get(`/recommendations/${productId}/related`, { params: { limit } }),
  getAlsoBought: (productId, limit = 10) => axiosClient.get(`/recommendations/${productId}/also-bought`, { params: { limit } }),
};

export default recommendationApi;