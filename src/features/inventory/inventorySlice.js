// Redux slice for warehouses and inventory
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inventoryApi from '../../api/inventoryApi';

const initialState = {
  warehouses: [],
  inventoryList: [],
  triggeredAlerts: [],
  status: 'idle',
  error: null,
};

export const fetchWarehouses = createAsyncThunk('inventory/fetchWarehouses', async (params, { rejectWithValue }) => {
  try {
    const { data } = await inventoryApi.listWarehouses(params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createWarehouse = createAsyncThunk('inventory/createWarehouse', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await inventoryApi.createWarehouse(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchInventory = createAsyncThunk('inventory/fetchInventory', async (params, { rejectWithValue }) => {
  try {
    const { data } = await inventoryApi.listInventory(params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const upsertInventory = createAsyncThunk('inventory/upsertInventory', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await inventoryApi.upsertInventory(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const adjustInventory = createAsyncThunk('inventory/adjustInventory', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await inventoryApi.adjustInventory(id, payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchTriggeredAlerts = createAsyncThunk('inventory/fetchTriggeredAlerts', async (_, { rejectWithValue }) => {
  try {
    const { data } = await inventoryApi.listTriggeredAlerts();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouses.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.warehouses = action.payload;
      })
      .addCase(fetchWarehouses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createWarehouse.fulfilled, (state, action) => {
        state.warehouses.push(action.payload);
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.inventoryList = action.payload;
      })
      .addCase(upsertInventory.fulfilled, (state, action) => {
        const idx = state.inventoryList.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.inventoryList[idx] = action.payload;
        else state.inventoryList.push(action.payload);
      })
      .addCase(adjustInventory.fulfilled, (state, action) => {
        const idx = state.inventoryList.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.inventoryList[idx] = action.payload;
      })
      .addCase(fetchTriggeredAlerts.fulfilled, (state, action) => {
        state.triggeredAlerts = action.payload;
      });
  },
});

export default inventorySlice.reducer;