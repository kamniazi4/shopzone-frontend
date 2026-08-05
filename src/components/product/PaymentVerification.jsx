// Shown ONLY when the backend risk engine determines additional authentication
// is required. Lets the customer choose email or mobile, sends an OTP, and
// verifies it before proceeding to the actual card payment step.
import { useState } from 'react';
import Button from '../common/Button';
import paymentVerificationApi from '../../api/paymentVerificationApi';

function PaymentVerification({ paymentId, contactOptions, onVerified }) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  async function handleSendOtp(method) {
    setError('');
    setSending(true);
    setSelectedMethod(method);

    try {
      await paymentVerificationApi.sendOtp(paymentId, method);
      setOtpSent(true);
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code.');
    } finally {
      setSending(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError('');
    setVerifying(true);

    try {
      const { data } = await paymentVerificationApi.verifyOtp(paymentId, otpCode);
      onVerified(data.data.client_secret);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setVerifying(false);
    }
  }

  if (!otpSent) {
    return (
      <div className="payment-verification-box">
        <h3>Verify Your Payment</h3>
        <p>Choose how you want to receive your verification code:</p>

        {error && <p style={{ color: '#cc0c39', marginBottom: '10px' }}>{error}</p>}

        <div className="verification-method-options">
          {contactOptions?.mobile && (
            <button
              className="verification-method-btn"
              onClick={() => handleSendOtp('mobile')}
              disabled={sending}
            >
              📱 Registered Mobile<br /><span>{contactOptions.mobile}</span>
            </button>
          )}
          {contactOptions?.email && (
            <button
              className="verification-method-btn"
              onClick={() => handleSendOtp('email')}
              disabled={sending}
            >
              📧 Registered Email<br /><span>{contactOptions.email}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="payment-verification-box">
      <h3>Enter Verification Code</h3>
      <p>We sent a 6-digit code to your {selectedMethod === 'email' ? 'email' : 'mobile number'}.</p>

      <form onSubmit={handleVerify}>
        {error && <p style={{ color: '#cc0c39', marginBottom: '10px' }}>{error}</p>}

        <input
          type="text"
          maxLength={6}
          placeholder="6-digit code"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          className="verification-otp-input"
          required
        />

        <Button type="submit" fullWidth disabled={verifying}>
          {verifying ? 'Verifying...' : 'Verify Code'}
        </Button>

        <button
          type="button"
          onClick={() => handleSendOtp(selectedMethod)}
          disabled={cooldown > 0 || sending}
          className="verification-resend-btn"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
        </button>
      </form>
    </div>
  );
}

export default PaymentVerification;