import axios from 'axios';

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    const req = config;

    const accessToken = localStorage.getItem('ACCESS_TOKEN');

    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }
    return req;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const errorStatus = error?.response?.status;
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('REFRESH_TOKEN');

    if (errorStatus === 666) {
      try {
        const res = await axios.post('', {
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
