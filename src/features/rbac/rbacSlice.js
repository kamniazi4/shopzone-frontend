// Redux slice for roles and permissions (superadmin scope)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

const initialState = {
  roles: [],
  permissions: [],
  status: 'idle',
  error: null,
};

export const fetchRoles = createAsyncThunk('rbac/fetchRoles', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.get('/rbac/roles');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchPermissions = createAsyncThunk('rbac/fetchPermissions', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.get('/rbac/permissions');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createRole = createAsyncThunk('rbac/createRole', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post('/rbac/roles', payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const assignRoleToUser = createAsyncThunk('rbac/assignRoleToUser', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post('/rbac/user-roles', payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const rbacSlice = createSlice({
  name: 'rbac',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissions = action.payload;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      });
  },
});

export default rbacSlice.reducer;