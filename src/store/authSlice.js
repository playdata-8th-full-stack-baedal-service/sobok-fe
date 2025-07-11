import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../services/axios-config';

/** ────────────── API 요청 Thunk 정의 ────────────── */

// 로그인
export const loginUser = createAsyncThunk('auth/loginUser', async ({ id, password }, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/auth-service/auth/login', {
      loginId: id,
      password,
    });
    if (res.data.success) {
      const { accessToken, refreshToken, role, id: userId, recoveryTarget } = res.data.data;
      const tokenData = { accessToken, refreshToken, role, userId, recoveryTarget };
      localStorage.setItem('ACCESS_TOKEN', accessToken);
      localStorage.setItem('REFRESH_TOKEN', refreshToken);
      localStorage.setItem('USER_ROLE', role);
      localStorage.setItem('USER_ID', userId);
      localStorage.setItem('RECOVERY_TARGET', recoveryTarget);
      return tokenData;
    }
    // success: false
    return thunkAPI.rejectWithValue(
      e.response?.data?.message || '로그인 실패.'
      );
  } catch (e) {
    // 요청 자체 실패 (네트워크, 서버 에러 등)
    return thunkAPI.rejectWithValue(
      e.response?.data?.message || '로그인 요청에 실패하였습니다.'
    );
  }
});

// 회원가입
export const signUpUser = createAsyncThunk('auth/signUpUser', async (userData, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/auth-service/auth/user-signup', userData);
    const { status } = response.data;
    console.log(response.data);
    if (status === 200) {
      return response.data.data;
    }
    return thunkAPI.rejectWithValue('회원가입 실패');
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || '회원가입 요청에 실패하였습니다.');
  }
});

// 회원탈퇴
export const deleteUser = createAsyncThunk('auth/deleteUser', async ({ password }, thunkAPI) => {
  try {
    const res = await axiosInstance.delete('/auth-service/auth/delete', { data: { password } });
    const { status, message } = res.data;
    if (status === 200 || message?.includes('비활성화')) return res.data.data;
    return thunkAPI.rejectWithValue('회원탈퇴 실패');
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || '회원탈퇴에 실패하였습니다.');
  }
});

// 이메일 중복 확인
export const checkEmail = createAsyncThunk('auth/checkEmail', async (email, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/user-service/user/check-email', { params: { email } });
    if (res.data.status === 200 || res.data.message === '사용 가능한 이메일입니다.')
      return res.data.message;
    return thunkAPI.rejectWithValue('이메일 중복확인 실패');
  } catch (e) {
    return thunkAPI.rejectWithValue(
      e.response?.data?.message || '이메일 중복 확인에 실패했습니다.'
    );
  }
});

// 닉네임 중복 확인
export const checkNickName = createAsyncThunk('auth/checkNickName', async (nickname, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/user-service/user/check-nickname', {
      params: { nickname },
    });
    if (res.data.status === 200 || res.data.message === '사용 가능한 닉네임입니다.')
      return res.data.message;
    return thunkAPI.rejectWithValue('닉네임 중복 확인 실패');
  } catch (e) {
    return thunkAPI.rejectWithValue(
      e.response?.data?.message || '닉네임 중복 확인에 실패했습니다.'
    );
  }
});

// 아이디 중복 확인
export const checkLoginId = createAsyncThunk('auth/checkLoginId', async (loginId, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/auth-service/auth/check-id', { params: { loginId } });
    if (res.data.status === 200 || res.data.message === '사용 가능한 아이디입니다.')
      return res.data.message;
    return thunkAPI.rejectWithValue('아이디 중복 확인 실패');
  } catch (e) {
    return thunkAPI.rejectWithValue(
      e.response?.data?.message || '아이디 중복 확인에 실패했습니다.'
    );
  }
});

// 회원정보 조회
export const lookupUser = createAsyncThunk('auth/lookupUser', async ({ password }, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/auth-service/auth/get-info', {
      password,
    });
    if (response.data.success) {
      return response.data.data;
    }
    return thunkAPI.rejectWithValue('회원정보 조회 실패');
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || '회원 조회에 실패했습니다.');
  }
});

/** ────────────── Slice 정의 ────────────── */

const initialState = {
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
  nicknameCheckMessage: null,
  nicknameCheckError: null,
  loginIdCheckMessage: null,
  loginIdCheckError: null,
  userInfo: null,
  userInfoLoading: false,
  userInfoError: null,
};

const setLoading = state => {
  state.loading = true;
  state.error = null;
};
const setMessageError = (state, type, payload) => {
  state[`${type}Message`] = null;
  state[`${type}Error`] = null;
  if (payload) state[`${type}Error`] = payload;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      localStorage.clear();
      Object.assign(state, {
        accessToken: null,
        refreshToken: null,
        role: null,
        userId: null,
        recoveryTarget: null,
        error: null,
        userInfo: null,
        userInfoError: null,
      });
    },
    clearSignUpSuccess: state => {
      state.signUpSuccess = false;
    },
    clearDeleteSuccess: state => {
      state.deleteSuccess = false;
    },
    clearEmailCheck: state => setMessageError(state, 'emailCheck'),
    clearNicknameCheck: state => setMessageError(state, 'nicknameCheck'),
    clearLoginIdCheck: state => setMessageError(state, 'loginIdCheck'),
    clearUserInfo: state => {
      state.userInfo = null;
      state.userInfoError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, setLoading)
      .addCase(loginUser.fulfilled, (state, action) => {
        Object.assign(state, { loading: false, ...action.payload });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(signUpUser.pending, state => {
        setLoading(state);
        state.signUpSuccess = false;
      })
      .addCase(signUpUser.fulfilled, state => {
        state.loading = false;
        state.signUpSuccess = true;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.signUpSuccess = false;
      })

      .addCase(deleteUser.pending, state => {
        setLoading(state);
        state.deleteSuccess = false;
      })
      .addCase(deleteUser.fulfilled, state => {
        localStorage.clear();
        Object.assign(state, {
          loading: false,
          deleteSuccess: true,
          accessToken: null,
          refreshToken: null,
          role: null,
          userId: null,
          recoveryTarget: null,
          userInfo: null,
        });
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      })

      .addCase(checkEmail.pending, state => setMessageError(state, 'emailCheck'))
      .addCase(checkEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.emailCheckMessage = action.payload;
      })
      .addCase(checkEmail.rejected, (state, action) => {
        setMessageError(state, 'emailCheck', action.payload);
        state.loading = false;
      })

      .addCase(checkNickName.pending, state => setMessageError(state, 'nicknameCheck'))
      .addCase(checkNickName.fulfilled, (state, action) => {
        state.loading = false;
        state.nicknameCheckMessage = action.payload;
      })
      .addCase(checkNickName.rejected, (state, action) => {
        setMessageError(state, 'nicknameCheck', action.payload);
        state.loading = false;
      })

      .addCase(checkLoginId.pending, state => setMessageError(state, 'loginIdCheck'))
      .addCase(checkLoginId.fulfilled, (state, action) => {
        state.loading = false;
        state.loginIdCheckMessage = action.payload;
      })
      .addCase(checkLoginId.rejected, (state, action) => {
        setMessageError(state, 'loginIdCheck', action.payload);
        state.loading = false;
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

/** ────────────── Export ────────────── */
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
