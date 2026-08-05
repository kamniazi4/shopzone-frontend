// Layout wrapper for the customer-facing storefront
import { Outlet, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

function CustomerLayout() {
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const cartItemCount = useAppSelector((state) => state.cart.items?.length || 0);

  return (
    <div className="customer-layout">
      <header className="customer-header">
        <Link to="/" className="logo">ShopZone</Link>

        <nav className="customer-nav">
          <Link to="/">Home</Link>
          {accessToken && <Link to="/wishlist">Wishlist</Link>}
          {accessToken && <Link to="/cart">Cart ({cartItemCount})</Link>}
          {accessToken && <Link to="/orders">My Orders</Link>}
          {accessToken && <Link to="/vendor/products">Vendor Panel</Link>}
        </nav>

        <div className="customer-auth-area">
          {accessToken && user ? (
            <>
              <span>Hi, {user.name}</span>
              <button onClick={() => dispatch(logout())}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </header>

      <main className="customer-content">
        <Outlet />
      </main>

      <footer className="customer-footer">
        <p>&copy; {new Date().getFullYear()} ShopZone. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default CustomerLayout;