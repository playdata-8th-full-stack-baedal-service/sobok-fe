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
    const message = error.response?.data?.data?.message || '로그인 요청에 실패하였습니다.';
    return thunkAPI.rejectWithValue(message);
  }
});

export const signUpUser = createAsyncThunk('auth/signUpUser', async (userData, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/auth-service/auth/user-signup', userData);
    const { status, message } = response.data;
    if (status === 200 || message?.includes('회원가입 성공')) {
      return response.data.data;
    }

    return thunkAPI.rejectWithValue('회원가입 실패');
  } catch (error) {
    const message = error.response?.data?.message || '회원가입 요청에 실패하였습니다.';
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteUser = createAsyncThunk('auth/deleteUser', async ({ password }, thunkAPI) => {
  try {
    const response = await axiosInstance.delete('/auth-service/auth/delete', {
      data: {
        password,
      },
    });
    const { status, message } = response.data;
    if (status === 200 || message?.includes('사용자가 정상적으로 비활성화되었습니다.')) {
      return response.data.data;
    }
    return thunkAPI.rejectWithValue('회원탈퇴 실패');
  } catch (error) {
    const message = error.response?.data?.message || '회원탈퇴에 실패하였습니다.';
    return thunkAPI.rejectWithValue(message);
  }
});

export const checkEmail = createAsyncThunk('auth/checkEmail', async (email, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/auth-service/auth/check-email`, {
      params: { email },
    });
    if (response.data.status === 200 || response.data.message === '사용 가능한 이메일입니다.') {
      return response.data.message;
    }
    return thunkAPI.rejectWithValue('이메일 중복확인 실패');
  } catch (error) {
    const message = error.response?.data?.message || '이메일 중복 확인에 실패했습니다.';
    return thunkAPI.rejectWithValue(message);
  }
});

export const checkNickName = createAsyncThunk('auth/checkNickName', async (nickname, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/auth-service/auth/check-nickname', {
      params: {
        nickname,
      },
    });
    if (response.data.status === 200 || response.data.message === '사용 가능한 닉네임입니다.') {
      return response.data.message;
    }
    return thunkAPI.rejectWithValue('닉네임 중복 확인 실패');
  } catch (error) {
    const message = error.response?.data?.message || '닉네임 중복 확인에 실패했습니다.';
    return thunkAPI.rejectWithValue(message);
  }
});

export const checkLoginId = createAsyncThunk('auth/checkLoginId', async (loginId, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/auth-service/auth/check-id', {
      params: {
        loginId,
      },
    });
    if (response.data.status === 200 || response.data.message === '사용 가능한 아이디입니다.') {
      return response.data.message;
    }
    return thunkAPI.rejectWithValue('아이디 중복 확인 실패');
  } catch (error) {
    const message = error.response?.data?.message || '아이디 중복 확인에 실패했습니다.';
    return thunkAPI.rejectWithValue(message);
  }
});

export const lookupUser = createAsyncThunk('auth/lookupUser', async ({ password }, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/auth-service/auth/get-info', {
      password,
    });
    if (
      response.data.success &&
      response.data.status === 200 &&
      response.data.message === '성공적으로 정보가 조회되었습니다.'
    ) {
      return response.data.data;
    }
    return thunkAPI.rejectWithValue('회원정보 조회 실패');
  } catch (error) {
    const message = error.response?.data?.message || '회원 조회에 실패했습니다.';
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
    signUpSuccess: false,
    deleteSuccess: false,
    emailCheckMessage: null,
    emailCheckError: null,
    nicknameCheckError: null,
    nicknameCheckMessage: null,
    loginIdCheckMessage: null,
    loginIdCheckError: null,
    userInfo: null,
    userInfoLoading: false,
    userInfoError: null,
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
      state.userInfo = null;
      state.userInfoError = null;
    },
    clearSignUpSuccess: state => {
      state.signUpSuccess = false;
    },
    clearDeleteSuccess: state => {
      state.deleteSuccess = false;
    },
    clearEmailCheck: state => {
      state.emailCheckMessage = null;
      state.emailCheckError = null;
    },
    clearNicknameCheck: state => {
      state.nicknameCheckMessage = null;
      state.nicknameCheckError = null;
    },
    clearLoginIdCheck: state => {
      state.loginIdCheckMessage = null;
      state.loginIdCheckError = null;
    },
    clearUserInfo: state => {
      state.userInfo = null;
      state.userInfoError = null;
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
      })
      .addCase(signUpUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.signUpSuccess = false;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.signUpSuccess = true;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.signUpSuccess = false;
      })
      .addCase(deleteUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteSuccess = true;
        localStorage.clear();
        state.accessToken = null;
        state.refreshToken = null;
        state.role = null;
        state.userId = null;
        state.recoveryTarget = null;
        state.userInfo = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      })
      .addCase(checkEmail.pending, state => {
        state.loading = true;
        state.emailCheckMessage = null;
        state.emailCheckError = null;
      })
      .addCase(checkEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.emailCheckMessage = action.payload;
      })
      .addCase(checkEmail.rejected, (state, action) => {
        state.loading = false;
        state.emailCheckError = action.payload;
      })
      .addCase(checkNickName.pending, state => {
        state.loading = true;
        state.nicknameCheckMessage = null;
        state.nicknameCheckError = null;
      })
      .addCase(checkNickName.fulfilled, (state, action) => {
        state.loading = false;
        state.nicknameCheckMessage = action.payload;
      })
      .addCase(checkNickName.rejected, (state, action) => {
        state.loading = false;
        state.nicknameCheckError = action.payload;
      })
      .addCase(checkLoginId.pending, state => {
        state.loading = true;
        state.loginIdCheckMessage = null;
        state.loginIdCheckError = null;
      })
      .addCase(checkLoginId.fulfilled, (state, action) => {
        state.loading = false;
        state.loginIdCheckMessage = action.payload;
      })
      .addCase(checkLoginId.rejected, (state, action) => {
        state.loading = false;
        state.loginIdCheckError = action.payload;
      })
      .addCase(lookupUser.pending, state => {
        state.userInfoLoading = true;
        state.userInfoError = null;
      })
      .addCase(lookupUser.fulfilled, (state, action) => {
        state.userInfoLoading = false;
        state.userInfo = action.payload;
      })
      .addCase(lookupUser.rejected, (state, action) => {
        state.userInfoLoading = false;
        state.userInfoError = action.payload;
      });
  },
});

export const {
  logout,
  clearSignUpSuccess,
  clearDeleteSuccess,
  clearEmailCheck,
  clearNicknameCheck,
  clearLoginIdCheck,
  clearUserInfo,
} = authSlice.actions;
export default authSlice.reducer;
