/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../services/axios-config';
import { calculateTotalPrice } from '../pages/user/CartPay/utils/cartPayUtils';

// 사용자의 카트 정보 조회
export const fetchCartItem = createAsyncThunk('cart/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/payment-service/payment/get-cart');
    return response.data.data.items;
  } catch (err) {
    if (err.response.data.status === 404) return [];

    const message = err.response?.data?.data?.message || '오류';
    return thunkAPI.rejectWithValue(message);
  }
});

// 카트 아이템 삭제
export const deleteCartItem = createAsyncThunk('cart/delete', async ({ id }, thunkAPI) => {
  try {
    const response = await axiosInstance.delete(`/payment-service/payment/delete-cart/${id}`);
    return response.data.data;
  } catch (err) {
    const message = err.response?.data?.data?.message || '오류';
    return thunkAPI.rejectWithValue(message);
  }
});

// 카트 아이템 수량 수정
export const editCartItemCount = createAsyncThunk('cart/edit', async ({ id, count }, thunkAPI) => {
  try {
    const response = await axiosInstance.patch('/payment-service/payment/cart-count-edit', {
      params: { id, count },
    });
    return { res: response.data.data, id, count };
  } catch (err) {
    const message = err.response?.data?.data?.message || '오류';
    return thunkAPI.rejectWithValue(message);
  }
});

const paySlice = createSlice({
  name: 'pay',
  initialState: {
    error: null,
    loading: true,
    cartItems: [],
    selectedCartItemIds: [],
    totalPrice: 0,
  },
  reducers: {
    resetError: state => {
      state.error = null;
    },

    // 선택 상품 갱신
    updateSelectedCartItems: (state, action) => {
      state.selectedCartItems = action.payload;
      state.totalPrice = calculateTotalPrice(state.selectedCartItemIds);
    },

    // 카트 상품 선택
    toggleSelect: (state, action) => {
      state.selectedCartItems = prev => [...prev, action.payload];
      state.totalPrice = calculateTotalPrice(state.cartItems, state.selectedCartItemIds);
    },
  },
  extraReducers: builder => {
    // 카트 정보 불러오기
    builder
      .addCase(fetchCartItem.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.cartItems = action.payload;
      })
      .addCase(fetchCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 카트 상품 삭제
    builder
      .addCase(deleteCartItem.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedCartItemIds = state.selectedCartItemIds.filter(i => i !== action.payload);
        state.cartItems = state.cartItems.filter(i => i.id !== action.payload);
        state.totalPrice = calculateTotalPrice(state.cartItems, state.selectedCartItemIds);
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 카트 상품 수량 변경
    builder
      .addCase(editCartItemCount.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCartItemCount.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        // 카트 상품 수량 변경
        const idx = state.cartItems.findIndex(i => i.id === action.payload.id);
        state.cartItems[idx].quantity = action.payload.count;

        state.totalPrice = calculateTotalPrice(state.cartItems, state.selectedCartItemIds);
      })
      .addCase(editCartItemCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = paySlice.actions;

export default paySlice.reducer;
