// Renders the Stripe card input and handles payment confirmation.
// Wrapped by the parent component in <Elements> (see StripePaymentWrapper).
import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from '../common/Button';
import stripeApi from '../../api/stripeApi';

function StripeCardForm({ orderId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        await stripeApi.confirmPayment(paymentIntent.id, orderId);
        onSuccess();
      } catch (err) {
        setError('Payment succeeded but recording it failed. Please contact support.');
      }
    }

    setProcessing(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p style={{ color: '#cc0c39', marginTop: '12px' }}>{error}</p>}
      <Button type="submit" disabled={!stripe || processing} fullWidth>
        {processing ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
}

export default StripeCardForm;