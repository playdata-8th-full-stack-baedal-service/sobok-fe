import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../services/axios-config';

export const riderSignUp = createAsyncThunk('rider/riderSignUp', async (riderData, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/auth-service/auth/rider-signup', riderData);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data.data || '서버 오류 발생');
  }
});

const riderSlice = createSlice({
  name: 'rider',
  initialState: {
    loading: false,
    error: null,
    riderInfo: null,
    signUpSuccess: false,
  },
  reducers: {
    clearSignUpSuccess(state) {
      state.signUpSuccess = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(riderSignUp.pending, state => {
        state.loading = true;
        state.error = null;
        state.signUpSuccess = false;
      })
      .addCase(riderSignUp.fulfilled, (state, action) => {
        state.loading = false;
        state.riderInfo = action.payload;
        state.signUpSuccess = true;
      })
      .addCase(riderSignUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '회원가입 실패';
        state.signUpSuccess = false;
      });
  },
});

export const { clearSignUpSuccess } = riderSlice.actions;
export default riderSlice.reducer;
