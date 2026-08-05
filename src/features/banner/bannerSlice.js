// Redux slice for homepage promo banners
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bannerApi from '../../api/bannerApi';

const initialState = {
  banners: [],
  status: 'idle',
  error: null,
};

export const fetchActiveBanners = createAsyncThunk('banner/fetchActiveBanners', async (_, { rejectWithValue }) => {
  try {
    const { data } = await bannerApi.listActiveBanners();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveBanners.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchActiveBanners.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.banners = action.payload;
      })
      .addCase(fetchActiveBanners.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default bannerSlice.reducer;