import axios from 'axios';

export type UserRole = 'USER' | 'VIEWER';

// API Response Types
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface LoginResponse {
  token: string;
  message: string;
}

interface RegisterResponse {
  token: string;
  message: string;
}

interface ProfileResponse {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface TourStep {
  id: string;
  title: string;
  body?: string;
  imageUrl?: string;
  order: number;
  tourId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tour {
  id: string;
  title: string;
  description?: string;
  steps: TourStep[];
  views: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface UploadResponse {
  success: boolean;
  url: string;
  filename: string;
  resourceType: 'image' | 'video';
}

interface DashboardStats {
  totalTours: number;
  publicTours: number;
  privateTours: number;
  totalViews: number;
  mostViewedTour: Tour | null;
  latestTour: Tour | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) => 
    api.post<ApiResponse<LoginResponse>>('/auth/login', { email, password }),
  
  register: (email: string, password: string, role?: UserRole) =>
    api.post<ApiResponse<RegisterResponse>>('/auth/register', { email, password, role }),
    
  getProfile: () => api.get<ApiResponse<ProfileResponse>>('/user/profile'),
};

// Tours API
export const toursApi = {
  getAll: () => api.get<ApiResponse<Tour[]>>('/tours'),
  getOne: (id: string) => api.get<ApiResponse<Tour>>(`/tours/${id}`),
  create: (data: { title: string, description?: string, isPublic: boolean }) =>
    api.post<ApiResponse<Tour>>('/tours', data),
  update: (id: string, data: Partial<{ title: string, description?: string, isPublic: boolean }>) =>
    api.put<ApiResponse<Tour>>(`/tours/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/tours/${id}`),
  
  // Steps
  addStep: (tourId: string, data: { title: string, body?: string, imageUrl?: string, order: number }) =>
    api.post<ApiResponse<TourStep>>(`/tours/${tourId}/steps`, data),
  updateStep: (tourId: string, stepId: string, data: Partial<{ title: string, body?: string, imageUrl?: string, order: number }>) =>
    api.put<ApiResponse<TourStep>>(`/tours/${tourId}/steps/${stepId}`, data),
  deleteStep: (tourId: string, stepId: string) =>
    api.delete<ApiResponse<void>>(`/tours/${tourId}/steps/${stepId}`),
};

// Stats API
export const statsApi = {
  getDashboard: () => api.get<ApiResponse<DashboardStats>>('/stats/dashboard'),
};

// Upload API
export const uploadApi = {
  uploadMedia: (file: File) => {
    const formData = new FormData();
    formData.append('media', file);
    return api.post<ApiResponse<UploadResponse>>('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api; 