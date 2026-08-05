// Endpoint calls for homepage promo banners
import axiosClient from './axiosClient';

const bannerApi = {
  listActiveBanners: () => axiosClient.get('/banners'),
  listAllBanners: () => axiosClient.get('/banners/all'),
  createBanner: (payload) => axiosClient.post('/banners', payload),
  updateBanner: (id, payload) => axiosClient.put(`/banners/${id}`, payload),
  deleteBanner: (id) => axiosClient.delete(`/banners/${id}`),
};

export default bannerApi;