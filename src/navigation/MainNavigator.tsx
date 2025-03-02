import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// 导入屏幕
import HomeScreen from '../screens/main/HomeScreen';
import HoroscopeDetailScreen from '../screens/main/HoroscopeDetailScreen';
import ZodiacCalculatorScreen from '../screens/main/ZodiacCalculatorScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import SettingsScreen from '../screens/main/SettingsScreen';

// 导入认证屏幕
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { useAuth } from '../contexts/AuthContext';

// 定义导航参数类型
export type MainStackParamList = {
  MainTabs: undefined;
  HoroscopeDetail: {
    zodiac: string;
    type: string;
    date: string;
  };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  ZodiacCalculator: undefined;
  Profile: undefined;
  Settings: undefined;
};

// 创建导航器
const MainStack = createNativeStackNavigator<MainStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// 主标签导航
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ZodiacCalculator"
        component={ZodiacCalculatorScreen}
        options={{
          tabBarLabel: '星座计算',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="star-circle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '个人',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: '设置',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// 认证导航
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

// 主导航
const MainNavigator = () => {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <MainStack.Navigator
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#6200ee',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <MainStack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="HoroscopeDetail"
            component={HoroscopeDetailScreen}
            options={({ route }) => ({
              title: `${route.params.zodiac}运势`,
            })}
          />
        </MainStack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </>
  );
};

export default MainNavigator; 