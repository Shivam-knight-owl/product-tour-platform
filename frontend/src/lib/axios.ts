import axios from 'axios';

// Use environment variable or fallback to localhost:3001
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Log the request
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
      baseURL: config.baseURL
    });

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    // Log the response
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });

    // If the response has a data.data property, return that instead
    if (response.data?.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    // Log the error response
    console.error('Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default instance; 