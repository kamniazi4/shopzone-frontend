// Order detail and tracking page
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchOrderById } from '../../features/order/orderSlice';
import { fetchShipmentsByOrder } from '../../features/shipping/shippingSlice';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import Loader from '../../components/common/Loader';

function OrderTracking() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { currentOrder, status } = useAppSelector((state) => state.order);
  const { shipments } = useAppSelector((state) => state.shipping);

  useEffect(() => {
    dispatch(fetchOrderById(id));
    dispatch(fetchShipmentsByOrder(id));
  }, [dispatch, id]);

  if (status === 'loading' || !currentOrder) return <Loader text="Loading order..." />;

  return (
    <div className="order-tracking-page">
      <h2>Order {currentOrder.order_number}</h2>
      <OrderStatusBadge status={currentOrder.status} />

      <section>
        <h3>Items</h3>
        {currentOrder.items?.map((item) => (
          <div key={item.id} className="order-tracking-item">
            <span>{item.name} x{item.quantity}</span>
            <span>${parseFloat(item.total_price).toFixed(2)}</span>
          </div>
        ))}
      </section>

      <section>
        <h3>Total: ${parseFloat(currentOrder.total_amount).toFixed(2)}</h3>
      </section>

      <section>
        <h3>Shipments</h3>
        {shipments.length === 0 ? (
          <p>No shipment created yet.</p>
        ) : (
          shipments.map((shipment) => (
            <div key={shipment.id} className="shipment-info">
              <p>Tracking Number: {shipment.tracking_number || 'N/A'}</p>
              <p>Status: {shipment.status}</p>
              {shipment.estimated_delivery && (
                <p>Estimated Delivery: {new Date(shipment.estimated_delivery).toLocaleDateString()}</p>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default OrderTracking;