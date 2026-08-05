// Endpoint calls for Stripe payment intent creation and confirmation
import axiosClient from './axiosClient';

const stripeApi = {
  createPaymentIntent: (amount, currency, orderId) =>
    axiosClient.post('/stripe/create-payment-intent', { amount, currency, order_id: orderId }),
  confirmPayment: (paymentIntentId, orderId) =>
    axiosClient.post('/stripe/confirm-payment', { payment_intent_id: paymentIntentId, order_id: orderId }),
};

export default stripeApi;