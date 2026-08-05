// Redux slice for product reviews
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewApi from '../../api/reviewApi';

const initialState = {
  reviews: [],
  pagination: null,
  status: 'idle',
  error: null,
};

export const fetchProductReviews = createAsyncThunk(
  'review/fetchProductReviews',
  async ({ productId, params }, { rejectWithValue }) => {
    try {
      const { data } = await reviewApi.listProductReviews(productId, params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const createReview = createAsyncThunk(
  'review/createReview',
  async ({ productId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await reviewApi.createReview(productId, payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteReview = createAsyncThunk('review/deleteReview', async (id, { rejectWithValue }) => {
  try {
    await reviewApi.deleteReview(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductReviews.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r.id !== action.payload);
      });
  },
});

export default reviewSlice.reducer;