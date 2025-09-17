import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    emailUpdates: boolean;
    timezone: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

// Mock user data for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@electricitytracker.com',
    name: 'Demo User',
    avatar: '/avatars/demo.jpg',
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date(),
    preferences: {
      theme: 'system',
      notifications: true,
      emailUpdates: true,
      timezone: 'Europe/London'
    }
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock authentication
          const user = mockUsers.find(u => u.email === email);
          if (!user || password !== 'demo123') {
            throw new Error('Invalid email or password');
          }
          
          const updatedUser = {
            ...user,
            lastLoginAt: new Date()
          };
          
          set({
            user: updatedUser,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed'
          });
        }
      },

      register: async (email: string, _password: string, name: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user already exists
          const existingUser = mockUsers.find(u => u.email === email);
          if (existingUser) {
            throw new Error('User with this email already exists');
          }
          
          // Create new user
          const newUser: User = {
            id: Date.now().toString(),
            email,
            name,
            createdAt: new Date(),
            lastLoginAt: new Date(),
            preferences: {
              theme: 'system',
              notifications: true,
              emailUpdates: true,
              timezone: 'Europe/London'
            }
          };
          
          mockUsers.push(newUser);
          
          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed'
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      },

      updateProfile: async (updates: Partial<User>) => {
        const { user } = get();
        if (!user) return;
        
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedUser = { ...user, ...updates };
          
          // Update in mock data
          const userIndex = mockUsers.findIndex(u => u.id === user.id);
          if (userIndex !== -1) {
            mockUsers[userIndex] = updatedUser;
          }
          
          set({
            user: updatedUser,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Profile update failed'
          });
        }
      },

      changePassword: async (currentPassword: string, _newPassword: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock password validation
          if (currentPassword !== 'demo123') {
            throw new Error('Current password is incorrect');
          }
          
          set({
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Password change failed'
          });
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user exists
          const user = mockUsers.find(u => u.email === email);
          if (!user) {
            throw new Error('No account found with this email address');
          }
          
          set({
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Password reset failed'
          });
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'electricity-tracker-auth-storage',
      version: 1,
      // Only persist user and isAuthenticated, not loading states
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
