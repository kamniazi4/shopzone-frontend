// Redux slice for vendors, vendor wallet, vendor shipping settings
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import vendorApi from '../../api/vendorApi';

const initialState = {
  list: [],
  currentVendor: null,
  wallet: null,
  transactions: [],
  shippingSettings: [],
  pagination: null,
  status: 'idle',
  error: null,
};

export const fetchVendors = createAsyncThunk('vendor/fetchVendors', async (params, { rejectWithValue }) => {
  try {
    const { data } = await vendorApi.listVendors(params);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchVendorById = createAsyncThunk('vendor/fetchVendorById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await vendorApi.getVendorById(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const registerVendor = createAsyncThunk('vendor/registerVendor', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await vendorApi.registerVendor(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateVendorStatus = createAsyncThunk('vendor/updateVendorStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await vendorApi.updateVendorStatus(id, status);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchWallet = createAsyncThunk('vendor/fetchWallet', async (id, { rejectWithValue }) => {
  try {
    const { data } = await vendorApi.getWallet(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchTransactions = createAsyncThunk('vendor/fetchTransactions', async ({ id, params }, { rejectWithValue }) => {
  try {
    const { data } = await vendorApi.listTransactions(id, params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.currentVendor = action.payload;
      })
      .addCase(registerVendor.fulfilled, (state, action) => {
        state.currentVendor = action.payload;
      })
      .addCase(updateVendorStatus.fulfilled, (state, action) => {
        const idx = state.list.findIndex((v) => v.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.wallet = action.payload;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
      });
  },
});

export default vendorSlice.reducer;