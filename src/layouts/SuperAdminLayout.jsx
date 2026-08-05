// Layout wrapper with sidebar navigation for the superadmin portal
import { Outlet, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

function SuperAdminLayout() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="superadmin-layout">
      <aside className="superadmin-sidebar">
        <h2>Super Admin</h2>
        <nav>
          <Link to="/superadmin/dashboard">Dashboard</Link>
          <Link to="/superadmin/roles-permissions">Roles & Permissions</Link>
          <Link to="/superadmin/organizations">Organizations</Link>
          <Link to="/superadmin/system-settings">System Settings</Link>
        </nav>
      </aside>

      <div className="superadmin-main">
        <header className="superadmin-topbar">
          <span>Welcome, {user?.name}</span>
          <button onClick={() => dispatch(logout())}>Logout</button>
        </header>

        <main className="superadmin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SuperAdminLayout;