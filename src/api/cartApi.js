// Endpoint calls for cart and wishlist
import axiosClient from './axiosClient';

const cartApi = {
  getMyCart: () => axiosClient.get('/cart'),
  addItem: (payload) => axiosClient.post('/cart/items', payload),
  updateItemQuantity: (itemId, quantity) => axiosClient.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => axiosClient.delete(`/cart/items/${itemId}`),
  clearCart: () => axiosClient.delete('/cart'),

  // Wishlist
  listWishlists: () => axiosClient.get('/cart/wishlists'),
  createWishlist: (name) => axiosClient.post('/cart/wishlists', { name }),
  getWishlistItems: (id) => axiosClient.get(`/cart/wishlists/${id}`),
  addWishlistItem: (id, variant_id) => axiosClient.post(`/cart/wishlists/${id}/items`, { variant_id }),
  removeWishlistItem: (id, itemId) => axiosClient.delete(`/cart/wishlists/${id}/items/${itemId}`),
  deleteWishlist: (id) => axiosClient.delete(`/cart/wishlists/${id}`),
};

export default cartApi;