// store/postSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../services/host-config';

// 좋아요순 게시글 3개 가져오기
export const fetchCookPostsByLike = createAsyncThunk(
  'post/fetchCookPostsByLike',
  async (cookId, thunkAPI) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/post-service/post/cook-posts/${cookId}?sortBy=LIKE`
      );
      return res.data.posts.slice(0, 3);
    } catch (err) {
      const message = err.response?.data?.message || '레시피 게시글 불러오기 실패';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState: {
    bestPosts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCookPostsByLike.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCookPostsByLike.fulfilled, (state, action) => {
        state.loading = false;
        state.bestPosts = action.payload;
      })
      .addCase(fetchCookPostsByLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
