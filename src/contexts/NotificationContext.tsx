import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

interface NotificationContextType {
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  scheduleHoroscopeNotification: (zodiac: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // 从存储中加载通知设置
  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        const savedSetting = await AsyncStorage.getItem('notificationsEnabled');
        if (savedSetting !== null) {
          setNotificationsEnabled(savedSetting === 'true');
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    };

    loadNotificationSettings();
    configureNotifications();
  }, []);

  // 配置通知
  const configureNotifications = async () => {
    // 设置通知处理程序
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // 请求通知权限
    if (Platform.OS !== 'web') {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
    }
  };

  // 保存通知设置到存储
  const saveNotificationSettings = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem('notificationsEnabled', enabled.toString());
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  // 切换通知状态
  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    saveNotificationSettings(newValue);
    
    if (newValue) {
      // 如果启用通知，请求权限
      if (Platform.OS !== 'web') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          setNotificationsEnabled(false);
          saveNotificationSettings(false);
          alert('需要通知权限才能发送每日星座运势！');
        }
      }
    } else {
      // 如果禁用通知，取消所有计划的通知
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  // 安排星座运势通知
  const scheduleHoroscopeNotification = async (zodiac: string) => {
    if (!notificationsEnabled) return;

    // 取消之前的通知
    await Notifications.cancelAllScheduledNotificationsAsync();

    // 设置每天早上8点发送通知
    const trigger = {
      hour: 8,
      minute: 0,
      repeats: true,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '每日星座运势',
        body: `查看今天${zodiac}的运势预测`,
        data: { zodiac },
      },
      trigger,
    });
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notificationsEnabled, 
        toggleNotifications,
        scheduleHoroscopeNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 