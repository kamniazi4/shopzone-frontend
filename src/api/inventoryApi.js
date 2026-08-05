// Endpoint calls for warehouses, inventory, movements, alerts, reservations, transfers
import axiosClient from './axiosClient';

const inventoryApi = {
  // Warehouses
  listWarehouses: (params) => axiosClient.get('/inventory/warehouses', { params }),
  getWarehouseById: (id) => axiosClient.get(`/inventory/warehouses/${id}`),
  createWarehouse: (payload) => axiosClient.post('/inventory/warehouses', payload),
  updateWarehouse: (id, payload) => axiosClient.put(`/inventory/warehouses/${id}`, payload),
  deleteWarehouse: (id) => axiosClient.delete(`/inventory/warehouses/${id}`),

  // Transfers
  listTransfers: (warehouseId) => axiosClient.get(`/inventory/warehouses/${warehouseId}/transfers`),
  createTransfer: (payload) => axiosClient.post('/inventory/transfers', payload),
  completeTransfer: (id) => axiosClient.patch(`/inventory/transfers/${id}/complete`),

  // Inventory
  listInventory: (params) => axiosClient.get('/inventory', { params }),
  getInventoryById: (id) => axiosClient.get(`/inventory/${id}`),
  upsertInventory: (payload) => axiosClient.post('/inventory', payload),
  adjustInventory: (id, payload) => axiosClient.patch(`/inventory/${id}/adjust`, payload),

  // Alerts
  setAlert: (id, threshold) => axiosClient.post(`/inventory/${id}/alerts`, { threshold }),
  listTriggeredAlerts: () => axiosClient.get('/inventory/alerts/triggered'),

  // Movements & reservations
  listMovements: (id, params) => axiosClient.get(`/inventory/${id}/movements`, { params }),
  createReservation: (id, payload) => axiosClient.post(`/inventory/${id}/reservations`, payload),
  releaseReservation: (reservationId) => axiosClient.patch(`/inventory/reservations/${reservationId}/release`),
  completeReservation: (reservationId) => axiosClient.patch(`/inventory/reservations/${reservationId}/complete`),
};

export default inventoryApi;