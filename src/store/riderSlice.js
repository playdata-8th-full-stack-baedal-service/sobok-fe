import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../services/axios-config';

export const riderSignUp = createAsyncThunk('rider/riderSignUp', async (riderData, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/auth-service/auth/rider-signup', riderData);
    const { status, message } = response.data;
    if(status === 200 || message?.includes("라이더 회원가입 성공")) {
        return response.data.data;
    }
    return thunkAPI.rejectWithValue('라이더 회원가입 실패');
  } catch (error) {
    const message = error.response?.data?.message || '라이더 회원가입 요청에 실패하였습니다.';
    return thunkAPI.rejectWithValue(message)
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
