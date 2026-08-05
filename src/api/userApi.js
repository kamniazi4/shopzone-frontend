// Endpoint calls for users, addresses, devices
import axiosClient from './axiosClient';

const userApi = {
  listUsers: (params) => axiosClient.get('/users', { params }),
  getUserById: (id) => axiosClient.get(`/users/${id}`),
  updateUser: (id, payload) => axiosClient.put(`/users/${id}`, payload),
  deleteUser: (id) => axiosClient.delete(`/users/${id}`),

  listMyAddresses: () => axiosClient.get('/users/me/addresses'),
  addAddress: (payload) => axiosClient.post('/users/me/addresses', payload),
  updateAddress: (id, payload) => axiosClient.put(`/users/me/addresses/${id}`, payload),
  deleteAddress: (id) => axiosClient.delete(`/users/me/addresses/${id}`),

  registerDevice: (payload) => axiosClient.post('/users/me/devices', payload),
};

export default userApi;