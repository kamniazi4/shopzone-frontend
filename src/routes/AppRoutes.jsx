// Central route definitions for the whole application
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchCurrentUser } from '../features/auth/authSlice';

import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';

import SuperAdminLayout from '../layouts/SuperAdminLayout';
import AdminLayout from '../layouts/AdminLayout';
import VendorLayout from '../layouts/VendorLayout';
import CustomerLayout from '../layouts/CustomerLayout';

// Auth pages (assumed to exist under pages/auth, kept minimal here)
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Superadmin pages
import SuperAdminDashboard from '../pages/superadmin/Dashboard';
import RolesPermissions from '../pages/superadmin/RolesPermissions';
import Organizations from '../pages/superadmin/Organizations';
import SystemSettings from '../pages/superadmin/SystemSettings';

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard';
import VendorApprovals from '../pages/admin/VendorApprovals';
import CategoriesAttributes from '../pages/admin/CategoriesAttributes';
import Coupons from '../pages/admin/Coupons';
import AuditLogs from '../pages/admin/AuditLogs';

// Vendor pages
import VendorDashboard from '../pages/vendor/Dashboard';
import VendorProducts from '../pages/vendor/Products';
import VendorVariants from '../pages/vendor/Variants';
import VendorInventory from '../pages/vendor/Inventory';
import VendorOrders from '../pages/vendor/Orders';
import VendorWallet from '../pages/vendor/Wallet';
import VendorShippingSettings from '../pages/vendor/ShippingSettings';

// Customer pages
import Home from '../pages/customer/Home';
import ProductDetails from '../pages/customer/ProductDetails';
import Cart from '../pages/customer/Cart';
import Wishlist from '../pages/customer/Wishlist';
import Checkout from '../pages/customer/Checkout';
import OrderHistory from '../pages/customer/OrderHistory';
import OrderTracking from '../pages/customer/OrderTracking';
import Reviews from '../pages/customer/Reviews';
import CategoryListing from '../pages/customer/CategoryListing';

function Unauthorized() {
  return <div style={{ padding: '2rem' }}>You do not have access to this page.</div>;
}

function AppRoutes() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  // Restore session on app load if a token exists
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchCurrentUser());
    }
  }, [accessToken, dispatch]);

  return (
    <Routes>
      {/* Guest-only */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Customer storefront - public browsing, protected checkout actions handled inside pages */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products/:id/reviews" element={<Reviews />} />
        <Route path="/category/:categoryId" element={<CategoryListing />} />

        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/orders/:id/tracking" element={<OrderTracking />} />
        </Route>
      </Route>

      {/* Vendor portal */}
      <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
        <Route element={<VendorLayout />}>
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/products" element={<VendorProducts />} />
          <Route path="/vendor/products/:productId/variants" element={<VendorVariants />} />
          <Route path="/vendor/inventory" element={<VendorInventory />} />
          <Route path="/vendor/orders" element={<VendorOrders />} />
          <Route path="/vendor/wallet" element={<VendorWallet />} />
          <Route path="/vendor/shipping-settings" element={<VendorShippingSettings />} />
        </Route>
      </Route>

      {/* Admin portal */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/vendor-approvals" element={<VendorApprovals />} />
          <Route path="/admin/categories-attributes" element={<CategoriesAttributes />} />
          <Route path="/admin/coupons" element={<Coupons />} />
          <Route path="/admin/audit-logs" element={<AuditLogs />} />
        </Route>
      </Route>

      {/* Superadmin portal */}
      <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
        <Route element={<SuperAdminLayout />}>
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/roles-permissions" element={<RolesPermissions />} />
          <Route path="/superadmin/organizations" element={<Organizations />} />
          <Route path="/superadmin/system-settings" element={<SystemSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;