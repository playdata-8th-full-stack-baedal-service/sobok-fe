// store/productSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../services/axios-config';
import { API_BASE_URL } from '../services/host-config';

/** 상품 정보 조회 */
export const fetchProduct = createAsyncThunk('product/get-product', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cook-service/cook/get-cook/${id}`);
    if (response.data.success) return response.data.data;
    return null;
  } catch (err) {
    const message = err.response?.data?.message || '상품 정보 조회에 실패하였습니다.';
    return thunkAPI.rejectWithValue(message);
  }
});

/** 추가 재료 검색 */
export const fetchAdditionalIngredients = createAsyncThunk(
  'product/get-additional-ingredients',
  async (searchQuery, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cook-service/ingredient/keyword-search`, {
        params: { keyword: searchQuery },
      });
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || '추가 식재료 조회에 실패하였습니다.';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/** 장바구니 등록 */
export const registerCart = createAsyncThunk('product/register-cart', async (cart, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`/payment-service/payment/add-cart`, cart);
    return response.data.data;
  } catch (err) {
    const message = err.response?.data?.message || '장바구니 등록에 실패하였습니다.';
    return thunkAPI.rejectWithValue(message);
  }
});

/** 북마크 조회 */
export const isBookmarked = createAsyncThunk('product/is-bookmarked', async (id, thunkAPI) => {
  try {
    if (localStorage.getItem('ACCESS_TOKEN') === null) return thunkAPI.rejectWithValue('error');
    const response = await axiosInstance.get(`/user-service/user/getBookmark/${id}`);
    return response.data.data;
  } catch (err) {
    const message = err.response?.message || '즐겨찾기 조회에 실패하였습니다.';
    return thunkAPI.rejectWithValue(message);
  }
});

/** 북마크 추가 */
export const addBookmark = createAsyncThunk('product/add-bookmark', async (id, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`/user-service/user/addBookmark`, { cookId: id });
    return response.data.data;
  } catch (err) {
    const message = err.response?.message || '즐겨찾기 추가에 실패하였습니다.';
    return thunkAPI.rejectWithValue(message);
  }
});

/** 북마크 삭제 */
export const deleteBookmark = createAsyncThunk('product/delete-bookmark', async (id, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`/user-service/user/deleteBookmark`, { cookId: id });
    return response.data.data;
  } catch (err) {
    const message = err.response?.message || '즐겨찾기 삭제에 실패하였습니다.';
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  product: null,
  portion: 1,
  additionalIngredients: [], // 선택된 추가 재료(사용자 선택 목록)
  originalPrice: 0,
  totalPrice: 0,
  searchQuery: [], // 검색 결과 목록
  loading: false,
  error: null,
  isBookmarked: false,
  bookmarkError: null,
  cartCookId: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
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

    /** ▼ 추가: 세션/계정 전환 시 잔류 방지용 초기화들 */
    clearAdditionalIngredients: state => {
      state.additionalIngredients = [];
    },
    resetAdditionalSearch: state => {
      state.searchQuery = [];
    },

    /** (옵션) 여러 개 한 번에 정리하고 싶을 때 */
    logoutCleanup: state => {
      state.additionalIngredients = [];
      state.searchQuery = [];
      state.originalPrice = 0;
      state.totalPrice = 0;
      state.cartCookId = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProduct.pending, state => {
        state.loading = true;
        state.error = null;
        state.additionalIngredients = [];
        state.searchQuery = [];
      })
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
        state.searchQuery = action.payload || [];
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
  setIsBookmarked,
  clearAdditionalIngredients,
  resetAdditionalSearch,
  logoutCleanup,
} = productSlice.actions;

export default productSlice.reducer;
