// Customer's order history page
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMyOrders } from '../../features/order/orderSlice';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import { useState } from 'react';

function OrderHistory() {
  const dispatch = useAppDispatch();
  const { myOrders, pagination, status } = useAppSelector((state) => state.order);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchMyOrders({ page, limit: 10 }));
  }, [dispatch, page]);

  if (status === 'loading') return <Loader text="Loading orders..." />;

  return (
    <div className="order-history-page">
      <h2>My Orders</h2>

      {myOrders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="order-list">
          {myOrders.map((order) => (
            <div key={order.id} className="order-list-item">
              <div>
                <strong>{order.order_number}</strong>
                <p>{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <OrderStatusBadge status={order.status} />
              <p>${parseFloat(order.total_amount).toFixed(2)}</p>
              <Link to={`/orders/${order.id}/tracking`}>Track Order</Link>
            </div>
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
}

export default OrderHistory;