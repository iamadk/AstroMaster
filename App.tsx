import React, { useEffect } from 'react';
import './src/utils/cryptoPolyfill'; // Import the polyfill first
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import MainNavigator from './src/navigation/MainNavigator';
import { initDatabase } from './src/services/authService';
import { initHoroscopeDatabase } from './src/services/horoscopeService';
import { useColorScheme } from 'react-native';
import LanguageFirstCheck from './src/components/LanguageFirstCheck';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 定义自定义亮色主题
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#000000',
    accent: '#ff6f00', // 添加强调色
    onSurface: '#333333',
    cardBackground: '#ffffff',
    tipCardBackground: '#fff8e1',
    tipCardTitle: '#ff6f00',
    tipCardText: '#333333',
    welcomeCardBackground: '#6200ee',
    welcomeCardText: '#ffffff',
  },
};

// 定义自定义深色主题
const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#bb86fc',
    secondary: '#03dac6',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    accent: '#ffb74d', // 添加强调色
    onSurface: '#e0e0e0',
    cardBackground: '#2d2d2d',
    tipCardBackground: '#2e2416', // 暗色版提示卡片背景
    tipCardTitle: '#ffb74d',     // 暗色版提示卡片标题
    tipCardText: '#e0e0e0',       // 暗色版提示卡片文本
    welcomeCardBackground: '#4f2ca8', // 暗色版欢迎卡片
    welcomeCardText: '#ffffff',
  },
};

// 添加一个包装组件来应用主题
const ThemedApp = () => {
  const { theme } = useTheme();
  const paperTheme = theme === 'dark' ? darkTheme : lightTheme;
  
  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <PaperProvider theme={paperTheme}>
        <NavigationContainer theme={theme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme}>
          <AuthProvider>
            <NotificationProvider>
              <LanguageFirstCheck />
              <MainNavigator />
            </NotificationProvider>
          </AuthProvider>
        </NavigationContainer>
      </PaperProvider>
    </>
  );
};

// 为 React Navigation 定义主题
const NavigationDefaultTheme = {
  dark: false,
  colors: {
    primary: '#6200ee',
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#000000',
    border: '#d1d1d1',
    notification: '#ff3b30',
  },
};

const NavigationDarkTheme = {
  dark: true,
  colors: {
    primary: '#bb86fc',
    background: '#121212',
    card: '#2d2d2d',
    text: '#ffffff',
    border: '#383838',
    notification: '#ff453a',
  },
};

export default function App() {
  // 初始化数据库
  useEffect(() => {
    const setupDatabases = async () => {
      try {
        await initDatabase();
        await initHoroscopeDatabase();
        console.log('Databases initialized successfully');
      } catch (error) {
        console.error('Error initializing databases:', error);
      }
    };

    setupDatabases();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <ThemedApp />
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
} 