// Layout wrapper with sidebar navigation for the admin portal
import { Outlet, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

function AdminLayout() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/vendor-approvals">Vendor Approvals</Link>
          <Link to="/admin/categories-attributes">Categories & Attributes</Link>
          <Link to="/admin/coupons">Coupons</Link>
          <Link to="/admin/audit-logs">Audit Logs</Link>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <span>Welcome, {user?.name}</span>
          <button onClick={() => dispatch(logout())}>Logout</button>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;