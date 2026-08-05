// Endpoint calls for reviews
import axiosClient from './axiosClient';

const reviewApi = {
  listProductReviews: (productId, params) => axiosClient.get(`/reviews/products/${productId}`, { params }),
  createReview: (productId, payload) => axiosClient.post(`/reviews/products/${productId}`, payload),
  deleteReview: (id) => axiosClient.delete(`/reviews/${id}`),
  updateReviewStatus: (id, status) => axiosClient.patch(`/reviews/${id}/status`, { status }),
};

export default reviewApi;