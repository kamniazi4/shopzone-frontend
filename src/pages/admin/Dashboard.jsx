// Admin dashboard - summary of platform activity
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAllOrders } from '../../features/order/orderSlice';
import { fetchVendors } from '../../features/vendor/vendorSlice';
import { fetchProducts } from '../../features/product/productSlice';

function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { allOrders } = useAppSelector((state) => state.order);
  const { list: vendors } = useAppSelector((state) => state.vendor);
  const { list: products } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchAllOrders({ limit: 5 }));
    dispatch(fetchVendors({ limit: 5, status: 'pending' }));
    dispatch(fetchProducts({ limit: 5 }));
  }, [dispatch]);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h4>Recent Orders</h4>
          <p>{allOrders.length}</p>
        </div>
        <div className="dashboard-card">
          <h4>Pending Vendors</h4>
          <p>{vendors.length}</p>
        </div>
        <div className="dashboard-card">
          <h4>Total Products</h4>
          <p>{products.length}</p>
        </div>
      </div>

      <section>
        <h3>Recent Orders</h3>
        {allOrders.map((order) => (
          <div key={order.id} className="dashboard-list-item">
            <span>{order.order_number}</span>
            <span>{order.status}</span>
            <span>${parseFloat(order.total_amount).toFixed(2)}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

export default AdminDashboard;