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

    const message = err.response?.data?.message || '오류';
    return thunkAPI.rejectWithValue(message);
  }
});

// 카트 아이템 수량 수정
export const editCartItemCount = createAsyncThunk('cart/edit', async ({ id, count }, thunkAPI) => {
  try {
    const response = await axiosInstance.patch(`/payment-service/cart/${id}`, null, {
      params: { count },
    });
    return { res: response.data.data, id, count };
  } catch (err) {
    console.log(err);
    const message = err.response?.data?.message || '오류';
    return thunkAPI.rejectWithValue(message);
  }
});

// 카트 아이템 삭제
export const deleteCartItem = createAsyncThunk('cart/delete', async ({ id }, thunkAPI) => {
  try {
    const response = await axiosInstance.delete(`/payment-service/cart/${id}`);
    return response.data.data;
  } catch (err) {
    const message = err.response?.data?.message || '오류';
    return thunkAPI.rejectWithValue(message);
  }
});

// 선택 카트 아이템 삭제
export const deleteAllCartItem = createAsyncThunk(
  'cart/all-delete',
  async ({ selectedIds }, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/payment-service/cart/all`, {
        data: {
          cartCookIdList: selectedIds,
        },
      });
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || '오류';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 사용자 정보 가져오기
export const fetchOrdererInfo = createAsyncThunk('pay/orderer-info', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/user-service/user/order-info`);
    console.log(response.data.data);
    return response.data.data;
  } catch (err) {
    const message = err.response?.data?.message || '오류';
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
    orderer: null,
    selectedAddressId: 0,
    riderRequest: '',
    isPayVisible: false,
  },
  reducers: {
    resetError: state => {
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },

    // 선택 상품 갱신
    updateSelectedCartItems: (state, action) => {
      state.selectedCartItemIds = action.payload;
      state.totalPrice = calculateTotalPrice(state.cartItems, state.selectedCartItemIds);
    },

    // 카트 상품 선택
    toggleSelect: (state, action) => {
      if (state.selectedCartItemIds.includes(action.payload)) {
        state.selectedCartItemIds = state.selectedCartItemIds.filter(i => i !== action.payload);
      } else {
        state.selectedCartItemIds = [...state.selectedCartItemIds, action.payload];
      }

      state.totalPrice = calculateTotalPrice(state.cartItems, state.selectedCartItemIds);
    },

    // 라이더 요청사항 갱신
    setRiderRequest: (state, action) => {
      state.riderRequest = action.payload;
    },

    flipPayVisible: state => {
      state.isPayVisible = !state.isPayVisible;
    },

    setSelectedAddressId: (state, action) => {
      console.log(action.payload);
      state.selectedAddressId = action.payload;
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

        const key = sessionStorage.getItem('INSTANT_PAY');
        if (key) {
          state.selectedCartItemIds = [+key];
        }
        sessionStorage.removeItem('INSTANT_PAY');

        state.cartItems = action.payload.reverse();
        state.totalPrice = calculateTotalPrice(state.cartItems, state.selectedCartItemIds);
      })
      .addCase(fetchCartItem.rejected, (state, action) => {
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

    // 선택 카트 상품 삭제
    builder
      .addCase(deleteAllCartItem.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAllCartItem.fulfilled, state => {
        state.loading = false;
        state.error = null;
        state.cartItems = state.cartItems.filter(i => !state.selectedCartItemIds.includes(i.id));
        state.selectedCartItemIds = [];
        state.totalPrice = 0;
      })
      .addCase(deleteAllCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 카트 상품 삭제
    builder
      .addCase(fetchOrdererInfo.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdererInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orderer = action.payload;
      })
      .addCase(fetchOrdererInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetError,
  toggleSelect,
  updateSelectedCartItems,
  setRiderRequest,
  setError,
  flipPayVisible,
  setSelectedAddressId,
} = paySlice.actions;

export default paySlice.reducer;
