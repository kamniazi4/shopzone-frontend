// Checkout page - collects shipping address, applies coupon, places the order,
// and completes payment through the risk-aware verification flow before Stripe
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMyCart } from '../../features/cart/cartSlice';
import { fetchMyAddresses, addAddress } from '../../features/users/userSlice';
import { validateCoupon, clearAppliedCoupon } from '../../features/promotion/promotionSlice';
import { checkout, clearLastPlacedOrder } from '../../features/order/orderSlice';
import Button from '../../components/common/Button';
import InputField from '../../components/forms/InputField';
import ErrorMessage from '../../components/common/ErrorMessage';
import StripePaymentWrapper from '../../components/product/StripePaymentWrapper';
import PaymentVerification from '../../components/product/PaymentVerification';
import paymentVerificationApi from '../../api/paymentVerificationApi';

function Checkout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, subtotal } = useAppSelector((state) => state.cart);
  const { addresses } = useAppSelector((state) => state.user);
  const { appliedCoupon, discountAmount, error: couponError } = useAppSelector((state) => state.promotion);
  const { status: orderStatus, error: orderError, lastPlacedOrder } = useAppSelector((state) => state.order);

  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [newAddress, setNewAddress] = useState({
    recipient_name: '', recipient_email: '', address_line1: '', city: '', state: '', postal_code: '', country: '', phone: '',
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // Risk-aware payment flow state: idle -> initiating -> verifying (if needed) -> paying
  const [paymentPhase, setPaymentPhase] = useState('idle');
  const [clientSecret, setClientSecret] = useState(null);
  const [contactOptions, setContactOptions] = useState(null);
  const [paymentIdForVerification, setPaymentIdForVerification] = useState(null);
  const [initiateError, setInitiateError] = useState('');

  useEffect(() => {
    dispatch(fetchMyCart());
    dispatch(fetchMyAddresses());
    dispatch(clearAppliedCoupon());
    dispatch(clearLastPlacedOrder());
  }, [dispatch]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  // Once an order is placed, kick off the risk-aware payment initiation flow
  useEffect(() => {
    if (lastPlacedOrder && paymentPhase === 'idle') {
      initiatePaymentFlow(lastPlacedOrder.id);
    }
  }, [lastPlacedOrder]);

  async function initiatePaymentFlow(orderId) {
    setPaymentPhase('initiating');
    setInitiateError('');
    try {
      const { data } = await paymentVerificationApi.initiatePayment(orderId);
      if (data.data.requires_verification) {
        setPaymentIdForVerification(data.data.payment_id);
        setContactOptions(data.data.contact_options);
        setPaymentPhase('verifying');
      } else {
        setClientSecret(data.data.client_secret);
        setPaymentPhase('paying');
      }
    } catch (err) {
      setInitiateError(err.response?.data?.message || 'Unable to start payment. Please try again.');
      setPaymentPhase('idle');
    }
  }

  // Called once OTP verification succeeds - now safe to proceed to card entry
  function handleOtpVerified(newClientSecret) {
    setClientSecret(newClientSecret);
    setPaymentPhase('paying');
  }

  function handlePaymentSuccess() {
    navigate('/orders');
  }

  async function handleAddAddress(e) {
    e.preventDefault();
    const result = await dispatch(addAddress(newAddress));
    if (addAddress.fulfilled.match(result)) {
      setSelectedAddressId(result.payload.id);
      setShowNewAddressForm(false);
      setNewAddress({
        recipient_name: '', recipient_email: '', address_line1: '', city: '', state: '', postal_code: '', country: '', phone: '',
      });
    }
  }

  function handleApplyCoupon() {
    if (couponCode.trim()) {
      dispatch(validateCoupon({ code: couponCode, subtotal }));
    }
  }

  function handlePlaceOrder() {
    if (!selectedAddressId) return;
    dispatch(checkout({
      shipping_address_id: selectedAddressId,
      billing_address_id: selectedAddressId,
      coupon_code: appliedCoupon ? appliedCoupon.code : undefined,
    }));
  }

  const total = subtotal - discountAmount;

  // Once an order has been placed, this section handles risk check -> (optional OTP) -> Stripe payment,
  // instead of showing the cart/summary again.
  if (lastPlacedOrder) {
    return (
      <div className="checkout-page">
        <h2>Complete Your Payment</h2>
        <p>Order <strong>{lastPlacedOrder.order_number}</strong> placed — total ${parseFloat(lastPlacedOrder.total_amount).toFixed(2)}.</p>

        {initiateError && <ErrorMessage message={initiateError} />}

        {paymentPhase === 'initiating' && <p>Checking your payment security...</p>}

        {paymentPhase === 'verifying' && (
          <PaymentVerification
            paymentId={paymentIdForVerification}
            contactOptions={contactOptions}
            onVerified={handleOtpVerified}
          />
        )}

        {paymentPhase === 'paying' && clientSecret && (
          <section className="checkout-summary">
            <StripePaymentWrapper
              clientSecret={clientSecret}
              orderId={lastPlacedOrder.id}
              onSuccess={handlePaymentSuccess}
            />
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <section className="checkout-address">
        <h3>Shipping Address</h3>
        {addresses.map((addr) => (
          <label key={addr.id} className="address-option">
            <input
              type="radio"
              checked={selectedAddressId === addr.id}
              onChange={() => setSelectedAddressId(addr.id)}
            />
            <div>
              <strong>{addr.recipient_name}</strong>
              <p>{addr.address_line1}, {addr.city}, {addr.country}</p>
              {addr.recipient_email && <p style={{ fontSize: '12px', color: '#565959' }}>{addr.recipient_email}</p>}
            </div>
          </label>
        ))}

        <button onClick={() => setShowNewAddressForm(!showNewAddressForm)}>
          {showNewAddressForm ? 'Cancel' : 'Add New Address'}
        </button>

        {showNewAddressForm && (
          <form onSubmit={handleAddAddress} className="new-address-form">
            <InputField label="Recipient Name" name="recipient_name" value={newAddress.recipient_name}
              onChange={(e) => setNewAddress({ ...newAddress, recipient_name: e.target.value })} required />
            <InputField label="Recipient Email" type="email" name="recipient_email" value={newAddress.recipient_email}
              onChange={(e) => setNewAddress({ ...newAddress, recipient_email: e.target.value })} />
            <InputField label="Address Line 1" name="address_line1" value={newAddress.address_line1}
              onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })} required />
            <InputField label="City" name="city" value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required />
            <InputField label="State" name="state" value={newAddress.state}
              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
            <InputField label="Postal Code" name="postal_code" value={newAddress.postal_code}
              onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })} />
            <InputField label="Country" name="country" value={newAddress.country}
              onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} required />
            <InputField label="Phone" name="phone" value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
            <Button type="submit">Save Address</Button>
          </form>
        )}
      </section>

      <section className="checkout-coupon">
        <h3>Coupon</h3>
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <Button onClick={handleApplyCoupon}>Apply</Button>
        <ErrorMessage message={couponError} />
        {appliedCoupon && <p>Coupon applied: -${discountAmount.toFixed(2)}</p>}
      </section>

      <section className="checkout-summary">
        <h3>Order Summary</h3>
        {items.map((item) => (
          <div key={item.id} className="checkout-summary-item">
            <span>{item.product_name} x{item.quantity}</span>
            <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="checkout-summary-total">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          {discountAmount > 0 && <p>Discount: -${discountAmount.toFixed(2)}</p>}
          <h4>Total: ${total.toFixed(2)}</h4>
        </div>

        <ErrorMessage message={orderError} />
        <Button
          onClick={handlePlaceOrder}
          fullWidth
          disabled={!selectedAddressId || orderStatus === 'loading'}
        >
          {orderStatus === 'loading' ? 'Placing Order...' : 'Place Order'}
        </Button>
      </section>
    </div>
  );
}

export default Checkout;