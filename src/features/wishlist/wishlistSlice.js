// Redux slice for wishlists
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartApi from '../../api/cartApi';

const initialState = {
  wishlists: [],
  currentItems: [],
  status: 'idle',
  error: null,
};

export const fetchMyWishlists = createAsyncThunk('wishlist/fetchMyWishlists', async (_, { rejectWithValue }) => {
  try {
    const { data } = await cartApi.listWishlists();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createWishlist = createAsyncThunk('wishlist/createWishlist', async (name, { rejectWithValue }) => {
  try {
    const { data } = await cartApi.createWishlist(name);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchWishlistItems = createAsyncThunk('wishlist/fetchWishlistItems', async (id, { rejectWithValue }) => {
  try {
    const { data } = await cartApi.getWishlistItems(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addWishlistItem = createAsyncThunk(
  'wishlist/addWishlistItem',
  async ({ id, variant_id }, { dispatch, rejectWithValue }) => {
    try {
      await cartApi.addWishlistItem(id, variant_id);
      dispatch(fetchWishlistItems(id));
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const removeWishlistItem = createAsyncThunk(
  'wishlist/removeWishlistItem',
  async ({ id, itemId }, { rejectWithValue }) => {
    try {
      await cartApi.removeWishlistItem(id, itemId);
      return itemId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyWishlists.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchMyWishlists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wishlists = action.payload;
      })
      .addCase(fetchMyWishlists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createWishlist.fulfilled, (state, action) => {
        state.wishlists.push(action.payload);
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.currentItems = action.payload;
      })
      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        state.currentItems = state.currentItems.filter((i) => i.id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;