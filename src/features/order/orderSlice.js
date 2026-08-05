// Redux slice for orders and checkout
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderApi from '../../api/orderApi';

const initialState = {
  myOrders: [],
  allOrders: [],
  currentOrder: null,
  pagination: null,
  lastPlacedOrder: null,
  status: 'idle',
  error: null,
};

export const checkout = createAsyncThunk('order/checkout', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await orderApi.checkout(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchMyOrders = createAsyncThunk('order/fetchMyOrders', async (params, { rejectWithValue }) => {
  try {
    const { data } = await orderApi.listMyOrders(params);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchAllOrders = createAsyncThunk('order/fetchAllOrders', async (params, { rejectWithValue }) => {
  try {
    const { data } = await orderApi.listAllOrders(params);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchVendorOrders = createAsyncThunk(
  'order/fetchVendorOrders',
  async ({ vendorId, params }, { rejectWithValue }) => {
    try {
      const { data } = await orderApi.listVendorOrders(vendorId, params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchOrderById = createAsyncThunk('order/fetchOrderById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await orderApi.getOrderById(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ id, status, notes }, { rejectWithValue }) => {
    try {
      const { data } = await orderApi.updateOrderStatus(id, status, notes);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearLastPlacedOrder: (state) => {
      state.lastPlacedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkout.pending, (state) => { state.status = 'loading'; })
      .addCase(checkout.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastPlacedOrder = action.payload;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrders = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchVendorOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = { ...state.currentOrder, ...action.payload };
        }
      });
  },
});

export const { clearLastPlacedOrder } = orderSlice.actions;
export default orderSlice.reducer;