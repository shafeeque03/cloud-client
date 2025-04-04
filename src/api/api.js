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
export const createFolder = async (name,folderId) => {
    return await axiosAuthInstance.post('/user/create-folder', { name,folderId }); 
}

export const renameFolder = async (folderId, name) => {
    return await axiosAuthInstance.patch('/user/rename-folder', { folderId, name }); 
}

export const fetchFolders = async () => {
    return await axiosAuthInstance.get('/user/fetch-home'); 
}

export const fetchChildFolders = async (folderId) => {
    return await axiosAuthInstance.get(`/user/fetch-child-folders/${folderId}`); 
}
