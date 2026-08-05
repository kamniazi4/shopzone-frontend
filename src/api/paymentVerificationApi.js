// Endpoint calls for the risk-aware payment initiation and OTP verification flow
import axiosClient from './axiosClient';

const paymentVerificationApi = {
  initiatePayment: (orderId) => axiosClient.post('/payments/initiate', { order_id: orderId }),
  sendOtp: (paymentId, deliveryMethod) =>
    axiosClient.post('/payments/send-otp', { payment_id: paymentId, delivery_method: deliveryMethod }),
  verifyOtp: (paymentId, otpCode) =>
    axiosClient.post('/payments/verify-otp', { payment_id: paymentId, otp_code: otpCode }),
};

export default paymentVerificationApi;