// Renders the Stripe Elements provider using an already-obtained client_secret
// (from the risk-aware initiate/verify flow) - it does NOT create its own
// PaymentIntent, to avoid duplicate charges.
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCardForm from './StripeCardForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function StripePaymentWrapper({ clientSecret, orderId, onSuccess }) {
  if (!clientSecret) return null;

  const options = { clientSecret };

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripeCardForm orderId={orderId} onSuccess={onSuccess} />
    </Elements>
  );
}

export default StripePaymentWrapper;