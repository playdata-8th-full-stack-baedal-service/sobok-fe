const ACCESS_TOKEN_KEY = 'accessToken';

export const getToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const setToken = token => localStorage.setItem(ACCESS_TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);
