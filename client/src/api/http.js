// src/api/http.js
import axios from 'axios';

const DEFAULT_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 60000;

const http = axios.create({
  timeout: DEFAULT_TIMEOUT_MS,
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API error:', err?.response || err);
    return Promise.reject(err);
  }
);

export default http;
