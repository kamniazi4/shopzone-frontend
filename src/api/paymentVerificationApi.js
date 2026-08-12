// Endpoint calls for the risk-aware payment initiation and OTP verification flow
import axiosClient from './axiosClient';

const paymentVerificationApi = {
  initiatePayment: (orderId, paymentMethod) =>
    axiosClient.post('/payments/initiate', { order_id: orderId, payment_method: paymentMethod }),
  sendOtp: (paymentId, deliveryMethod) =>
    axiosClient.post('/payments/send-otp', { payment_id: paymentId, delivery_method: deliveryMethod }),
  verifyOtp: (paymentId, otpCode) =>
    axiosClient.post('/payments/verify-otp', { payment_id: paymentId, otp_code: otpCode }),
  getPaymentById: (paymentId) => axiosClient.get(`/payments/${paymentId}`),
};

export default paymentVerificationApi;