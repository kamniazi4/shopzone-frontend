// Endpoint calls for orders, order splits, dropship, taxes
import axiosClient from './axiosClient';

const orderApi = {
  checkout: (payload) => axiosClient.post('/orders/checkout', payload),
  listMyOrders: (params) => axiosClient.get('/orders/my-orders', { params }),
  listAllOrders: (params) => axiosClient.get('/orders', { params }),
  listVendorOrders: (vendorId, params) => axiosClient.get(`/orders/vendor/${vendorId}`, { params }),
  getOrderById: (id) => axiosClient.get(`/orders/${id}`),
  updateOrderStatus: (id, status, notes) => axiosClient.patch(`/orders/${id}/status`, { status, notes }),
  getStatusHistory: (id) => axiosClient.get(`/orders/${id}/status-history`),

  createDropshipOrder: (id, payload) => axiosClient.post(`/orders/${id}/dropship`, payload),
  updateDropshipStatus: (dropshipId, status) =>
    axiosClient.patch(`/orders/dropship/${dropshipId}/status`, { status }),

  listOrderSplits: (id) => axiosClient.get(`/orders/${id}/splits`),
  markSplitPaid: (splitId) => axiosClient.patch(`/orders/splits/${splitId}/mark-paid`),

  listOrderTaxes: (id) => axiosClient.get(`/orders/${id}/taxes`),
  addOrderTax: (id, payload) => axiosClient.post(`/orders/${id}/taxes`, payload),
};

export default orderApi;