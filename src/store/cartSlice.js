/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../services/axios-config';
import { calculateItemTotal } from '../common/utils/cartUtils';

export const fetchCartItem = createAsyncThunk('user/cart', async (_, thunkAPI) => {
  try {
    console.info('카트 정보 조회 시작');
    const response = await axiosInstance.get('/payment-service/payment/get-cart');
    if (response.data.success) {
      console.info('카트 정보 조회 성공', response.data.data.items);
      return response.data.data.items;
    }
    return [];
  } catch (err) {
    if (err.response.data.status === 404) {
      return [];
    }
    const message = err.response?.data?.data?.message || '회원의 카트 정보 조회에 실패하였습니다.';
    console.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

// 카트 아이템 수량 수정
export const editCartItemCount = createAsyncThunk(
  'payment/edit-cart-item-count',
  async ({ id, count }, thunkAPI) => {
    try {
      console.info('카트 정보 수정 시작');
      const response = await axiosInstance.patch(
        '/payment-service/payment/cart-count-edit',
        {},
        {
          params: {
            id,
            count,
          },
        }
      );
      console.info('카트 정보 수정 성공', response.data.data.message);
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.data?.message || '회원의 카트 정보 수정에 실패하였습니다.';
      console.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 카트 아이템 삭제
export const deleteCartItem = createAsyncThunk('payment/delete-cart-item', async (id, thunkAPI) => {
  try {
    console.info('카트 정보 삭제 시작');
    const response = await axiosInstance.delete(`/payment-service/payment/delete-cart/${id}`);
    console.info('카트 정보 삭제 성공', response.data.data.message);
    return response.data.data;
  } catch (err) {
    const message = err.response?.data?.data?.message || '회원의 카트 정보 삭제에 실패하였습니다.';
    console.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    selectedItems: [],
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {
    toggleSelectItem: (state, action) => {
      const id = action.payload;
      if (state.selectedItems.includes(id)) {
        state.selectedItems = state.selectedItems.filter(i => i !== id);
      } else {
        state.selectedItems.push(id);
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(i => i.id === action.payload);
      if (item) item.quantity += 1;
      cartSlice.caseReducers.calculateTotal(state);
    },
    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(i => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
      cartSlice.caseReducers.calculateTotal(state);
    },
    deleteItem: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter(i => i.id !== id);
      state.selectedItems = state.selectedItems.filter(i => i !== id);
    },
    calculateTotal: state => {
      state.totalPrice = state.selectedItems.reduce((sum, id) => {
        const item = state.cartItems.find(i => i.id === id);
        return sum + (item ? calculateItemTotal(item) : 0);
      }, 0);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCartItem.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
        state.selectedItems = action.payload.map(item => item.id);
        state.totalPrice = 0;
      })
      .addCase(fetchCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleSelectItem, increaseQuantity, decreaseQuantity, deleteItem, calculateTotal } =
  cartSlice.actions;

export default cartSlice.reducer;
