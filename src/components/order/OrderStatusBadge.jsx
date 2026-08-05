// Colored badge representing an order's current status
function OrderStatusBadge({ status }) {
  const statusColors = {
    pending: '#f0ad4e',
    confirmed: '#5bc0de',
    processing: '#5bc0de',
    shipped: '#0275d8',
    delivered: '#5cb85c',
    cancelled: '#d9534f',
  };

  const color = statusColors[status] || '#777';

  return (
    <span className="order-status-badge" style={{ backgroundColor: color }}>
      {status}
    </span>
  );
}

export default OrderStatusBadge;