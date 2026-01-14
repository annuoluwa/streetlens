import axios from 'axios';


const apiBase = process.env.REACT_APP_API_URL || '';
const api = axios.create({
  baseURL: `${apiBase}/api`,
  withCredentials: false,
});

// Add a request interceptor to attach token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
