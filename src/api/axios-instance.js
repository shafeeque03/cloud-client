import axios from "axios";
import axiosRetry from "axios-retry";
import toast from "react-hot-toast";
import { store } from "../redux/store";
import { refreshToken,logoutUser } from "../redux/authSlice";

const baseURL = import.meta.env.VITE_BASEURL || "http://localhost:3000/api/";

// Create base axios instance
export const axiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  timeoutErrorMessage: "Request timeout... Please try again!",
  withCredentials: true // Important for cookies
});

// Create authenticated axios instance
export const axiosAuthInstance = axios.create({
  baseURL,
  timeout: 30000,
  timeoutErrorMessage: "Request timeout... Please try again!",
  withCredentials: true
});

// Apply retry logic
axiosRetry(axiosInstance, { 
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Do not retry on client errors (4xx)
    return !error.response || error.response.status >= 500;
  }
});
axiosRetry(axiosAuthInstance, { 
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return !error.response || error.response.status >= 500;
  }
});

// Token refresh in progress flag
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedQueue = [];

// Helper to process queued requests
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Interceptor for authenticated requests
axiosAuthInstance.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const accessToken = state.auth.token;
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with token refresh logic
axiosAuthInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Prevent infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosAuthInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }
      
      // Start token refresh process
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Dispatch refresh token action
        const result = await store.dispatch(refreshToken()).unwrap();
        const newToken = result.accessToken;
        
        // Process queue with new token
        processQueue(null, newToken);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosAuthInstance(originalRequest);
      } catch (refreshError) {
        // Failed to refresh token, logout user
        processQueue(refreshError, null);
        store.dispatch(logoutUser());
        toast.error("Session expired. Please login again.");
        
        // Redirect to login
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle other errors
    if (error.response) {
      // Client received an error response (4xx, 5xx)
      const errorMessage = error.response.data?.message || "An error occurred";
      toast.error(errorMessage);
    } else if (error.request) {
      // Client never received a response
      toast.error("No response from server. Please check your connection.");
    } else {
      // Something happened in setting up the request
      toast.error("An error occurred. Please try again.");
    }
    
    return Promise.reject(error);
  }
);

// Basic interceptor for non-authenticated requests
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors
    if (error.response) {
      const errorMessage = error.response.data?.message || "An error occurred";
      toast.error(errorMessage);
    } else if (error.request) {
      toast.error("No response from server. Please check your connection.");
    } else {
      toast.error("An error occurred. Please try again.");
    }
    
    return Promise.reject(error);
  }
);