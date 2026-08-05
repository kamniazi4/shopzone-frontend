// Displays order_status_history as a vertical timeline
function OrderTimeline({ history }) {
  if (!history || history.length === 0) {
    return <p>No status history available.</p>;
  }

  return (
    <div className="order-timeline">
      {history.map((entry) => (
        <div key={entry.id} className="timeline-entry">
          <div className="timeline-dot" />
          <div className="timeline-content">
            <strong>{entry.status}</strong>
            <span>{new Date(entry.created_at).toLocaleString()}</span>
            {entry.notes && <p>{entry.notes}</p>}
            {entry.changed_by_name && <small>by {entry.changed_by_name}</small>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderTimeline;