// Vendor order management page
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchVendorOrders, updateOrderStatus } from '../../features/order/orderSlice';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import Table from '../../components/common/Table';

function VendorOrders() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { allOrders, status } = useAppSelector((state) => state.order);
  const vendorId = user?.vendor_id;

  useEffect(() => {
    if (vendorId) dispatch(fetchVendorOrders({ vendorId, params: { limit: 20 } }));
  }, [dispatch, vendorId]);

  const columns = [
    { key: 'order_number', label: 'Order #' },
    { key: 'total_amount', label: 'Total', render: (row) => `$${parseFloat(row.total_amount).toFixed(2)}` },
    { key: 'status', label: 'Status', render: (row) => <OrderStatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Update Status',
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => dispatch(updateOrderStatus({ id: row.id, status: e.target.value }))}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      ),
    },
  ];

  return (
    <div className="vendor-orders-page">
      <h2>My Orders</h2>
      <Table columns={columns} data={allOrders} emptyMessage="No orders yet" />
    </div>
  );
}

export default VendorOrders;