import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../services/axios-config';

export const loginUser = createAsyncThunk('auth/loginUser', async ({ id, password }, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/auth-service/auth/login', {
      loginId: id,
      password,
    });

    if (response.data.success) {
      const { accessToken, refreshToken, role, id: userId, recoveryTarget } = response.data.data;

      localStorage.setItem('ACCESS_TOKEN', accessToken);
      localStorage.setItem('REFRESH_TOKEN', refreshToken);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('recovery', recoveryTarget);

      return { accessToken, refreshToken, role, userId, recoveryTarget };
    }
    return thunkAPI.rejectWithValue('로그인 실패');
  } catch (error) {
    const message = error.response?.data?.message || '로그인 요청에 실패하였습니다.';
    return thunkAPI.rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
    refreshToken: null,
    role: null,
    userId: null,
    recoveryTarget: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: state => {
      localStorage.clear();
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
      state.userId = null;
      state.recoveryTarget = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.role = action.payload.role;
        state.userId = action.payload.userId;
        state.recoveryTarget = action.payload.recoveryTarget;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
