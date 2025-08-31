import { User } from '../types';

const API_BASE = 'http://localhost:5000/api';

// Mock implementation with dummy data for demonstration
export const login = async (email: string, password: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === 'demo@example.com' && password === 'password') {
    return {
      token: 'mock-jwt-token-12345',
      message: 'Login successful'
    };
  }
  throw new Error('Invalid credentials');
};

export const register = async (name: string, email: string, password: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    token: 'mock-jwt-token-12345',
    message: 'User registered successfully'
  };
};

export const getProfile = async (token: string): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: '68b33fdd626e92ca674c7734',
    name: 'John Doe',
    email: 'demo@example.com',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  };
};

// Real API implementation (commented out for demo)
/*
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
};

export const register = async (name: string, email: string, password: string) => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });
  
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  
  return response.json();
};

export const getProfile = async (token: string): Promise<User> => {
  const response = await fetch(`${API_BASE}/users/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
};
*/