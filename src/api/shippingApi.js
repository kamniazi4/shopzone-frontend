// Endpoint calls for shipping providers and shipments
import axiosClient from './axiosClient';

const shippingApi = {
  listProviders: () => axiosClient.get('/shipping/providers'),
  createProvider: (payload) => axiosClient.post('/shipping/providers', payload),
  updateProvider: (id, payload) => axiosClient.put(`/shipping/providers/${id}`, payload),
  deleteProvider: (id) => axiosClient.delete(`/shipping/providers/${id}`),

  listShipmentsByOrder: (orderId) => axiosClient.get(`/shipping/orders/${orderId}`),
  getShipmentById: (id) => axiosClient.get(`/shipping/${id}`),
  createShipment: (orderId, payload) => axiosClient.post(`/shipping/orders/${orderId}`, payload),
  updateShipmentStatus: (id, payload) => axiosClient.patch(`/shipping/${id}/status`, payload),
  uploadDeliveryProof: (id, payload) => axiosClient.post(`/shipping/${id}/delivery-proof`, payload),
};

export default shippingApi;