// Redux slice for users and addresses
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../api/userApi';

const initialState = {
  list: [],
  currentUser: null,
  addresses: [],
  status: 'idle',
  error: null,
};

export const fetchUsers = createAsyncThunk('user/fetchUsers', async (params, { rejectWithValue }) => {
  try {
    const { data } = await userApi.listUsers(params);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchMyAddresses = createAsyncThunk('user/fetchMyAddresses', async (_, { rejectWithValue }) => {
  try {
    const { data } = await userApi.listMyAddresses();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addAddress = createAsyncThunk('user/addAddress', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await userApi.addAddress(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteAddress = createAsyncThunk('user/deleteAddress', async (id, { rejectWithValue }) => {
  try {
    await userApi.deleteAddress(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.data;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMyAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((a) => a.id !== action.payload);
      });
  },
});

export default userSlice.reducer;