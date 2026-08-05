// Endpoint calls for vendors, vendor wallet, vendor shipping settings
import axiosClient from './axiosClient';

const vendorApi = {
  listVendors: (params) => axiosClient.get('/vendors', { params }),
  getVendorById: (id) => axiosClient.get(`/vendors/${id}`),
  registerVendor: (payload) => axiosClient.post('/vendors/register', payload),
  updateVendor: (id, payload) => axiosClient.put(`/vendors/${id}`, payload),
  updateVendorStatus: (id, status) => axiosClient.patch(`/vendors/${id}/status`, { status }),

  getVendorSettings: (id) => axiosClient.get(`/vendors/${id}/settings`),
  upsertVendorSettings: (id, settings) => axiosClient.put(`/vendors/${id}/settings`, { settings }),

  listVendorStaff: (id) => axiosClient.get(`/vendors/${id}/staff`),
  addVendorStaff: (id, payload) => axiosClient.post(`/vendors/${id}/staff`, payload),
  removeVendorStaff: (id, userId) => axiosClient.delete(`/vendors/${id}/staff/${userId}`),

  getWallet: (id) => axiosClient.get(`/vendors/${id}/wallet`),
  listTransactions: (id, params) => axiosClient.get(`/vendors/${id}/transactions`, { params }),
  createTransaction: (id, payload) => axiosClient.post(`/vendors/${id}/transactions`, payload),

  listShippingSettings: (id) => axiosClient.get(`/vendors/${id}/shipping-settings`),
  addShippingSetting: (id, payload) => axiosClient.post(`/vendors/${id}/shipping-settings`, payload),
  updateShippingSetting: (id, settingId, payload) =>
    axiosClient.put(`/vendors/${id}/shipping-settings/${settingId}`, payload),
  deleteShippingSetting: (id, settingId) =>
    axiosClient.delete(`/vendors/${id}/shipping-settings/${settingId}`),
};

export default vendorApi;