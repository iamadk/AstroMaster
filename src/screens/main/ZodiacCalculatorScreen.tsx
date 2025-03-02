import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Divider, useTheme as usePaperTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { calculateZodiac, getDetailedZodiacInfo, ZodiacInfo } from '../../utils/horoscopeGenerator';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserProfile } from '../../services/userService';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

// 星座的key列表
const zodiacKeys = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

// 中文星座列表(为了保持后端兼容性)
const chineseZodiacs = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];

const ZodiacCalculatorScreen: React.FC = () => {
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [zodiac, setZodiac] = useState<string | null>(null);
  const [zodiacInfo, setZodiacInfo] = useState<ZodiacInfo | Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const paperTheme = usePaperTheme();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      // 在Android上，DateTimePicker会在选择后自动关闭
      setShowDatePicker(false);
      if (selectedDate) {
        setBirthdate(selectedDate);
      }
    } else {
      // 在iOS上，存储临时日期，但不立即关闭选择器
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const confirmDate = () => {
    setBirthdate(tempDate);
    setShowDatePicker(false);
  };

  const cancelDateSelection = () => {
    setShowDatePicker(false);
  };

  const calculateZodiacSign = () => {
    if (!birthdate) return;

    setIsLoading(true);
    
    // 格式化日期为 YYYY-MM-DD
    const formattedDate = birthdate.toISOString().split('T')[0];
    
    // 计算星座
    const zodiacSign = calculateZodiac(formattedDate);
    setZodiac(zodiacSign);
    
    // 获取详细信息
    const detailedInfo = getDetailedZodiacInfo(zodiacSign);
    setZodiacInfo(detailedInfo);
    
    setIsLoading(false);
  };

  const saveToProfile = async () => {
    if (!user || !birthdate || !zodiac) return;

    setIsLoading(true);
    try {
      const formattedDate = birthdate.toISOString().split('T')[0];
      await updateUserProfile({
        ...user,
        birthdate: formattedDate,
        zodiac: zodiac
      });
      
      // 重新登录以更新用户信息
      if (user.username && user.password) {
        await login(user.username, user.password);
      }
    } catch (error) {
      console.error('Error saving to profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 获取星座的翻译名称
  const getTranslatedZodiacName = (zodiacName: string): string => {
    const index = chineseZodiacs.indexOf(zodiacName);
    if (index !== -1) {
      return t(`zodiac.${zodiacKeys[index]}`);
    }
    return zodiacName;
  };

  // 本地化属性名称的函数
  const localizePropertyName = (key: string): string => {
    return t(`zodiac.${key}`) || key;
  };

  // 翻译详细信息内容
  const getTranslatedZodiacInfo = () => {
    const translatedInfo = { ...zodiacInfo };
    
    // 如果有星座名称，翻译它
    if (zodiac && 'name' in translatedInfo) {
      translatedInfo.name = getTranslatedZodiacName(zodiac);
    }
    
    return translatedInfo;
  };

  const translatedZodiacInfo = getTranslatedZodiacInfo();

  return (
    <ScrollView style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <Card style={[styles.introCard, { backgroundColor: paperTheme.colors.primary }]}>
        <Card.Content>
          <Title style={styles.introTitle}>{t('zodiacCalculator.title')}</Title>
          <Paragraph style={styles.introText}>
            {t('zodiacCalculator.intro')}
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={[styles.calculatorCard, { backgroundColor: paperTheme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: paperTheme.colors.onSurface }]}>{t('zodiacCalculator.selectBirthdate')}</Title>
          
          <TouchableOpacity 
            style={[styles.datePickerButton, { 
              backgroundColor: theme === 'dark' ? '#333333' : '#f0f0f0',
              borderColor: theme === 'dark' ? '#555555' : '#e0e0e0',
              borderWidth: 1
            }]} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.datePickerButtonText, { color: paperTheme.colors.onSurface }]}>
              {birthdate ? birthdate.toLocaleDateString() : t('zodiacCalculator.clickToSelect')}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <View>
              <DateTimePicker
                value={tempDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
                themeVariant={theme}
              />
              
              {Platform.OS === 'ios' && (
                <View style={styles.datePickerButtonsContainer}>
                  <Button 
                    mode="text" 
                    onPress={cancelDateSelection}
                    style={styles.datePickerButton}
                  >
                    {t('settings.cancel')}
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={confirmDate}
                    style={styles.datePickerButton}
                  >
                    {t('settings.confirm')}
                  </Button>
                </View>
              )}
            </View>
          )}

          <Button
            mode="contained"
            onPress={calculateZodiacSign}
            style={styles.calculateButton}
            buttonColor={paperTheme.colors.primary}
            textColor="#ffffff"
            disabled={!birthdate || isLoading}
            loading={isLoading}
          >
            {t('zodiacCalculator.calculate')}
          </Button>
        </Card.Content>
      </Card>

      {zodiac && (
        <Card style={[styles.resultCard, { backgroundColor: paperTheme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.resultTitle, { color: paperTheme.colors.onSurface }]}>{t('zodiacCalculator.result')}</Title>
            <View style={styles.zodiacResult}>
              <Text style={[styles.zodiacName, { color: paperTheme.colors.primary }]}>
                {getTranslatedZodiacName(zodiac)}
              </Text>
              {user && (
                <Button
                  mode="outlined"
                  onPress={saveToProfile}
                  style={styles.saveButton}
                  textColor={paperTheme.colors.primary}
                  disabled={isLoading}
                  loading={isLoading}
                >
                  {t('zodiacCalculator.saveToProfile')}
                </Button>
              )}
            </View>

            <Divider style={[styles.divider, { backgroundColor: theme === 'dark' ? '#444' : '#e0e0e0' }]} />

            <Title style={[styles.detailsTitle, { color: paperTheme.colors.onSurface }]}>{t('zodiacCalculator.details')}</Title>
            {Object.entries(translatedZodiacInfo).map(([key, value]) => (
              <View key={key} style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: paperTheme.colors.onSurface }]}>{localizePropertyName(key)}:</Text>
                <Text style={[styles.infoValue, { color: theme === 'dark' ? '#e0e0e0' : '#333333' }]}>{value}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      <Card style={[styles.tipsCard, { backgroundColor: theme === 'dark' ? '#2e2416' : '#fff8e1' }]}>
        <Card.Content>
          <Title style={[styles.tipsTitle, { color: theme === 'dark' ? '#ffb74d' : '#ff6f00' }]}>{t('zodiacCalculator.fact')}</Title>
          <Paragraph style={[styles.tipsText, { color: theme === 'dark' ? '#e0e0e0' : '#333333' }]}>
            {t('zodiacCalculator.factText')}
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
  },
  introCard: {
    marginBottom: 16,
  },
  introTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  introText: {
    color: 'white',
    fontSize: 16,
  },
  calculatorCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  datePickerButton: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  datePickerButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  calculateButton: {
    marginTop: 10,
  },
  resultCard: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  zodiacResult: {
    alignItems: 'center',
    marginBottom: 10,
  },
  zodiacName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  saveButton: {
    marginTop: 10,
  },
  divider: {
    marginVertical: 15,
  },
  detailsTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    flex: 1,
  },
  tipsCard: {
    marginBottom: 20,
  },
  tipsTitle: {
    fontWeight: 'bold',
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  datePickerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 15,
  },
});

export default ZodiacCalculatorScreen; 