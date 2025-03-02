import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser, logoutUser } from '../services/authService';

// 用户类型定义
export interface User {
  id: string;
  username: string;
  email?: string;
  birthdate?: string;
  zodiac?: string;
  created_at?: string;
  password?: string; // 仅用于重新登录，不应存储
}

// 认证上下文类型定义
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化时从存储中加载用户数据
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // 保存用户数据到存储
  const saveUser = async (userData: User | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // 登录函数
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await loginUser(username, password);
      // 保存密码以便需要时重新登录（例如更新用户资料后）
      userData.password = password;
      setUser(userData);
      await saveUser(userData);
    } catch (error) {
      setError(error instanceof Error ? error.message : '登录失败');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 注册函数
  const register = async (username: string, password: string, email?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await registerUser(username, password, email);
      // 保存密码以便需要时重新登录
      userData.password = password;
      setUser(userData);
      await saveUser(userData);
    } catch (error) {
      setError(error instanceof Error ? error.message : '注册失败');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出函数
  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setUser(null);
      await saveUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 清除错误
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 自定义钩子，用于访问认证上下文
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 