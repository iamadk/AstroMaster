import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type LanguageType = 'zh' | 'en';

interface LanguageContextType {
  language: LanguageType;
  toggleLanguage: () => void;
  setLanguage: (language: LanguageType) => void;
  t: (key: string) => string;
}

// 翻译字典
const translations: Record<string, Record<string, string>> = {
  zh: {
    // 通用
    'app.name': '星座大师',
    'app.slogan': '探索星座的奥秘',
    
    // 底部导航
    'tab.home': '首页',
    'tab.zodiacCalculator': '星座计算器',
    'tab.profile': '个人资料',
    'tab.settings': '设置',
    
    // 登录/注册
    'auth.login': '登录',
    'auth.register': '注册',
    'auth.username': '用户名',
    'auth.password': '密码',
    'auth.email': '电子邮箱',
    'auth.birthdate': '出生日期',
    'auth.forgotPassword': '忘记密码？',
    'auth.noAccount': '还没有账号？',
    'auth.hasAccount': '已有账号？',
    'auth.selectLanguage': '请选择语言',
    
    // 首页
    'home.welcome': '欢迎来到星座大师',
    'home.welcomeText': '探索星座奥秘，揭示生命密码',
    'home.yourHoroscope': '您的星座运势',
    'home.selectZodiac': '选择星座',
    'home.horoscopeTypes': '运势类型',
    'home.daily': '今日运势',
    'home.tomorrow': '明日运势',
    'home.weekly': '本周运势',
    'home.monthly': '本月运势',
    'home.yearly': '本年运势',
    'home.tip': '小贴士',
    'home.tipText': '定期查看您的星座运势，把握生活中的每一个机会！',
    
    // 星座名称
    'zodiac.aries': '白羊座',
    'zodiac.taurus': '金牛座',
    'zodiac.gemini': '双子座',
    'zodiac.cancer': '巨蟹座',
    'zodiac.leo': '狮子座',
    'zodiac.virgo': '处女座',
    'zodiac.libra': '天秤座',
    'zodiac.scorpio': '天蝎座',
    'zodiac.sagittarius': '射手座',
    'zodiac.capricorn': '摩羯座',
    'zodiac.aquarius': '水瓶座',
    'zodiac.pisces': '双鱼座',
    
    // 星座计算器
    'zodiacCalculator.title': '星座计算器',
    'zodiacCalculator.intro': '通过输入您的出生日期，我们可以计算出您的星座，并提供详细的星座信息。',
    'zodiacCalculator.selectBirthdate': '选择出生日期',
    'zodiacCalculator.clickToSelect': '点击选择日期',
    'zodiacCalculator.calculate': '计算星座',
    'zodiacCalculator.result': '计算结果',
    'zodiacCalculator.details': '详细信息',
    'zodiacCalculator.saveToProfile': '保存到个人资料',
    'zodiacCalculator.fact': '小知识',
    'zodiacCalculator.factText': '星座是根据太阳在黄道十二宫的位置来划分的。每个星座都有其独特的特质和象征意义。除了太阳星座外，还有月亮星座和上升星座，它们共同构成了一个人的星座组合。',
    
    // 星座详情属性
    'zodiac.name': '名称',
    'zodiac.nameEn': '英文名',
    'zodiac.dateRange': '日期范围',
    'zodiac.element': '元素',
    'zodiac.ruling': '主宰星',
    'zodiac.traits': '特质',
    'zodiac.strengths': '优点',
    'zodiac.weaknesses': '缺点',
    'zodiac.likes': '喜欢',
    'zodiac.dislikes': '不喜欢',
    'zodiac.description': '描述',
    
    // 星座运势内容
    'horoscope.overview': '总体运势',
    'horoscope.mood': '情绪指数',
    'horoscope.lucky_number': '幸运数字',
    'horoscope.lucky_color': '幸运颜色',
    'horoscope.work': '工作运势',
    'horoscope.love': '爱情运势',
    'horoscope.health': '健康运势',
    'horoscope.relationships': '友人关系',
    'horoscope.work_advice': '工作建议',
    'horoscope.love_advice': '爱情建议',
    'horoscope.health_advice': '健康提示',
    'horoscope.relationships_advice': '人际关系建议',
    
    // 设置
    'settings.title': '设置',
    'settings.appSettings': '应用设置',
    'settings.darkMode': '深色模式',
    'settings.darkModeDesc': '切换应用的深色/浅色主题',
    'settings.notifications': '通知',
    'settings.notificationsDesc': '接收每日星座运势推送',
    'settings.language': '语言',
    'settings.currentLanguage': '当前：',
    'settings.selectLanguage': '选择语言',
    'settings.chinese': '中文',
    'settings.english': '英文',
    'settings.confirm': '确定',
    'settings.cancel': '取消',
    
    // 数据与隐私
    'settings.dataPrivacy': '数据与隐私',
    'settings.clearCache': '清除缓存数据',
    'settings.clearCacheDesc': '清除应用缓存和搜索历史',
    'settings.privacy': '隐私政策',
    'settings.privacyDesc': '查看我们如何保护您的隐私',
    'settings.confirmClear': '确认清除数据',
    'settings.confirmClearDesc': '这将清除所有缓存的星座数据和搜索历史。此操作无法撤销。',
    
    // 关于
    'settings.about': '关于',
    'settings.aboutApp': '关于星座大师',
    'settings.version': '版本 1.0.0',
    'settings.rate': '评分',
    'settings.rateDesc': '喜欢这个应用？给我们评分吧！',
    'settings.feedback': '反馈',
    'settings.feedbackDesc': '向我们提供改进建议',
    'settings.close': '关闭',
    'settings.aboutText': '星座大师 v1.0.0\n一款专业的星座运势查询应用，为您提供每日、每周、每月和每年的星座运势预测。\n\n© 2023 星座大师团队\n保留所有权利',

    // 运势详情
    'horoscope.loading': '正在获取运势数据...',
    'horoscope.tryAgain': '重试',
    'horoscope.noData': '未找到运势数据',
    'horoscope.fetchErrorMessage': '获取运势数据失败，请稍后再试',
    'horoscope.disclaimer': '免责声明：本运势仅供娱乐参考，请理性看待。',

    // 个人资料
    'profile.personalInfo': '个人信息',
    'profile.edit': '编辑',
    'profile.save': '保存',
    'profile.logout': '退出登录',
    'profile.logoutConfirm': '确定要退出登录吗？',
    'profile.notLoggedIn': '未登录',
    'profile.zodiac': '星座',
    'profile.registrationTime': '注册时间',
    'profile.notSet': '未设置',
    'profile.unknown': '未知',
    'profile.updatedSuccess': '个人资料已更新',
    'profile.updateFailed': '更新失败，请稍后再试',
    'profile.close': '关闭',
  },
  en: {
    // General
    'app.name': 'AstroMaster',
    'app.slogan': 'Explore the mysteries of the zodiac',
    
    // Bottom Tabs
    'tab.home': 'Home',
    'tab.zodiacCalculator': 'Zodiac Calculator',
    'tab.profile': 'Profile',
    'tab.settings': 'Settings',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.email': 'Email',
    'auth.birthdate': 'Birthdate',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.hasAccount': 'Already have an account?',
    'auth.selectLanguage': 'Please select a language',
    
    // Home
    'home.welcome': 'Welcome to AstroMaster',
    'home.welcomeText': 'Explore the mysteries of the zodiac and unlock the secrets of life',
    'home.yourHoroscope': 'Your Horoscope',
    'home.selectZodiac': 'Select Zodiac',
    'home.horoscopeTypes': 'Horoscope Types',
    'home.daily': 'Today',
    'home.tomorrow': 'Tomorrow',
    'home.weekly': 'This Week',
    'home.monthly': 'This Month',
    'home.yearly': 'This Year',
    'home.tip': 'Tip',
    'home.tipText': 'Check your horoscope regularly to seize every opportunity in life!',
    
    // Zodiac Names
    'zodiac.aries': 'Aries',
    'zodiac.taurus': 'Taurus',
    'zodiac.gemini': 'Gemini',
    'zodiac.cancer': 'Cancer',
    'zodiac.leo': 'Leo',
    'zodiac.virgo': 'Virgo',
    'zodiac.libra': 'Libra',
    'zodiac.scorpio': 'Scorpio',
    'zodiac.sagittarius': 'Sagittarius',
    'zodiac.capricorn': 'Capricorn',
    'zodiac.aquarius': 'Aquarius',
    'zodiac.pisces': 'Pisces',
    
    // Zodiac Calculator
    'zodiacCalculator.title': 'Zodiac Calculator',
    'zodiacCalculator.intro': 'By entering your date of birth, we can calculate your zodiac sign and provide detailed information.',
    'zodiacCalculator.selectBirthdate': 'Select Birthdate',
    'zodiacCalculator.clickToSelect': 'Click to select a date',
    'zodiacCalculator.calculate': 'Calculate Zodiac',
    'zodiacCalculator.result': 'Result',
    'zodiacCalculator.details': 'Details',
    'zodiacCalculator.saveToProfile': 'Save to Profile',
    'zodiacCalculator.fact': 'Fun Fact',
    'zodiacCalculator.factText': 'Zodiac signs are determined by the position of the sun in the twelve houses of the zodiac. Each sign has its unique qualities and symbolic meanings. Besides the sun sign, there are also moon signs and rising signs, which together form a person\'s zodiac combination.',
    
    // Zodiac Detail Properties
    'zodiac.name': 'Name',
    'zodiac.nameEn': 'English Name',
    'zodiac.dateRange': 'Date Range',
    'zodiac.element': 'Element',
    'zodiac.ruling': 'Ruling Planet',
    'zodiac.traits': 'Traits',
    'zodiac.strengths': 'Strengths',
    'zodiac.weaknesses': 'Weaknesses',
    'zodiac.likes': 'Likes',
    'zodiac.dislikes': 'Dislikes',
    'zodiac.description': 'Description',
    
    // Horoscope Content
    'horoscope.overview': 'Overview',
    'horoscope.mood': 'Mood',
    'horoscope.lucky_number': 'Lucky Number',
    'horoscope.lucky_color': 'Lucky Color',
    'horoscope.work': 'Work',
    'horoscope.love': 'Love',
    'horoscope.health': 'Health',
    'horoscope.relationships': 'Relationships',
    'horoscope.work_advice': 'Work Advice',
    'horoscope.love_advice': 'Love Advice',
    'horoscope.health_advice': 'Health Advice',
    'horoscope.relationships_advice': 'Relationships Advice',
    
    // Settings
    'settings.title': 'Settings',
    'settings.appSettings': 'App Settings',
    'settings.darkMode': 'Dark Mode',
    'settings.darkModeDesc': 'Toggle dark/light theme',
    'settings.notifications': 'Notifications',
    'settings.notificationsDesc': 'Receive daily horoscope notifications',
    'settings.language': 'Language',
    'settings.currentLanguage': 'Current: ',
    'settings.selectLanguage': 'Select Language',
    'settings.chinese': 'Chinese',
    'settings.english': 'English',
    'settings.confirm': 'Confirm',
    'settings.cancel': 'Cancel',
    
    // Data & Privacy
    'settings.dataPrivacy': 'Data & Privacy',
    'settings.clearCache': 'Clear Cache',
    'settings.clearCacheDesc': 'Clear app cache and search history',
    'settings.privacy': 'Privacy Policy',
    'settings.privacyDesc': 'View how we protect your privacy',
    'settings.confirmClear': 'Confirm Data Clearing',
    'settings.confirmClearDesc': 'This will clear all cached horoscope data and search history. This action cannot be undone.',
    
    // About
    'settings.about': 'About',
    'settings.aboutApp': 'About AstroMaster',
    'settings.version': 'Version 1.0.0',
    'settings.rate': 'Rate',
    'settings.rateDesc': 'Like the app? Rate us!',
    'settings.feedback': 'Feedback',
    'settings.feedbackDesc': 'Send us your suggestions',
    'settings.close': 'Close',
    'settings.aboutText': 'AstroMaster v1.0.0\nA professional zodiac and horoscope app that provides daily, weekly, monthly, and yearly horoscope predictions.\n\n© 2023 AstroMaster Team\nAll rights reserved',

    // Horoscope Detail
    'horoscope.loading': 'Loading horoscope data...',
    'horoscope.tryAgain': 'Try Again',
    'horoscope.noData': 'No horoscope data found',
    'horoscope.fetchErrorMessage': 'Failed to fetch horoscope data. Please try again later.',
    'horoscope.disclaimer': 'Disclaimer: This horoscope is for entertainment purposes only. Please view it rationally.',

    // Profile
    'profile.personalInfo': 'Personal Information',
    'profile.edit': 'Edit',
    'profile.save': 'Save',
    'profile.logout': 'Log Out',
    'profile.logoutConfirm': 'Are you sure you want to log out?',
    'profile.notLoggedIn': 'Not Logged In',
    'profile.zodiac': 'Zodiac Sign',
    'profile.registrationTime': 'Registration Time',
    'profile.notSet': 'Not Set',
    'profile.unknown': 'Unknown',
    'profile.updatedSuccess': 'Profile updated successfully',
    'profile.updateFailed': 'Update failed. Please try again later.',
    'profile.close': 'Close',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>('zh');

  // 从存储中加载语言设置
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
          setLanguageState(savedLanguage as LanguageType);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };

    loadLanguage();
  }, []);

  // 保存语言设置到存储
  const saveLanguage = async (newLanguage: LanguageType) => {
    try {
      await AsyncStorage.setItem('language', newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const setLanguage = (newLanguage: LanguageType) => {
    setLanguageState(newLanguage);
    saveLanguage(newLanguage);
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLanguage);
  };

  // 翻译函数
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 