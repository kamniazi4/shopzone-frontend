// Auto-submits a hidden form to redirect the customer to JazzCash/EasyPaisa's
// hosted checkout page. Used for any gateway that returns { actionUrl, fields }
// instead of a Stripe-style client_secret.
import { useEffect, useRef } from 'react';

function RedirectGatewayForm({ actionUrl, fields, gatewayLabel }) {
  const formRef = useRef(null);

  useEffect(() => {
    // Auto-submit shortly after mount, giving the user a brief moment to see the message
    const timer = setTimeout(() => {
      formRef.current?.submit();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="redirect-gateway">
      <p>Redirecting you to {gatewayLabel} to complete your payment...</p>
      <form ref={formRef} action={actionUrl} method="POST">
        {Object.entries(fields || {}).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
      </form>
    </div>
  );
}

export default RedirectGatewayForm;