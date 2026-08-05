// Displays an error message returned from the API
function ErrorMessage({ message }) {
  if (!message) return null;

  return <div className="error-message">{message}</div>;
}

export default ErrorMessage;