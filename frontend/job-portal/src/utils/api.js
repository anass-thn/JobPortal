import axios from 'axios';
import toast from 'react-hot-toast';

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if using cookies
});

// Request interceptor - Add token and handle request
api.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development mode
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    // Handle request error
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Log response in development mode
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    // Return response data directly
    return response;
  },
  (error) => {
    // Handle response errors
    const { response, request, message } = error;

    // Log error in development mode
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: response?.status,
        message: response?.data?.message || message,
        data: response?.data,
      });
    }

    // Handle different error scenarios
    if (response) {
      // Server responded with error status
      const { status, data } = response;

      switch (status) {
        case 401:
          // Unauthorized - Clear auth and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Only redirect if not already on login page
          if (window.location.pathname !== '/login') {
            toast.error('Session expired. Please login again.');
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden
          toast.error(data?.message || 'You do not have permission to perform this action.');
          break;

        case 404:
          // Not found
          toast.error(data?.message || 'Resource not found.');
          break;

        case 409:
          // Conflict
          toast.error(data?.message || 'This action conflicts with existing data.');
          break;

        case 422:
          // Validation error
          const validationErrors = data?.errors || [];
          if (validationErrors.length > 0) {
            validationErrors.forEach((err) => {
              toast.error(err.message || `${err.field}: Invalid value`);
            });
          } else {
            toast.error(data?.message || 'Validation failed.');
          }
          break;

        case 429:
          // Too many requests
          toast.error('Too many requests. Please try again later.');
          break;

        case 500:
        case 502:
        case 503:
          // Server errors
          toast.error(data?.message || 'Server error. Please try again later.');
          break;

        default:
          // Other errors
          toast.error(data?.message || 'An error occurred. Please try again.');
      }
    } else if (request) {
      // Request was made but no response received (network error)
      toast.error('Network error. Please check your connection and try again.');
    } else {
      // Something else happened
      toast.error(message || 'An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.put('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// User API functions
export const userAPI = {
  // Get user by ID (protected)
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Get public user profile
  getPublicProfile: async (userId) => {
    const response = await api.get(`/users/public/${userId}`);
    return response.data;
  },

  // Update my profile
  updateMyProfile: async (profileData) => {
    const response = await api.put('/users/me', profileData);
    return response.data;
  },

  // Delete my resume
  deleteMyResume: async () => {
    const response = await api.delete('/users/me/resume');
    return response.data;
  },
};

// Job API functions
export const jobAPI = {
  // List jobs with filters
  listJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  // Get job by ID
  getJobById: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  // Create a job
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update a job
  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/jobs/${jobId}`, jobData);
    return response.data;
  },

  // Delete a job
  deleteJob: async (jobId) => {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  },
};

// Application API functions
export const applicationAPI = {
  // Apply to a job
  applyToJob: async (jobId, applicationData) => {
    const response = await api.post(`/applications/${jobId}/apply`, applicationData);
    return response.data;
  },

  // Get my applications
  getMyApplications: async (params = {}) => {
    const response = await api.get('/applications/my', { params });
    return response.data;
  },

  // Get applications for a job (employer)
  getJobApplications: async (jobId, params = {}) => {
    const response = await api.get(`/applications/job/${jobId}`, { params });
    return response.data;
  },

  // Get all applications for employer (employer)
  getEmployerApplications: async (params = {}) => {
    const response = await api.get('/applications/employer', { params });
    return response.data;
  },

  // Update application status
  updateApplicationStatus: async (applicationId, statusData) => {
    const response = await api.patch(`/applications/${applicationId}/status`, statusData);
    return response.data;
  },
};

// Saved Jobs API functions
export const savedJobAPI = {
  // Save a job
  saveJob: async (jobId, note = '') => {
    const response = await api.post(`/saved/${jobId}`, { note });
    return response.data;
  },

  // Get saved jobs
  getSavedJobs: async (params = {}) => {
    const response = await api.get('/saved', { params });
    return response.data;
  },

  // Remove saved job
  removeSavedJob: async (jobId) => {
    const response = await api.delete(`/saved/${jobId}`);
    return response.data;
  },
};

// Analytics API functions
export const analyticsAPI = {
  // Get overview metrics
  getOverview: async (range = '7d') => {
    const response = await api.get('/analytics/overview', { params: { range } });
    return response.data;
  },

  // Get timeseries data
  getTimeseries: async (metric = 'applications', range = '30d') => {
    const response = await api.get('/analytics/timeseries', { params: { metric, range } });
    return response.data;
  },

  // Get top jobs
  getTopJobs: async (limit = 5) => {
    const response = await api.get('/analytics/top-jobs', { params: { limit } });
    return response.data;
  },

  // Track event
  trackEvent: async (eventData) => {
    const response = await api.post('/analytics/event', eventData);
    return response.data;
  },
};

// Utility functions
export const authUtils = {
  // Save auth data to localStorage
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get auth data from localStorage
  getAuth: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return {
      token,
      user: user ? JSON.parse(user) : null,
    };
  },

  // Clear auth data
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },
};

export default api;
