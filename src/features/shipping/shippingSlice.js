// Redux slice for shipments and shipping providers
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shippingApi from '../../api/shippingApi';

const initialState = {
  providers: [],
  shipments: [],
  currentShipment: null,
  status: 'idle',
  error: null,
};

export const fetchProviders = createAsyncThunk('shipping/fetchProviders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await shippingApi.listProviders();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchShipmentsByOrder = createAsyncThunk('shipping/fetchShipmentsByOrder', async (orderId, { rejectWithValue }) => {
  try {
    const { data } = await shippingApi.listShipmentsByOrder(orderId);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchShipmentById = createAsyncThunk('shipping/fetchShipmentById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await shippingApi.getShipmentById(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createShipment = createAsyncThunk(
  'shipping/createShipment',
  async ({ orderId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await shippingApi.createShipment(orderId, payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateShipmentStatus = createAsyncThunk(
  'shipping/updateShipmentStatus',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await shippingApi.updateShipmentStatus(id, payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const shippingSlice = createSlice({
  name: 'shipping',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.providers = action.payload;
      })
      .addCase(fetchShipmentsByOrder.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchShipmentsByOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shipments = action.payload;
      })
      .addCase(fetchShipmentsByOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchShipmentById.fulfilled, (state, action) => {
        state.currentShipment = action.payload;
      })
      .addCase(createShipment.fulfilled, (state, action) => {
        state.shipments.push(action.payload);
      })
      .addCase(updateShipmentStatus.fulfilled, (state, action) => {
        if (state.currentShipment?.id === action.payload.id) {
          state.currentShipment = { ...state.currentShipment, ...action.payload };
        }
      });
  },
});

export default shippingSlice.reducer;