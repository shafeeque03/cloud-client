import { axiosInstance, axiosAuthInstance } from "./axios-instance";

// Authentication API calls
export const authApi = {
  login: async (loginId, password) => {
    return await axiosInstance.post('/auth/login', { loginId, password });
  },
  
  refreshToken: async () => {
    return await axiosInstance.post('/auth/refresh');
  },
  
  logout: async () => {
    return await axiosInstance.post('/auth/logout');
  },
  
  getCurrentUser: async () => {
    return await axiosAuthInstance.get('/user/profile'); // Requires token
  }
};

// Folder-related API calls (protected routes)
export const createFolder = async (name) => {
    return await axiosAuthInstance.post('/user/create-folder', { name }); 
}

export const fetchFolders = async () => {
    return await axiosAuthInstance.get('/user/fetch-home'); 
}
