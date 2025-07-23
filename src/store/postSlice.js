import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axios-config';
import { API_BASE_URL } from '../services/host-config';

// 좋아요순 게시글 3개 가져오기
export const fetchCookPostsByLike = createAsyncThunk(
  'post/fetchCookPostsByLike',
  async (cookId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        `${API_BASE_URL}/post-service/post/cook-posts/${cookId}?sortBy=LIKE`
      );
      return res.data.posts.slice(0, 3);
    } catch (err) {
      const message = err.response?.data?.message || '레시피 게시글 불러오기 실패';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 게시글 등록 thunk
export const registerPost = createAsyncThunk(
  'post/registerPost',
  async ({ paymentId, cookId, title, content, imageList }, thunkAPI) => {
    try {
      console.log(paymentId, cookId, title, content, imageList);
      const body = {
        paymentId,
        cookId,
        title,
        content,
        images: imageList.map((img, i) => ({
          imageUrl: img.imageUrl,
          index: i + 1,
        })),
      };
      const res = await axiosInstance.post(`/post-service/post/register`, body);
      return res.data.posts[0];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || '게시글 등록 실패');
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
      })

      .addCase(registerPost.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerPost.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(registerPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
