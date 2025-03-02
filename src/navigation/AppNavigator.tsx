import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

// 导入屏幕
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/main/HomeScreen';
import HoroscopeDetailScreen from '../screens/main/HoroscopeDetailScreen';
import ZodiacCalculatorScreen from '../screens/main/ZodiacCalculatorScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import LoadingScreen from '../screens/LoadingScreen';

// 定义导航类型
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  ZodiacCalculator: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  HoroscopeDetail: {
    zodiac: string;
    type: 'daily' | 'tomorrow' | 'weekly' | 'monthly' | 'yearly';
    date: string;
  };
};

// 创建导航器
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

// 认证导航
const AuthNavigator = () => {
  const { t } = useLanguage();
  
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: t('auth.login') }} />
      <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: t('auth.register') }} />
    </AuthStack.Navigator>
  );
};

// 主标签导航
const MainTabNavigator = () => {
  const { t, language } = useLanguage();
  
  // 添加一个状态触发导航栏更新的效果
  React.useEffect(() => {
    // 这个空的 useEffect 依赖于 language 会在语言变化时重新渲染组件
  }, [language]);
  
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ios-home';

          if (route.name === 'Home') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'ZodiacCalculator') {
            iconName = focused ? 'ios-calculator' : 'ios-calculator-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'ios-person' : 'ios-person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        // 确保每次重新渲染时都更新标签名称
        tabBarLabel: () => {
          if (route.name === 'Home') {
            return t('tab.home');
          } else if (route.name === 'ZodiacCalculator') {
            return t('tab.zodiacCalculator');
          } else if (route.name === 'Profile') {
            return t('tab.profile');
          }
          return route.name;
        },
      })}
    >
      <MainTab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          headerTitle: t('tab.home'),
        }}
      />
      <MainTab.Screen 
        name="ZodiacCalculator" 
        component={ZodiacCalculatorScreen} 
        options={{ 
          headerTitle: t('tab.zodiacCalculator'),
        }}
      />
      <MainTab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          headerTitle: t('tab.profile'),
        }}
      />
    </MainTab.Navigator>
  );
};

// 主导航
const MainNavigator = () => {
  const { t } = useLanguage();
  
  // 星座的key列表
  const zodiacKeys = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];

  // 中文星座列表(为了保持后端兼容性)
  const chineseZodiacs = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];

  // 获取星座的翻译名称
  const getTranslatedZodiacName = (zodiacName: string): string => {
    const index = chineseZodiacs.indexOf(zodiacName);
    if (index !== -1) {
      return t(`zodiac.${zodiacKeys[index]}`);
    }
    return zodiacName;
  };
  
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="HoroscopeDetail"
        component={HoroscopeDetailScreen}
        options={({ route }: any) => {
          const params = route.params;
          const typeKey = params.type === 'daily' 
            ? 'daily' 
            : params.type === 'tomorrow' 
              ? 'tomorrow' 
              : params.type === 'weekly' 
                ? 'weekly' 
                : params.type === 'monthly' 
                  ? 'monthly' 
                  : 'yearly';
          
          // 星座译名和运势类型都使用翻译
          return {
            title: `${getTranslatedZodiacName(params.zodiac)} ${t(`home.${typeKey}`)}`
          }
        }}
      />
    </RootStack.Navigator>
  );
};

// 应用导航
const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator; 