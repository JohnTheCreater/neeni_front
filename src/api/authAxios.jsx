import axios from "axios";
import { API_URL } from "../config";


const authApi = axios.create({
  baseURL: API_URL+'/api/auth',
  withCredentials:true
});



export default authApi;