// Endpoint calls for authentication module
import axiosClient from './axiosClient';

const authApi = {
  register: (payload) => axiosClient.post('/auth/register', payload),
  login: (payload) => axiosClient.post('/auth/login', payload),
  refreshToken: (refreshToken) => axiosClient.post('/auth/refresh-token', { refreshToken }),
  getMe: () => axiosClient.get('/auth/me'),
};

export default authApi;