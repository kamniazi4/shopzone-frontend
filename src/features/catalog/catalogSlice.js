// Redux slice for categories and attributes
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productApi from '../../api/productApi';

const initialState = {
  categories: [],
  attributes: [],
  status: 'idle',
  error: null,
};

export const fetchCategories = createAsyncThunk('catalog/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const { data } = await productApi.listCategories();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createCategory = createAsyncThunk('catalog/createCategory', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await productApi.createCategory(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteCategory = createAsyncThunk('catalog/deleteCategory', async (id, { rejectWithValue }) => {
  try {
    await productApi.deleteCategory(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchAttributes = createAsyncThunk('catalog/fetchAttributes', async (_, { rejectWithValue }) => {
  try {
    const { data } = await productApi.listAttributes();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createAttribute = createAsyncThunk('catalog/createAttribute', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await productApi.createAttribute(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c.id !== action.payload);
      })
      .addCase(fetchAttributes.fulfilled, (state, action) => {
        state.attributes = action.payload;
      })
      .addCase(createAttribute.fulfilled, (state, action) => {
        state.attributes.push(action.payload);
      });
  },
});

export default catalogSlice.reducer;