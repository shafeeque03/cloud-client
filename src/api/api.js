import { axiosInstance, axiosAuthInstance } from "./axios-instance";

// Authentication API calls
export const authApi = {
  // Login function
  login: async (loginId, password) => {
    return await axiosInstance.post('/auth/login', { loginId, password });
  },
  
  // Refresh token
  refreshToken: async () => {
    return await axiosInstance.post('/auth/refresh');
  },
  
  // Logout
  logout: async () => {
    return await axiosInstance.post('/auth/logout');
  },
  
  // Get current user profile
  getCurrentUser: async () => {
    return await axiosAuthInstance.get('/user/profile');
  }
};






