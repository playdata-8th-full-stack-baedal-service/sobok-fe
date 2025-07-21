import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../services/axios-config';

// 회원 정보 조회
export const lookupUser = createAsyncThunk(
  'userInfo/lookupUser',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/auth-service/auth/get-info');

      console.log(response.data.data);
      return response.data.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || '회원 조회에 실패했습니다.');
    }
  }
);

// 프로필 이미지 수정
export const editUserProfile = createAsyncThunk(
  'userInfo/editUserProfile',
  async ({ formData }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch('/user-service/user/editPhoto/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data.data);
      return response.data.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data?.message || '프로필 이미지 수정에 실패했습니다.'
      );
    }
  }
);

// 비밀번호 변경
export const editUserPassword = createAsyncThunk(
  'userInfo/editUserPassword',
  async ({ password }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch('/auth-service/auth/edit-password', {
        newPassword: password,
      });
      console.log(response.data.data);
      return response.data.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    }
  }
);

// 인증번호 전송
export const sendAuthCode = createAsyncThunk(
  'userInfo/sendAuthCode',
  async ({ phone }, thunkAPI) => {
    try {
      await axiosInstance.post('/auth-service/sms/send', { phone });
      return true;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || '인증번호 전송에 실패했습니다.');
    }
  }
);

// 전화번호 수정
export const editPhone = createAsyncThunk(
  'userInfo/editPhone',
  async ({ phone, userInputCode }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch('/user-service/user/editPhone', {
        phone,
        userInputCode,
      });

      if (!response.data.success) {
        return thunkAPI.rejectWithValue(response.data.message);
      }

      return phone;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || '전화번호 수정에 실패했습니다.');
    }
  }
);

// 이메일 수정
export const editEmail = createAsyncThunk('userInfo/editEmail', async ({ email }, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/user-service/user/editEmail', { email });
    if (!response.data.success) {
      return thunkAPI.rejectWithValue(response.data.message);
    }

    return email;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || '이메일 수정에 실패했습니다.');
  }
});

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    userInfo: {},
    errorMessage: null,
  },
  reducers: {
    // userInfo 정보 설정
    setUserInfo: (state, action) => ({
      ...state,
      userInfo: action.payload,
    }),
    // 에러 메시지 설정
    setErrorMessage: (state, action) => ({
      ...state,
      errorMessage: action.payload,
    }),
  },
  extraReducers: builder => {
    // 회원 정보 조회
    builder
      .addCase(lookupUser.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.errorMessage = null;
      })
      .addCase(lookupUser.rejected, (state, action) => {
        state.errorMessage = action.payload;
      });

    // 프로필 이미지 수정
    builder
      .addCase(editUserProfile.fulfilled, (state, action) => {
        state.userInfo = { ...state.userInfo, photo: action.payload };
        state.errorMessage = null;
      })
      .addCase(editUserProfile.rejected, (state, action) => {
        state.errorMessage = action.payload;
      });

    // 비밀번호 변경
    builder
      .addCase(editUserPassword.fulfilled, state => {
        state.errorMessage = null;
      })
      .addCase(editUserPassword.rejected, (state, action) => {
        state.errorMessage = action.payload;
      });

    // 인증번호 전송
    builder
      .addCase(sendAuthCode.fulfilled, state => {
        state.errorMessage = null;
      })
      .addCase(sendAuthCode.rejected, (state, action) => {
        state.errorMessage = action.payload;
      });

    // 전화번호 수정
    builder
      .addCase(editPhone.fulfilled, (state, action) => {
        state.userInfo = { ...state.userInfo, phone: action.payload };
        state.errorMessage = null;
      })
      .addCase(editPhone.rejected, (state, action) => {
        state.errorMessage = action.payload;
      });

    // 이메일 수정
    builder
      .addCase(editEmail.fulfilled, (state, action) => {
        state.userInfo = { ...state.userInfo, email: action.payload };
        state.errorMessage = null;
      })
      .addCase(editEmail.rejected, (state, action) => {
        state.errorMessage = action.payload;
      });
  },
});

export const { setUserInfo, setErrorMessage } = userInfoSlice.actions;
export default userInfoSlice.reducer;
