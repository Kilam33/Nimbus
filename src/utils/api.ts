// src/utils/api.ts
//import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = 'http://localhost:3000/api';
const DEFAULT_TIMEOUT = 10000; // 10 seconds

// Define response type for type safety
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export const api = {
  async get<T = any>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const token = localStorage.getItem('token');
    
    // Token verification
    if (!token) {
      throw new Error('Authentication token missing');
    }
    
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    
    // Add timeout handling with AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}${queryString}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      // Handle specific status codes
      if (response.status === 401 || response.status === 403) {
        // Handle authentication errors
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login
        throw new Error('Authentication failed. Please login again.');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  },
  
  async post<T = any>(endpoint: string, data: any): Promise<T> {
    const token = localStorage.getItem('token');
    
    // Token verification
    if (!token) {
      throw new Error('Authentication token missing');
    }
    
    // Add timeout handling with AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      
      // Handle specific status codes
      if (response.status === 401 || response.status === 403) {
        // Handle authentication errors
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login
        throw new Error('Authentication failed. Please login again.');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  },
  
  async put<T = any>(endpoint: string, data: any): Promise<T> {
    const token = localStorage.getItem('token');
    
    // Token verification
    if (!token) {
      throw new Error('Authentication token missing');
    }
    
    // Add timeout handling with AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      
      // Handle specific status codes
      if (response.status === 401 || response.status === 403) {
        // Handle authentication errors
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login
        throw new Error('Authentication failed. Please login again.');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  },
  
  async delete<T = any>(endpoint: string): Promise<T> {
    const token = localStorage.getItem('token');
    
    // Token verification
    if (!token) {
      throw new Error('Authentication token missing');
    }
    
    // Add timeout handling with AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      // Handle specific status codes
      if (response.status === 401 || response.status === 403) {
        // Handle authentication errors
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login
        throw new Error('Authentication failed. Please login again.');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  },
};