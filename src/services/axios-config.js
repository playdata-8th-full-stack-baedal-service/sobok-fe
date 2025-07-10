import axios from 'axios';
import { API_BASE_URL } from './host-config';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    // 인증이 필요 없는 공개 엔드포인트 목록
    const publicEndpoints = [
      '/auth-service/auth/user-signup',
      '/auth-service/auth/temp-token',
      '/auth-service/auth/check-email',
      '/auth-service/auth/check-nickname',
      '/auth-service/auth/check-id',
    ];

    // 공개 엔드포인트가 아닌 경우에만 Authorization 헤더 추가
    const isPublicEndpoint = publicEndpoints.some(endpoint => config.url.includes(endpoint));
    const accessToken = localStorage.getItem('ACCESS_TOKEN');

    if (!isPublicEndpoint && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log('[axiosInstance] 요청:', {
      url: config.url,
      headers: config.headers,
    });

    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const errorStatus = error?.response?.status;
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('REFRESH_TOKEN');

    if (errorStatus === 666) {
      try {
        const res = await axios.post(`${API_BASE_URL}auth-service/auth/reissue`, {
          refreshToken,
        });
        const newAccessToken = res.data.accessToken;
        localStorage.setItem('ACCESS_TOKEN', newAccessToken);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        return axiosInstance(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
