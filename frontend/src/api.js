import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/',
  timeout: 6000, // 6s timeout before triggering fast client fallback
});

export default api;
