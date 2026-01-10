// src/api/http.js
import axios from 'axios';

const http = axios.create({
  timeout: 8000,
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API error:', err?.response || err);
    return Promise.reject(err);
  }
);

export default http;
