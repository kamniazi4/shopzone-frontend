// Landing page after returning from JazzCash/EasyPaisa's hosted checkout.
// The backend callback already finalized the payment server-side; this page
// just polls /payments/:id to show the final confirmed status to the user
// (never trusts the query string alone, since that's client-controlled).
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import paymentVerificationApi from '../../api/paymentVerificationApi';
import Button from '../../components/common/Button';

function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentId = searchParams.get('payment_id');

  const [status, setStatus] = useState('checking'); // checking | completed | failed | pending
  const [error, setError] = useState('');

  useEffect(() => {
    if (!paymentId) {
      setStatus('failed');
      setError('Missing payment reference.');
      return;
    }

    let attempts = 0;
    const maxAttempts = 5;

    async function pollStatus() {
      try {
        const { data } = await paymentVerificationApi.getPaymentById(paymentId);
        const paymentStatus = data.data.status;

        if (paymentStatus === 'completed') {
          setStatus('completed');
          return;
        }
        if (paymentStatus === 'failed') {
          setStatus('failed');
          return;
        }

        // Still pending - callback may not have landed yet, retry briefly
        attempts += 1;
        if (attempts < maxAttempts) {
          setTimeout(pollStatus, 1500);
        } else {
          setStatus('pending');
        }
      } catch (err) {
        setStatus('failed');
        setError(err.response?.data?.message || 'Unable to confirm payment status.');
      }
    }

    pollStatus();
  }, [paymentId]);

  return (
    <div className="payment-return-page">
      {status === 'checking' && <p>Confirming your payment...</p>}

      {status === 'completed' && (
        <>
          <h2>Payment Successful</h2>
          <p>Your order has been confirmed.</p>
          <Button onClick={() => navigate('/orders')}>View My Orders</Button>
        </>
      )}

      {status === 'pending' && (
        <>
          <h2>Payment Still Processing</h2>
          <p>We're waiting for confirmation from the gateway. Check your orders shortly.</p>
          <Button onClick={() => navigate('/orders')}>View My Orders</Button>
        </>
      )}

      {status === 'failed' && (
        <>
          <h2>Payment Failed</h2>
          <p>{error || 'Your payment could not be completed. Please try again.'}</p>
          <Button onClick={() => navigate('/checkout')}>Try Again</Button>
        </>
      )}
    </div>
  );
}

export default PaymentReturn;