// Endpoint calls for payments, gateways, COD collections
import axiosClient from './axiosClient';

const paymentApi = {
  listPaymentsByOrder: (orderId) => axiosClient.get(`/payments/orders/${orderId}`),
  initiatePayment: (orderId, payload) => axiosClient.post(`/payments/orders/${orderId}`, payload),
  getPaymentById: (id) => axiosClient.get(`/payments/${id}`),
  confirmPayment: (id, status) => axiosClient.patch(`/payments/${id}/confirm`, { status }),
  listPaymentEvents: (id) => axiosClient.get(`/payments/${id}/events`),

  recordCodCollection: (orderId, payload) => axiosClient.post(`/payments/orders/${orderId}/cod`, payload),
  markCodRemitted: (id) => axiosClient.patch(`/payments/cod/${id}/remit`),

  listGateways: () => axiosClient.get('/payments/gateways'),
  createGateway: (payload) => axiosClient.post('/payments/gateways', payload),
  updateGateway: (id, payload) => axiosClient.put(`/payments/gateways/${id}`, payload),
  deleteGateway: (id) => axiosClient.delete(`/payments/gateways/${id}`),
};

export default paymentApi;