/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../services/axios-config';

export const fetchStockList = createAsyncThunk('stock/fetchStock', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/shop-service/stock');
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || '식재료 목록 조회에 실패했습니다.';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchIngredientList = createAsyncThunk(
  'stock/fetchIngredientList',
  async ({ hasKeyword, keyword }, thunkAPI) => {
    try {
      if (hasKeyword) {
        const response = await axiosInstance.get('/cook-service/ingredient/keyword-search', {
          params: {
            keyword,
          },
        });

        return response.data.data;
      }

      const response = await axiosInstance.get('/cook-service/ingredient/all-search');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || '식재료 목록 조회에 실패했습니다.';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const registerStock = createAsyncThunk(
  'stock/registerStock',
  async ({ ingredient, quantity }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/shop-service/stock', {
        ingredientId: ingredient.id,

        quantity,
      });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || '식재료 등록에 실패했습니다.';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateStock = createAsyncThunk(
  'stock/updateStock',
  async ({ ingredient, quantity }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch('/shop-service/stock', {
        ingredientId: ingredient.id,
        quantity,
      });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || '식재료 등록에 실패했습니다.';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    loading: false,
    error: null,
    stockList: [],
    activeIdList: [],
    ingredientList: [],
    minStock: 0,
    maxStock: 0,
    filterQuantity: false,
    filterRetain: false,
    filterKeyword: false,
    keyword: '',
    pageNo: 1,
    numOfRows: 20,
    maxPageNo: 1,
    itemList: [],
  },
  reducers: {
    setFilterQuantity: state => {
      state.filterQuantity = !state.filterQuantity;
    },
    setFilterRetain: state => {
      state.filterRetain = !state.filterRetain;
    },
    setMinStock: (state, action) => {
      const value = Number(action.payload);
      state.minStock = value;
      if (state.maxStock <= value) {
        state.maxStock = value;
      }
    },
    setMaxStock: (state, action) => {
      const value = Number(action.payload);
      state.maxStock = value;
      if (state.minStock >= value) {
        state.minStock = value;
      }
    },
    setKeyword: (state, action) => {
      state.filterKeyword = action.payload !== '';
      state.keyword = action.payload;
    },
    setPageNo: (state, action) => {
      if (action.payload > state.maxPageNo || action.payload < 1) return;
      state.pageNo = action.payload ?? state.pageNo;
    },
    setItemList: (state, action) => {
      // console.log(state.activeIdList);
      state.itemList = action.payload;
      state.pageNo = 1;
      state.maxPageNo = Math.ceil(action.payload.length / state.numOfRows);
    },
    setNumOfRows: (state, action) => {
      state.numOfRows = Number(action.payload);
    },
  },
  extraReducers: builder => {
    // 식재료 정보 불러오기
    builder
      .addCase(fetchIngredientList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredientList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (!action.payload) {
          state.ingredientList = [];
          return;
        }

        state.ingredientList = action.payload.map(ingredient => ({
          id: ingredient.id,
          name: ingredient.ingreName,
          quantity: state.activeIdList.includes(ingredient.id)
            ? state.stockList.find(item => item.ingredientId === ingredient.id).quantity
            : 0,
          active: state.activeIdList.includes(ingredient.id),
        }));
      })
      .addCase(fetchIngredientList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.ingredientList = [];
      });

    // 재고 정보 불러오기
    builder
      .addCase(fetchStockList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.activeIdList = action.payload.map(item => item.ingredientId);
        state.stockList = action.payload || [];
      })
      .addCase(fetchStockList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.stockList = [];
        state.activeIdList = [];
      });

    // 재고 등록
    builder
      .addCase(registerStock.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerStock.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.stockList = [...state.stockList, action.payload];
        state.activeIdList = [...state.activeIdList, action.payload.ingredientId];
      })
      .addCase(registerStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 재고 수정
    builder
      .addCase(updateStock.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.stockList = state.stockList.map(item =>
          item.ingredientId === action.payload.ingredientId ? action.payload : item
        );
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilterQuantity,
  setFilterRetain,
  setMinStock,
  setMaxStock,
  setKeyword,
  setPageNo,
  setItemList,
  setNumOfRows,
} = stockSlice.actions;
export default stockSlice.reducer;
