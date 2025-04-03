import { store } from '../redux/store'; // ✅ Fix: Import correctly
import axios from 'axios';
import { refreshToken } from '../redux/authSlice';

const BASE_URL = 'http://localhost:3000/api';

// Axios instance without auth (for login, refresh, etc.)
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

// Axios instance with authentication
export const axiosAuthInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

// ✅ Attach token to requests
axiosAuthInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token; // ✅ Now this will work
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle token refresh on 401 errors
axiosAuthInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Dispatch refresh token action
        const { payload } = await store.dispatch(refreshToken());

        if (payload?.accessToken) {
          axiosAuthInstance.defaults.headers.common["Authorization"] = `Bearer ${payload.accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${payload.accessToken}`;
          return axiosAuthInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);
