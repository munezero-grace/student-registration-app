import api from './api';

// Simple cache implementation to reduce duplicate API calls
interface Cache {
  [key: string]: {
    data: any;
    timestamp: number;
  };
}

// Cache expiration time in milliseconds (5 seconds)
const CACHE_EXPIRATION = 5000;

// In-memory cache
const apiCache: Cache = {};

// Helper function to generate cache key from params
const generateCacheKey = (endpoint: string, params?: any): string => {
  return `${endpoint}:${params ? JSON.stringify(params) : ''}`;
};

// Helper function to check if cache entry is valid
const isCacheValid = (cacheKey: string): boolean => {
  if (!apiCache[cacheKey]) return false;
  
  const now = Date.now();
  const timestamp = apiCache[cacheKey].timestamp;
  return now - timestamp < CACHE_EXPIRATION;
};

// Helper function to get data from cache
const getFromCache = (cacheKey: string): any => {
  return apiCache[cacheKey]?.data;
};

// Helper function to set data in cache
const setInCache = (cacheKey: string, data: any): void => {
  apiCache[cacheKey] = {
    data,
    timestamp: Date.now()
  };
};

// Helper function to clear specific cache entries
const clearCache = (keyPattern?: string): void => {
  if (keyPattern) {
    // Clear specific cache entries matching the pattern
    Object.keys(apiCache).forEach(key => {
      if (key.includes(keyPattern)) {
        delete apiCache[key];
      }
    });
  } else {
    // Clear all cache
    Object.keys(apiCache).forEach(key => {
      delete apiCache[key];
    });
  }
};

// Type definitions for user data
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  dateOfBirth: string;
  role: 'admin' | 'student';
  createdAt: string;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  role?: 'admin' | 'student';
}

// API service for user management
export const userService = {
  // Get all users with optional pagination and filtering
  getAll: async (params: PaginationParams = {}) => {
    try {
      // Check for token first
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token missing');
        throw new Error('Please login to access this feature');
      }
      
      // Generate cache key for this request
      const cacheKey = generateCacheKey('/admin/users', params);
      
      // Check if we have a valid cached response
      if (isCacheValid(cacheKey)) {
        console.log('Using cached data for users list');
        return getFromCache(cacheKey);
      }
      
      // If no valid cache, make the API call
      try {
        const response = await api.get('/admin/users', { params });
        console.log('Fetched users from API:', response.data);
        
        // Cache the response
        setInCache(cacheKey, response.data);
        
        return response.data;
      } catch (apiError) {
        console.warn('API call failed, falling back to mock data:', apiError);

        // If the real API fails, use the mock data from authService as fallback
        // This is just for development purposes
        const { getAllUsers } = await import('./authService');
        const users = await getAllUsers();
        console.log('Using mock users data:', users);
        
        // Cache the mock response
        setInCache(cacheKey, users);
        
        return users;
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get a single user by ID
  getById: async (id: string) => {
    try {
      // Check for token first
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token missing');
        throw new Error('Please login to access this feature');
      }
      
      // Generate cache key
      const cacheKey = generateCacheKey(`/admin/users/${id}`);
      
      // Check cache
      if (isCacheValid(cacheKey)) {
        console.log('Using cached data for user', id);
        return getFromCache(cacheKey);
      }
      
      try {
        const response = await api.get(`/admin/users/${id}`);
        
        // Cache the response
        setInCache(cacheKey, response.data);
        
        return response.data;
      } catch (apiError) {
        console.warn(`API call to get user ${id} failed, using mock data:`, apiError);
        
        // If the real API fails, use mock data
        const { getAllUsers } = await import('./authService');
        const users = await getAllUsers();
        const user = users.find(u => u.id === id);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // Cache the mock response
        setInCache(cacheKey, user);
        
        return user;
      }
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  // Update a user
  update: async (id: string, userData: UpdateUserData) => {
    try {
      // Check for token first
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token missing');
        throw new Error('Please login to access this feature');
      }
      
      try {
        const response = await api.put(`/admin/users/${id}`, userData);
        
        // Clear relevant caches after update
        clearCache('/admin/users');
        clearCache(`/admin/users/${id}`);
        
        return response.data;
      } catch (apiError) {
        console.warn(`API call to update user ${id} failed, using mock:`, apiError);
        
        // If the real API fails, use mock implementation
        const { updateUser } = await import('./authService');
        const result = await updateUser(id, userData);
        
        // Clear caches after update
        clearCache('/admin/users');
        clearCache(`/admin/users/${id}`);
        
        return result;
      }
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  // Delete a user
  delete: async (id: string) => {
    try {
      // Check for token first
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token missing');
        throw new Error('Please login to access this feature');
      }
      
      try {
        const response = await api.delete(`/admin/users/${id}`);
        
        // Clear relevant caches after deletion
        clearCache('/admin/users');
        clearCache(`/admin/users/${id}`);
        
        return response.data;
      } catch (apiError) {
        console.warn(`API call to delete user ${id} failed, using mock:`, apiError);
        
        // If the real API fails, use mock implementation
        const { deleteUser } = await import('./authService');
        const result = await deleteUser(id);
        
        // Clear caches after deletion
        clearCache('/admin/users');
        clearCache(`/admin/users/${id}`);
        
        return result;
      }
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },
  
  // Method to manually clear the cache
  clearCache: () => {
    clearCache();
    console.log('API cache cleared');
  }
};

export default userService;