import axios from "axios";
import { API_URL } from "../config";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      try {
        const decodedToken =  jwtDecode(token);
      } catch (e) {
        console.error("Invalid token format");
      }
     } 
     else {
        console.warn("No access token found in localStorage");
  }
  return config;
}, (err) => Promise.reject(err));

export default api;