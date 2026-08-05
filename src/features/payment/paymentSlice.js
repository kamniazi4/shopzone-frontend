// Redux slice for payments
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentApi from '../../api/paymentApi';

const initialState = {
  payments: [],
  currentPayment: null,
  gateways: [],
  status: 'idle',
  error: null,
};

export const fetchPaymentsByOrder = createAsyncThunk('payment/fetchPaymentsByOrder', async (orderId, { rejectWithValue }) => {
  try {
    const { data } = await paymentApi.listPaymentsByOrder(orderId);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const initiatePayment = createAsyncThunk(
  'payment/initiatePayment',
  async ({ orderId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await paymentApi.initiatePayment(orderId, payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const confirmPayment = createAsyncThunk(
  'payment/confirmPayment',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await paymentApi.confirmPayment(id, status);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchGateways = createAsyncThunk('payment/fetchGateways', async (_, { rejectWithValue }) => {
  try {
    const { data } = await paymentApi.listGateways();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentsByOrder.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchPaymentsByOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.payments = action.payload;
      })
      .addCase(fetchPaymentsByOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.currentPayment = action.payload;
        state.payments.push(action.payload);
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.currentPayment = action.payload;
        const idx = state.payments.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.payments[idx] = action.payload;
      })
      .addCase(fetchGateways.fulfilled, (state, action) => {
        state.gateways = action.payload;
      });
  },
});

export default paymentSlice.reducer;