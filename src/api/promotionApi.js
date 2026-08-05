// Endpoint calls for coupons and promotions
import axiosClient from './axiosClient';

const promotionApi = {
  validateCoupon: (code, subtotal) => axiosClient.post('/promotions/coupons/validate', { code, subtotal }),
  getCouponByCode: (code) => axiosClient.get(`/promotions/coupons/code/${code}`),
  listCoupons: (params) => axiosClient.get('/promotions/coupons', { params }),
  createCoupon: (payload) => axiosClient.post('/promotions/coupons', payload),
  updateCoupon: (id, payload) => axiosClient.put(`/promotions/coupons/${id}`, payload),
  deleteCoupon: (id) => axiosClient.delete(`/promotions/coupons/${id}`),
  listCouponUsages: (id) => axiosClient.get(`/promotions/coupons/${id}/usages`),

  listPromotions: (params) => axiosClient.get('/promotions', { params }),
  getPromotionById: (id) => axiosClient.get(`/promotions/${id}`),
  createPromotion: (payload) => axiosClient.post('/promotions', payload),
  updatePromotion: (id, payload) => axiosClient.put(`/promotions/${id}`, payload),
  deletePromotion: (id) => axiosClient.delete(`/promotions/${id}`),
  addPromotionRule: (id, payload) => axiosClient.post(`/promotions/${id}/rules`, payload),
  deletePromotionRule: (id, ruleId) => axiosClient.delete(`/promotions/${id}/rules/${ruleId}`),
};

export default promotionApi;