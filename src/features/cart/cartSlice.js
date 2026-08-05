// Redux slice for shopping cart
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartApi from '../../api/cartApi';

const initialState = {
  cart: null,
  items: [],
  subtotal: 0,
  status: 'idle',
  error: null,
};

export const fetchMyCart = createAsyncThunk('cart/fetchMyCart', async (_, { rejectWithValue }) => {
  try {
    const { data } = await cartApi.getMyCart();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (payload, { dispatch, rejectWithValue }) => {
  try {
    await cartApi.addItem(payload);
    dispatch(fetchMyCart());
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ itemId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      await cartApi.updateItemQuantity(itemId, quantity);
      dispatch(fetchMyCart());
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (itemId, { dispatch, rejectWithValue }) => {
  try {
    await cartApi.removeItem(itemId);
    dispatch(fetchMyCart());
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    await cartApi.clearCart();
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyCart.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchMyCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload.cart;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
      })
      .addCase(fetchMyCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.subtotal = 0;
      });
  },
});

export default cartSlice.reducer;