import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Share, ActivityIndicator, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Text, Card, Title, Paragraph, Button, IconButton, Divider, Avatar, useTheme as usePaperTheme } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTheme } from '../../contexts/ThemeContext';
import { getHoroscope } from '../../services/horoscopeService';
import { HoroscopeData } from '../../types/horoscope';
import { useLanguage } from '../../contexts/LanguageContext';

type HoroscopeDetailRouteProp = RouteProp<RootStackParamList, 'HoroscopeDetail'>;
type HoroscopeDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HoroscopeDetail'>;

interface HoroscopeDetailProps {
  route: HoroscopeDetailRouteProp;
  navigation: HoroscopeDetailNavigationProp;
}

// 星座的key列表
const zodiacKeys = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

// 中文星座列表(为了与后端API保持兼容)
const chineseZodiacs = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];

const HoroscopeDetailScreen: React.FC<HoroscopeDetailProps> = ({ route, navigation }) => {
  const { zodiac, type, date } = route.params;
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const paperTheme = usePaperTheme();
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchHoroscope();
  }, [zodiac, type, date]);

  const fetchHoroscope = async () => {
    setLoading(true);
    setError(null);
    try {
      const horoscopeData = await getHoroscope(zodiac, type, date);
      setHoroscope(horoscopeData);
    } catch (err) {
      console.error('Error fetching horoscope:', err);
      setError(t('horoscope.fetchErrorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (typeId: string): string => {
    const types: Record<string, string> = {
      'daily': t('home.daily'),
      'tomorrow': t('home.tomorrow'),
      'weekly': t('home.weekly'),
      'monthly': t('home.monthly'),
      'yearly': t('home.yearly')
    };
    return types[typeId] || typeId;
  };

  // 获取星座的翻译名称
  const getTranslatedZodiacName = (zodiacName: string): string => {
    const index = chineseZodiacs.indexOf(zodiacName);
    if (index !== -1) {
      return t(`zodiac.${zodiacKeys[index]}`);
    }
    return zodiacName;
  };

  const handleShare = async () => {
    if (!horoscope) return;

    try {
      const formattedDate = new Date(date).toLocaleDateString();
      const translatedZodiac = getTranslatedZodiacName(zodiac);
      
      const message = `${translatedZodiac} ${getTypeLabel(type)} (${formattedDate})\n\n` +
        `${t('horoscope.overview')}: ${horoscope.overview || horoscope.work}\n` +
        `${t('horoscope.mood')}: ${horoscope.mood}\n` +
        `${t('horoscope.lucky_number')}: ${horoscope.lucky_number}\n` +
        `${t('horoscope.lucky_color')}: ${horoscope.lucky_color}\n\n` +
        `${t('horoscope.work')}: ${horoscope.work_advice || horoscope.work}\n` +
        `${t('horoscope.love')}: ${horoscope.love_advice || horoscope.love}\n` +
        `${t('horoscope.health')}: ${horoscope.health_advice || horoscope.health}\n` +
        ((horoscope.relationships_advice || horoscope.relationships) ? 
          `${t('horoscope.relationships')}: ${horoscope.relationships_advice || horoscope.relationships}\n\n` : '\n') +
        `- ${t('app.name')}`;

      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Error sharing horoscope:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={paperTheme.colors.primary} />
        <Text style={{ marginTop: 20 }}>{t('horoscope.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          onPress={fetchHoroscope} 
          style={{ marginTop: 20 }}
        >
          {t('horoscope.tryAgain')}
        </Button>
      </View>
    );
  }

  if (!horoscope) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{t('horoscope.noData')}</Text>
      </View>
    );
  }

  // 确保所有字段都有值
  const safeHoroscope = {
    ...horoscope,
    overview: horoscope.overview || horoscope.work || '',
    work_advice: horoscope.work_advice || horoscope.work || '',
    love_advice: horoscope.love_advice || horoscope.love || '',
    health_advice: horoscope.health_advice || horoscope.health || '',
    relationships_advice: horoscope.relationships_advice || horoscope.relationships || ''
  };

  const translatedZodiac = getTranslatedZodiacName(zodiac);

  // 颜色映射表
  const colorMapping: Record<string, { light: string, dark: string }> = {
    // 中文颜色映射
    '红色': { light: '#ffcccc', dark: '#661a1a' },
    '蓝色': { light: '#cce5ff', dark: '#1a3d66' },
    '绿色': { light: '#ccffcc', dark: '#1a661a' },
    '黄色': { light: '#ffffcc', dark: '#666600' },
    '紫色': { light: '#e5ccff', dark: '#4d1a66' },
    '橙色': { light: '#ffe5cc', dark: '#663d1a' },
    '粉色': { light: '#ffcce5', dark: '#661a4d' },
    '白色': { light: '#f2f2f2', dark: '#4d4d4d' },
    '黑色': { light: '#d9d9d9', dark: '#1a1a1a' },
    '棕色': { light: '#e5d9cc', dark: '#4d3319' },
    '灰色': { light: '#e6e6e6', dark: '#333333' },
    '金色': { light: '#fff0cc', dark: '#665a1a' },
    '银色': { light: '#f2f2f2', dark: '#4d4d4d' },
    // 英文颜色映射
    'red': { light: '#ffcccc', dark: '#661a1a' },
    'blue': { light: '#cce5ff', dark: '#1a3d66' },
    'green': { light: '#ccffcc', dark: '#1a661a' },
    'yellow': { light: '#ffffcc', dark: '#666600' },
    'purple': { light: '#e5ccff', dark: '#4d1a66' },
    'orange': { light: '#ffe5cc', dark: '#663d1a' },
    'pink': { light: '#ffcce5', dark: '#661a4d' },
    'white': { light: '#f2f2f2', dark: '#4d4d4d' },
    'black': { light: '#d9d9d9', dark: '#1a1a1a' },
    'brown': { light: '#e5d9cc', dark: '#4d3319' },
    'grey': { light: '#e6e6e6', dark: '#333333' },
    'gray': { light: '#e6e6e6', dark: '#333333' },
    'gold': { light: '#fff0cc', dark: '#665a1a' },
    'silver': { light: '#f2f2f2', dark: '#4d4d4d' },
  };

  const getLuckyColorBackground = (colorName: string): string => {
    for (const [key, value] of Object.entries(colorMapping)) {
      if (colorName.toLowerCase().includes(key.toLowerCase())) {
        return theme === 'dark' ? value.dark : value.light;
      }
    }
    return theme === 'dark' ? '#333333' : '#f2f2f2'; // 默认颜色
  };

  const getLuckyColorTextColor = (colorName: string): string => {
    // 根据背景色确定文本颜色，在深色模式下使用浅色文本，在浅色模式下使用深色文本
    return theme === 'dark' ? '#ffffff' : '#000000';
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={[styles.headerCard, { backgroundColor: paperTheme.colors.primary }]}>
        <Card.Content style={styles.headerContent}>
          <View style={styles.zodiacHeader}>
            <Title style={styles.zodiacTitle}>{translatedZodiac}</Title>
            <Text style={styles.dateText}>
              {getTypeLabel(type)} • {new Date(date).toLocaleDateString()}
            </Text>
          </View>
          <IconButton
            icon="share-variant"
            iconColor="white"
            size={24}
            onPress={handleShare}
            style={styles.shareButton}
          />
        </Card.Content>
      </Card>

      <Card style={styles.contentCard}>
        <Card.Content>
          <View style={styles.sectionContainer}>
            <Avatar.Icon size={36} icon="star" style={styles.sectionIcon} />
            <View style={styles.sectionTextContainer}>
              <Title style={styles.sectionTitle}>{t('horoscope.overview')}</Title>
              <Paragraph style={styles.sectionContent}>{safeHoroscope.overview}</Paragraph>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.sectionContainer}>
            <Avatar.Icon size={36} icon="emoticon" style={styles.sectionIcon} />
            <View style={styles.sectionTextContainer}>
              <Title style={styles.sectionTitle}>{t('horoscope.mood')}</Title>
              <Paragraph style={styles.sectionContent}>{safeHoroscope.mood}</Paragraph>
            </View>
          </View>

          <View style={styles.luckyItemsContainer}>
            <View style={styles.luckyItem}>
              <Text style={styles.luckyLabel}>{t('horoscope.lucky_number')}</Text>
              <Text style={styles.luckyValue}>{safeHoroscope.lucky_number}</Text>
            </View>
            <View style={styles.luckyItem}>
              <Text style={styles.luckyLabel}>{t('horoscope.lucky_color')}</Text>
              <Text 
                style={[
                  styles.luckyValue, 
                  { 
                    backgroundColor: getLuckyColorBackground(safeHoroscope.lucky_color), 
                    color: getLuckyColorTextColor(safeHoroscope.lucky_color),
                    paddingHorizontal: 10, 
                    paddingVertical: 3,
                    borderRadius: 4,
                    overflow: 'hidden',
                    fontWeight: 'bold'
                  }
                ]}
              >
                {safeHoroscope.lucky_color}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.sectionContainer}>
            <Avatar.Icon size={36} icon="briefcase" style={styles.sectionIcon} />
            <View style={styles.sectionTextContainer}>
              <Title style={styles.sectionTitle}>{t('horoscope.work')}</Title>
              <Paragraph style={styles.sectionContent}>{safeHoroscope.work_advice}</Paragraph>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.sectionContainer}>
            <Avatar.Icon size={36} icon="heart" style={styles.sectionIcon} />
            <View style={styles.sectionTextContainer}>
              <Title style={styles.sectionTitle}>{t('horoscope.love')}</Title>
              <Paragraph style={styles.sectionContent}>{safeHoroscope.love_advice}</Paragraph>
            </View>
          </View>

          {safeHoroscope.relationships_advice && (
            <>
              <Divider style={styles.divider} />

              <View style={styles.sectionContainer}>
                <Avatar.Icon size={36} icon="account-group" style={styles.sectionIcon} />
                <View style={styles.sectionTextContainer}>
                  <Title style={styles.sectionTitle}>{t('horoscope.relationships')}</Title>
                  <Paragraph style={styles.sectionContent}>{safeHoroscope.relationships_advice}</Paragraph>
                </View>
              </View>
            </>
          )}

          <Divider style={styles.divider} />

          <View style={styles.sectionContainer}>
            <Avatar.Icon size={36} icon="hospital" style={styles.sectionIcon} />
            <View style={styles.sectionTextContainer}>
              <Title style={styles.sectionTitle}>{t('horoscope.health')}</Title>
              <Paragraph style={styles.sectionContent}>{safeHoroscope.health_advice}</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.disclaimerCard}>
        <Card.Content>
          <Paragraph style={styles.disclaimerText}>
            {t('horoscope.disclaimer')}
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  } as ViewStyle,
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  } as TextStyle,
  headerCard: {
    marginBottom: 16,
    // 添加背景色以确保标题文字可见
    backgroundColor: '#6200ee', // 使用主题的默认紫色作为备选
  } as ViewStyle,
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  zodiacHeader: {
    flexDirection: 'column',
  } as ViewStyle,
  zodiacTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  } as TextStyle,
  dateText: {
    color: 'white',
    fontSize: 16,
  } as TextStyle,
  shareButton: {
    marginLeft: 10,
  } as ViewStyle,
  contentCard: {
    marginBottom: 16,
  } as ViewStyle,
  sectionContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'flex-start',
  } as ViewStyle,
  sectionIcon: {
    marginRight: 16,
  } as ViewStyle,
  sectionTextContainer: {
    flex: 1,
  } as ViewStyle,
  sectionHeader: {
    marginRight: 16,
    justifyContent: 'center',
  } as ViewStyle,
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  } as TextStyle,
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    flexShrink: 1,
  } as TextStyle,
  divider: {
    marginVertical: 10,
  } as ViewStyle,
  disclaimerCard: {
    marginBottom: 20,
  } as ViewStyle,
  disclaimerText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  } as TextStyle,
  luckyItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingHorizontal: 10,
  } as ViewStyle,
  luckyItem: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  } as ViewStyle,
  luckyLabel: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  } as TextStyle,
  luckyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  } as TextStyle,
});

export default HoroscopeDetailScreen; 