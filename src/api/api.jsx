import axios from "axios";
import { API_URL } from "../config";
import authApi from "./authAxios";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

let logoutHandler = null;

export const setLogoutHandler = (logout) => {
  logoutHandler = logout;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {

    if (error.response?.status === 401 && error.response?.data?.errorCode === 'ACCESS_TOKEN_EXPIRED' || error.response?.data?.errorCode === 'NO_TOKEN') {
      try {
        
        await authApi.post('/refresh');
      
        return api.request(error.config);
      } catch (refreshError) {
        console.log('refersh expired!!!')
        if (logoutHandler) {
          logoutHandler();
        } else {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    else if (error.response?.status === 403 && error.response?.data?.errorCode === 'INVALID_ACCESS_TOKEN')
    {
      if (logoutHandler) {
          logoutHandler();
        } else {
          window.location.href = '/login';
        }
    }
    
    return Promise.reject(error);
  }
);

export default api;