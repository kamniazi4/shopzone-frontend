// Endpoint calls for products, variants, images, catalog (categories/attributes)
import axiosClient from './axiosClient';

const productApi = {
  listProducts: (params) => axiosClient.get('/products', { params }),
  getProductById: (id) => axiosClient.get(`/products/${id}`),
  getFilterOptions: (categoryId) => axiosClient.get('/products/filters', { params: { category_id: categoryId } }),
  createProduct: (payload) => axiosClient.post('/products', payload),
  updateProduct: (id, payload) => axiosClient.put(`/products/${id}`, payload),
  updateProductStatus: (id, status, notes) => axiosClient.patch(`/products/${id}/status`, { status, notes }),
  approveVendorProduct: (id, vendor_id) => axiosClient.patch(`/products/${id}/approve`, { vendor_id }),
  deleteProduct: (id) => axiosClient.delete(`/products/${id}`),
  getStatusHistory: (id) => axiosClient.get(`/products/${id}/status-history`),

  // Variants
  listVariants: (productId) => axiosClient.get(`/products/${productId}/variants`),
  getVariantById: (id) => axiosClient.get(`/products/variants/${id}`),
  createVariant: (productId, payload) => axiosClient.post(`/products/${productId}/variants`, payload),
  updateVariant: (id, payload) => axiosClient.put(`/products/variants/${id}`, payload),
  deleteVariant: (id) => axiosClient.delete(`/products/variants/${id}`),

  // Variant pricing
  listVariantPrices: (id) => axiosClient.get(`/products/variants/${id}/prices`),
  addVariantPrice: (id, payload) => axiosClient.post(`/products/variants/${id}/prices`, payload),
  addPromotionPrice: (id, payload) => axiosClient.post(`/products/variants/${id}/promotion-price`, payload),
  getEffectivePrice: (id) => axiosClient.get(`/products/variants/${id}/effective-price`),

  // Images
  listImages: (productId) => axiosClient.get(`/products/${productId}/images`),
  addImage: (productId, payload) => axiosClient.post(`/products/${productId}/images`, payload),
  uploadImage: (productId, formData) => axiosClient.post(`/products/${productId}/images/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  setFeaturedImage: (productId, id) => axiosClient.patch(`/products/${productId}/images/${id}/featured`),
  deleteImage: (productId, id) => axiosClient.delete(`/products/${productId}/images/${id}`),

  // Catalog - categories
  listCategories: () => axiosClient.get('/catalog/categories'),
  getCategoryById: (id) => axiosClient.get(`/catalog/categories/${id}`),
  createCategory: (payload) => axiosClient.post('/catalog/categories', payload),
  updateCategory: (id, payload) => axiosClient.put(`/catalog/categories/${id}`, payload),
  deleteCategory: (id) => axiosClient.delete(`/catalog/categories/${id}`),

  // Catalog - attributes
  listAttributes: () => axiosClient.get('/catalog/attributes'),
  listAttributeValues: (id) => axiosClient.get(`/catalog/attributes/${id}/values`),
  createAttribute: (payload) => axiosClient.post('/catalog/attributes', payload),
  deleteAttribute: (id) => axiosClient.delete(`/catalog/attributes/${id}`),
  addAttributeValue: (id, value) => axiosClient.post(`/catalog/attributes/${id}/values`, { value }),
  deleteAttributeValue: (id, valueId) => axiosClient.delete(`/catalog/attributes/${id}/values/${valueId}`),
};

export default productApi;