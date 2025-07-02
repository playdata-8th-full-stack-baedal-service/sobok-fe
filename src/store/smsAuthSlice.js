import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../services/axios-config';

export const sendSMSCode = createAsyncThunk(
  'smsAuth/sendSMSCode',
  async (phoneNumber, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/auth-service/sms/send', {
        phone: phoneNumber,
      });
      return { phoneNumber, message: response.data.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'SMS 전송에 실패하였습니다.'
      );
    }
  }
);

export const verifySMSCode = createAsyncThunk(
  'smsAuth/verifySMSCode',
  async ({ phoneNumber, inputCode }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/auth-service/sms/verify', {
        phoneNumber,
        inputCode,
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || '인증에 실패했습니다.'
      );
    }
  }
);

const smsAuthSlice = createSlice({
  name: 'smsAuth',
  initialState: {
    loading: false,
    error: null,
    phoneNumber: '',
    isCodeSent: false,
    isVerified: false,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetSMSAuth(state) {
      state.loading = false;
      state.error = null;
      state.phoneNumber = '';
      state.isCodeSent = false;
      state.isVerified = false;
    },
    setPhoneNumber(state, action) {
      state.phoneNumber = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendSMSCode.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendSMSCode.fulfilled, (state, action) => {
        state.loading = false;
        state.phoneNumber = action.payload.phoneNumber;
        state.isCodeSent = true;
      })
      .addCase(sendSMSCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isCodeSent = false;
      })
      .addCase(verifySMSCode.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifySMSCode.fulfilled, (state, action) => {
        state.loading = false;
        state.isVerified = true;
      })
      .addCase(verifySMSCode.rejected, (state, action) => {
        state.loading = false;
        state.isVerified = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetSMSAuth, setPhoneNumber } = smsAuthSlice.actions;
export default smsAuthSlice.reducer;
