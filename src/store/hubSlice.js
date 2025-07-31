/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../services/axios-config';

// 주문 상태 필터링 조회
export const fetchPreparingOrders = createAsyncThunk(
  'hub/preparing',
  async ({ orderState, isPolling = false }, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/shop-service/shop/filtering-order', {
        params: {
          orderState,
        },
      });
      return { orders: response.data.data, state: orderState, isPolling };
    } catch (err) {
      if (err.response.data.status === 404) return [];

      const message = err.response?.data?.message || '오류';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const hubSlice = createSlice({
  name: 'hub',
  initialState: {
    error: null,
    loading: true,
    pendingLoading: true,
    completeLoading: true,
    pollingOrders: [],
    pendingOrders: [],
    pendingMax: -1,
    completeOrders: [],
    completeMax: -1,
    refreshAll: false,
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPendingMax: (state, action) => {
      state.pendingMax = action.payload;
      state.pendingOrders = [];
    },
    fixPendingMax: (state, action) => {
      state.pendingMax = action.payload;
    },
    setCompleteMax: (state, action) => {
      state.completeMax = action.payload;
      state.completeOrders = [];
    },
    setRefreshAll: (state, action) => {
      state.refreshAll = action.payload;
    },
    setPendingOrder: (state, action) => {
      state.pendingOrders = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPreparingOrders.pending, (state, action) => {
        state.error = null;
      })
      .addCase(fetchPreparingOrders.fulfilled, (state, action) => {
        const { orders, isPolling } = action.payload;
        if (isPolling) {
          state.pollingOrders = orders;
        } else if (action.payload.state === 'PREPARING_INGREDIENTS') {
          state.pendingOrders = orders;
        } else if (action.payload.state === 'READY_FOR_DELIVERY') {
          state.completeOrders = orders;
        }
      })
      .addCase(fetchPreparingOrders.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setError, setPendingMax, setCompleteMax, fixPendingMax, setRefreshAll, setPendingOrder } =
  hubSlice.actions;

export default hubSlice.reducer;
