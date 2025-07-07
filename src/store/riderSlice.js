import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../services/axios-config';

export const riderSignUp = createAsyncThunk('rider/riderSignUp', async (riderData, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/auth-service/auth/rider-signup', riderData);
    const { status, message } = response.data;
    if (status === 200 || message?.includes('라이더 회원가입 성공')) {
      return response.data.data;
    }
    return thunkAPI.rejectWithValue('라이더 회원가입 실패');
  } catch (error) {
    const message = error.response?.data?.message || '라이더 회원가입 요청에 실패하였습니다.';
    return thunkAPI.rejectWithValue(message);
  }
});

export const checkPermission = createAsyncThunk(
  'rider/checkPermission',
  async (permission, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/auth-service/auth/check-permission', {
        params: {
          permission,
        },
      });
      if (
        response.data.status === 200 ||
        response.data.message === '사용 가능한 면허번호 입니다.'
      ) {
        return response.data.message;
      }
      return thunkAPI.rejectWithValue('면허번호 중복 확인 실패');
    } catch (error) {
      const message = error.response?.data?.message || '면허번호 중복 확인에 실패했습니다.';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const riderSlice = createSlice({
  name: 'rider',
  initialState: {
    loading: false,
    error: null,
    riderInfo: null,
    signUpSuccess: false,
    permissionCheckLoading: false,
    permissionCheckError: null,
    permissionCheckSuccess: false,
    permissionCheckMessage: null,
  },
  reducers: {
    clearSignUpSuccess(state) {
      state.signUpSuccess = false;
    },
    clearPermissionCheck(state) {
      state.permissionCheckLoading = false;
      state.permissionCheckError = null;
      state.permissionCheckSuccess = false;
      state.permissionCheckMessage = null;
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
      })
      // 면허번호 중복확인 관련
      .addCase(checkPermission.pending, state => {
        state.permissionCheckLoading = true;
        state.permissionCheckError = null;
        state.permissionCheckSuccess = false;
        state.permissionCheckMessage = null;
      })
      .addCase(checkPermission.fulfilled, (state, action) => {
        state.permissionCheckLoading = false;
        state.permissionCheckSuccess = true;
        state.permissionCheckMessage = action.payload;
      })
      .addCase(checkPermission.rejected, (state, action) => {
        state.permissionCheckLoading = false;
        state.permissionCheckError = action.payload || '면허번호 중복 확인 실패';
        state.permissionCheckSuccess = false;
      });
  },
});

export const { clearSignUpSuccess, clearPermissionCheck } = riderSlice.actions;
export default riderSlice.reducer;