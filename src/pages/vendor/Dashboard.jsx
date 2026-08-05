// Vendor dashboard - summary of orders, wallet, and products
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchWallet } from '../../features/vendor/vendorSlice';
import { fetchProducts } from '../../features/product/productSlice';
import { fetchVendorOrders } from '../../features/order/orderSlice';

function VendorDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { wallet } = useAppSelector((state) => state.vendor);
  const { list: products } = useAppSelector((state) => state.product);

  // Vendor id is assumed to be stored on the user object after vendor registration.
  // If not present, the vendor should register first via /vendors/register.
  const vendorId = user?.vendor_id;

  useEffect(() => {
    if (vendorId) {
      dispatch(fetchWallet(vendorId));
      dispatch(fetchProducts({ vendor_id: vendorId, limit: 5 }));
    }
  }, [dispatch, vendorId]);

  if (!vendorId) {
    return (
      <div className="vendor-dashboard">
        <p>You have not registered as a vendor yet.</p>
        <Link to="/vendor/register">Register as Vendor</Link>
      </div>
    );
  }

  return (
    <div className="vendor-dashboard">
      <h2>Vendor Dashboard</h2>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h4>Wallet Balance</h4>
          <p>${wallet ? parseFloat(wallet.balance).toFixed(2) : '0.00'}</p>
        </div>
        <div className="dashboard-card">
          <h4>Withdrawable Balance</h4>
          <p>${wallet ? parseFloat(wallet.withdrawable_balance).toFixed(2) : '0.00'}</p>
        </div>
        <div className="dashboard-card">
          <h4>Total Products</h4>
          <p>{products.length}</p>
        </div>
      </div>

      <section>
        <h3>Recent Products</h3>
        {products.map((p) => (
          <div key={p.id} className="dashboard-list-item">
            <span>{p.name}</span>
            <span>{p.status}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

export default VendorDashboard;