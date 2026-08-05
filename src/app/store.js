// Redux store configuration - all feature slices are combined here
import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import rbacReducer from '../features/rbac/rbacSlice';
import vendorReducer from '../features/vendor/vendorSlice';
import productReducer from '../features/product/productSlice';
import catalogReducer from '../features/catalog/catalogSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import cartReducer from '../features/cart/cartSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import orderReducer from '../features/order/orderSlice';
import paymentReducer from '../features/payment/paymentSlice';
import shippingReducer from '../features/shipping/shippingSlice';
import reviewReducer from '../features/review/reviewSlice';
import promotionReducer from '../features/promotion/promotionSlice';
import bannerReducer from '../features/banner/bannerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    rbac: rbacReducer,
    vendor: vendorReducer,
    product: productReducer,
    catalog: catalogReducer,
    inventory: inventoryReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    payment: paymentReducer,
    shipping: shippingReducer,
    review: reviewReducer,
    promotion: promotionReducer,
    banner: bannerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;