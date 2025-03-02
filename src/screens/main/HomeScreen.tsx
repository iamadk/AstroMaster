import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, useColorScheme } from 'react-native';
import { Text, Card, Title, Paragraph, IconButton, Avatar, useTheme as usePaperTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../../navigation/AppNavigator';
import { useAuth } from '../../contexts/AuthContext';
import { getHoroscope } from '../../services/horoscopeService';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { HoroscopeParams } from '../../types/horoscope';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

// 星座的key列表
const zodiacKeys = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

// 中文星座列表(为了保持后端兼容性)
const chineseZodiacs = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];

// 星座图标
const zodiacIcons = {
  aries: 'zodiac-aries',
  taurus: 'zodiac-taurus',
  gemini: 'zodiac-gemini',
  cancer: 'zodiac-cancer',
  leo: 'zodiac-leo',
  virgo: 'zodiac-virgo',
  libra: 'zodiac-libra',
  scorpio: 'zodiac-scorpio',
  sagittarius: 'zodiac-sagittarius',
  capricorn: 'zodiac-capricorn',
  aquarius: 'zodiac-aquarius',
  pisces: 'zodiac-pisces'
};

// 运势类型
const horoscopeTypes = [
  { id: 'daily', type: 'daily' as const, date: new Date().toISOString().split('T')[0], icon: 'calendar-today' },
  { id: 'tomorrow', type: 'daily' as const, date: new Date(Date.now() + 86400000).toISOString().split('T')[0], icon: 'calendar-arrow-right' },
  { id: 'weekly', type: 'weekly' as const, date: new Date().toISOString().split('T')[0], icon: 'calendar-week' },
  { id: 'monthly', type: 'monthly' as const, date: new Date().toISOString().split('T')[0], icon: 'calendar-month' },
  { id: 'yearly', type: 'yearly' as const, date: new Date().toISOString().split('T')[0], icon: 'calendar-star' }
];

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [selectedZodiac, setSelectedZodiac] = useState<string | null>(user?.zodiac || null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const paperTheme = usePaperTheme();
  const { t } = useLanguage();
  const colorScheme = useColorScheme();
  
  // 判断是否是深色模式
  const isDarkMode = theme === 'dark';

  // 预加载用户星座的每日运势
  useEffect(() => {
    if (user?.zodiac) {
      preloadHoroscope(user.zodiac);
    }
  }, [user?.zodiac]);

  const preloadHoroscope = async (zodiac: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await getHoroscope(zodiac, 'daily' as const, today);
    } catch (error) {
      console.error('预加载运势失败:', error);
    }
  };

  const navigateToHoroscope = async (type: 'daily' | 'weekly' | 'monthly' | 'yearly', date: string) => {
    if (!selectedZodiac) return;
    
    setIsLoading(true);
    try {
      await getHoroscope(selectedZodiac, type, date);
      
      navigation.navigate('HoroscopeDetail', {
        zodiac: selectedZodiac,
        type,
        date
      });
    } catch (error) {
      console.error('获取运势失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeLabel = (id: string): string => {
    return t(`home.${id}`);
  };

  // 获取星座的翻译名称
  const getTranslatedZodiacName = (index: number): string => {
    return t(`zodiac.${zodiacKeys[index]}`);
  };

  // 将翻译名称映射回中文名称(为了保持后端兼容性)
  const getChineseZodiacName = (translatedName: string): string => {
    const index = zodiacKeys.findIndex(key => t(`zodiac.${key}`) === translatedName);
    return index !== -1 ? chineseZodiacs[index] : translatedName;
  };

  // 动态获取颜色
  const getThemeColors = () => {
    return {
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
      cardBackground: isDarkMode ? '#1e1e1e' : 'white',
      primaryColor: paperTheme.colors.primary,
      primaryLight: isDarkMode ? '#3a2c6e' : '#f0e6ff',
      textColor: isDarkMode ? '#e0e0e0' : '#333333',
      borderColor: isDarkMode ? '#333333' : '#e0e0e0',
      welcomeCardColor: isDarkMode ? '#3a2c6e' : '#6200ee',
      selectedItemColor: isDarkMode ? '#8464ff' : '#6200ee',
      iconColor: isDarkMode ? paperTheme.colors.primary : '#6200ee',
    };
  };

  const themeColors = getThemeColors();

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.backgroundColor }]}>
      {/* 欢迎卡片 */}
      <Card style={[styles.welcomeCard, { backgroundColor: themeColors.welcomeCardColor }]}>
        <Card.Content>
          <Title style={styles.welcomeTitle}>{t('home.welcome')}</Title>
          <Paragraph style={styles.welcomeText}>{t('home.welcomeText')}</Paragraph>
        </Card.Content>
      </Card>

      {/* 星座选择 */}
      <Card style={[styles.card, { backgroundColor: themeColors.cardBackground }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: themeColors.textColor }]}>{t('home.selectZodiac')}</Title>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.zodiacScrollContent}
          >
            <View style={styles.zodiacContainer}>
              {zodiacKeys.map((key, index) => {
                const translatedName = t(`zodiac.${key}`);
                const isSelected = selectedZodiac === chineseZodiacs[index];
                
                return (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.zodiacItem,
                      { 
                        backgroundColor: isSelected 
                          ? themeColors.selectedItemColor 
                          : themeColors.cardBackground,
                        borderColor: isSelected 
                          ? themeColors.selectedItemColor 
                          : themeColors.borderColor 
                      }
                    ]}
                    onPress={() => setSelectedZodiac(chineseZodiacs[index])}
                  >
                    <MaterialCommunityIcons 
                      name={zodiacIcons[key as keyof typeof zodiacIcons] as any} 
                      size={36} 
                      color={isSelected ? 'white' : themeColors.iconColor} 
                    />
                    <Text 
                      style={[
                        styles.zodiacText,
                        { 
                          color: isSelected ? 'white' : themeColors.textColor 
                        }
                      ]}
                    >
                      {translatedName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </Card.Content>
      </Card>

      {/* 运势类型选择 */}
      {selectedZodiac && (
        <Card style={[styles.card, { backgroundColor: themeColors.cardBackground }]}>
          <Card.Content>
            <View style={styles.cardHeaderContainer}>
              <Title style={[styles.sectionTitle, { color: themeColors.textColor }]}>{t('home.horoscopeTypes')}</Title>
              {selectedZodiac && (
                <View style={[styles.selectedZodiacBadge, { backgroundColor: themeColors.selectedItemColor }]}>
                  <MaterialCommunityIcons 
                    name={zodiacIcons[zodiacKeys[chineseZodiacs.indexOf(selectedZodiac)] as keyof typeof zodiacIcons] as any} 
                    size={20} 
                    color="white" 
                  />
                  <Text style={styles.selectedZodiacBadgeText}>
                    {getTranslatedZodiacName(chineseZodiacs.indexOf(selectedZodiac))}
                  </Text>
                </View>
              )}
            </View>
            
            {isLoading ? (
              <ActivityIndicator size="large" color={paperTheme.colors.primary} style={{ marginVertical: 20 }} />
            ) : (
              <View style={styles.horoscopeTypesContainer}>
                {horoscopeTypes.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.horoscopeTypeButton, 
                      { 
                        backgroundColor: themeColors.cardBackground,
                        borderColor: themeColors.borderColor 
                      }
                    ]}
                    onPress={() => navigateToHoroscope(item.type, item.date)}
                  >
                    <Avatar.Icon 
                      size={40} 
                      icon={item.icon} 
                      style={[styles.horoscopeTypeIcon, { backgroundColor: themeColors.primaryLight }]} 
                      color={themeColors.iconColor}
                    />
                    <Text style={[styles.horoscopeTypeText, { color: themeColors.textColor }]}>
                      {getTypeLabel(item.id)}
                    </Text>
                    <IconButton 
                      icon="chevron-right" 
                      size={24} 
                      iconColor={themeColors.iconColor}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      {/* 小贴士 */}
      <Card style={[styles.card, { backgroundColor: themeColors.cardBackground }]}>
        <Card.Content>
          <View style={styles.tipHeaderContainer}>
            <Avatar.Icon 
              size={40} 
              icon="lightbulb-outline" 
              style={[styles.tipIcon, { backgroundColor: isDarkMode ? '#5d4e14' : '#FFF8E1' }]} 
              color="#FFC107"
            />
            <Title style={[styles.tipTitle, { color: themeColors.textColor }]}>{t('home.tip')}</Title>
          </View>
          <Paragraph style={[styles.tipText, { color: themeColors.textColor }]}>{t('home.tipText')}</Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 22,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  zodiacScrollContent: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  zodiacContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  zodiacItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 90,
    margin: 6,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
  },
  selectedZodiacItem: {
    elevation: 5,
  },
  zodiacText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  selectedZodiacText: {
    fontWeight: 'bold',
  },
  cardHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedZodiacBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedZodiacBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  horoscopeTypesContainer: {
    marginTop: 8,
  },
  horoscopeTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  horoscopeTypeIcon: {
    marginRight: 12,
  },
  horoscopeTypeText: {
    flex: 1,
    fontSize: 16,
  },
  tipHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIcon: {
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tipText: {
    fontSize: 16,
    lineHeight: 22,
    paddingLeft: 52,
  },
});

export default HomeScreen; 