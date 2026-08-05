// Redux slice for coupons and promotions
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import promotionApi from '../../api/promotionApi';

const initialState = {
  coupons: [],
  promotions: [],
  appliedCoupon: null,
  discountAmount: 0,
  status: 'idle',
  error: null,
};

export const validateCoupon = createAsyncThunk(
  'promotion/validateCoupon',
  async ({ code, subtotal }, { rejectWithValue }) => {
    try {
      const { data } = await promotionApi.validateCoupon(code, subtotal);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchCoupons = createAsyncThunk('promotion/fetchCoupons', async (params, { rejectWithValue }) => {
  try {
    const { data } = await promotionApi.listCoupons(params);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createCoupon = createAsyncThunk('promotion/createCoupon', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await promotionApi.createCoupon(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchPromotions = createAsyncThunk('promotion/fetchPromotions', async (params, { rejectWithValue }) => {
  try {
    const { data } = await promotionApi.listPromotions(params);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const promotionSlice = createSlice({
  name: 'promotion',
  initialState,
  reducers: {
    clearAppliedCoupon: (state) => {
      state.appliedCoupon = null;
      state.discountAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateCoupon.pending, (state) => { state.status = 'loading'; })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appliedCoupon = action.payload.coupon;
        state.discountAmount = action.payload.discount_amount;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.appliedCoupon = null;
        state.discountAmount = 0;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.coupons = action.payload.data;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.coupons.push(action.payload);
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.promotions = action.payload.data;
      });
  },
});

export const { clearAppliedCoupon } = promotionSlice.actions;
export default promotionSlice.reducer;