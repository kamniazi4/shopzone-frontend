// Layout wrapper with sidebar navigation for the vendor portal
import { Outlet, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

function VendorLayout() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="vendor-layout">
      <aside className="vendor-sidebar">
        <h2>Vendor Portal</h2>
        <nav>
          <Link to="/vendor/dashboard">Dashboard</Link>
          <Link to="/vendor/products">Products</Link>
          <Link to="/vendor/inventory">Inventory</Link>
          <Link to="/vendor/orders">Orders</Link>
          <Link to="/vendor/wallet">Wallet</Link>
          <Link to="/vendor/shipping-settings">Shipping Settings</Link>
        </nav>
      </aside>

      <div className="vendor-main">
        <header className="vendor-topbar">
          <span>Welcome, {user?.name}</span>
          <button onClick={() => dispatch(logout())}>Logout</button>
        </header>

        <main className="vendor-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default VendorLayout;