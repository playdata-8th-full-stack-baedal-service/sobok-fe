/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../services/axios-config';
import { API_BASE_URL } from '../services/host-config';

// 상품 정보 조회
export const fetchProduct = createAsyncThunk('product/get-product', async (id, thunkAPI) => {
  try {
    console.info('상품 정보 조회 시작');
    const response = await axios.get(`${API_BASE_URL}/cook-service/cook/get-cook/${id}`);
    if (response.data.success) {
      console.info('상품 정보 조회 성공', response.data.data.cookId);
      return response.data.data;
    }
    return null;
  } catch (err) {
    const message = err.response?.data?.message || '상품 정보 조회에 실패하였습니다.';
    console.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchAdditionalIngredients = createAsyncThunk(
  'product/get-additional-ingredients',
  async (searchQuery, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cook-service/ingredient/keyword-search`, {
        params: {
          keyword: searchQuery,
        },
      });
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || '추가 식재료 조회에 실패하였습니다.';
      console.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const registerCart = createAsyncThunk('product/register-cart', async (cart, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`/payment-service/payment/add-cart`, cart);
    console.log(response.data.data);
    return response.data.data;
  } catch (err) {
    const message = err.response?.data?.message || '장바구니 등록에 실패하였습니다.';
    console.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const isBookmarked = createAsyncThunk('product/is-bookmarked', async (id, thunkAPI) => {
  try {
    if (localStorage.getItem('ACCESS_TOKEN') === null) return thunkAPI.rejectWithValue('error');
    const response = await axiosInstance.get(`/user-service/user/getBookmark/${id}`);
    console.log(response.data.data);
    return response.data.data;
  } catch (err) {
    const message = err.response?.message || '즐겨찾기 조회에 실패하였습니다.';
    console.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const addBookmark = createAsyncThunk('product/add-bookmark', async (id, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`/user-service/user/addBookmark`, {
      cookId: id,
    });
    return response.data.data;
  } catch (err) {
    const message = err.response?.message || '즐겨찾기 추가에 실패하였습니다.';
    console.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteBookmark = createAsyncThunk('product/delete-bookmark', async (id, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`/user-service/user/deleteBookmark`, { cookId: id });
    return response.data.data;
  } catch (err) {
    const message = err.response?.message || '즐겨찾기 삭제에 실패하였습니다.';
    console.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

const productSlice = createSlice({
  name: 'product',
  initialState: {
    product: null,
    portion: 1,
    additionalIngredients: [],
    originalPrice: 0,
    totalPrice: 0,
    searchQuery: [],
    loading: false,
    error: null,
    isBookmarked: false,
    bookmarkError: null,
  },
  reducers: {
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    setPortion: (state, action) => {
      state.portion = action.payload < 1 ? 1 : action.payload;
    },
    setAdditionalIngredients: (state, action) => {
      state.additionalIngredients = action.payload;
    },
    setOriginalPrice: (state, action) => {
      state.originalPrice = action.payload;
    },
    setTotalPrice: (state, action) => {
      state.totalPrice = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setIsBookmarked: (state, action) => {
      state.isBookmarked = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdditionalIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.searchQuery = action.payload;
      })
      .addCase(fetchAdditionalIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(isBookmarked.fulfilled, (state, action) => {
        state.loading = false;
        state.isBookmarked = action.payload;
        state.bookmarkError = null;
      })
      .addCase(isBookmarked.rejected, (state, action) => {
        state.loading = false;
        state.bookmarkError = action.payload;
      })
      .addCase(addBookmark.fulfilled, state => {
        state.loading = false;
        state.isBookmarked = true;
      })
      .addCase(deleteBookmark.fulfilled, state => {
        state.loading = false;
        state.isBookmarked = false;
      })
      .addCase(registerCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartCookId = action.payload;
      });
  },
});

export const {
  setProduct,
  setPortion,
  setLoading,
  setError,
  setTotalPrice,
  setOriginalPrice,
  setAdditionalIngredients,
  setSearchQuery,
} = productSlice.actions;

export default productSlice.reducer;
