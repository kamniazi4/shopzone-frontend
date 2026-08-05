// Simple loading spinner shown while async requests are in flight
function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader-container">
      <div className="loader-spinner" />
      <p>{text}</p>
    </div>
  );
}

export default Loader;