// Superadmin dashboard - platform-wide overview
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchRoles } from '../../features/rbac/rbacSlice';
import { fetchVendors } from '../../features/vendor/vendorSlice';

function SuperAdminDashboard() {
  const dispatch = useAppDispatch();
  const { roles } = useAppSelector((state) => state.rbac);
  const { list: vendors } = useAppSelector((state) => state.vendor);

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchVendors({ limit: 100 }));
  }, [dispatch]);

  return (
    <div className="superadmin-dashboard">
      <h2>Super Admin Dashboard</h2>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h4>Total Roles</h4>
          <p>{roles.length}</p>
        </div>
        <div className="dashboard-card">
          <h4>Total Vendors</h4>
          <p>{vendors.length}</p>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;