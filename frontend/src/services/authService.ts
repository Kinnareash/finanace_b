export const deleteAccount = async (token: string): Promise<void> => {
  try {
    await api.delete('/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete account');
  }
};
import { User } from '../types';
import { api } from './axios';

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const data = response.data as { token: string };
    return {
      token: data.token,
      message: 'Login successful'
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    const data = response.data as { token: string; message: string };
    return {
      token: data.token,
      message: data.message
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const getProfile = async (token: string): Promise<User> => {
  try {
    const response = await api.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as User;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

export const updateProfile = async (token: string, updates: { name: string; email: string }): Promise<User> => {
  try {
    const response = await api.put('/users/profile', updates, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as User;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Health check function to test backend connectivity
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Backend is not accessible');
  }
};