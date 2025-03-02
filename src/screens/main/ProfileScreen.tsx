import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Avatar, Divider, TextInput, Snackbar, useTheme as usePaperTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { calculateZodiac } from '../../utils/horoscopeGenerator';
import { updateUserProfile } from '../../services/userService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

// 星座的key列表
const zodiacKeys = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

// 中文星座列表(为了与后端API保持兼容)
const chineseZodiacs = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];

const ProfileScreen: React.FC = () => {
  const { user, logout, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [birthdate, setBirthdate] = useState<Date | null>(
    user?.birthdate ? new Date(user.birthdate) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { theme } = useTheme();
  const paperTheme = usePaperTheme();
  const { t } = useLanguage();

  // 获取星座的翻译名称
  const getTranslatedZodiacName = (zodiacName: string): string => {
    const index = chineseZodiacs.indexOf(zodiacName);
    if (index !== -1) {
      return t(`zodiac.${zodiacKeys[index]}`);
    }
    return zodiacName;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthdate(selectedDate);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Calculate zodiac sign
      let zodiac = user.zodiac || '';
      if (birthdate) {
        zodiac = calculateZodiac(birthdate.toISOString().split('T')[0]);
      }

      // Update user profile
      await updateUserProfile({
        ...user,
        email,
        birthdate: birthdate ? birthdate.toISOString().split('T')[0] : undefined,
        zodiac
      });

      // Re-login to update user info
      if (user.username && user.password) {
        await login(user.username, user.password);
      }

      setIsEditing(false);
      setSnackbarMessage(t('profile.updatedSuccess'));
      setShowSnackbar(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbarMessage(t('profile.updateFailed'));
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        {
          text: t('settings.cancel'),
          style: 'cancel'
        },
        {
          text: t('settings.confirm'),
          onPress: () => logout()
        }
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>{t('profile.notLoggedIn')}</Text>
      </View>
    );
  }

  // 获取翻译后的星座名称
  const translatedZodiac = user.zodiac ? getTranslatedZodiacName(user.zodiac) : '';

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text 
            size={80} 
            label={user.username.substring(0, 2).toUpperCase()} 
            style={styles.avatar}
          />
          <Title style={styles.username}>{user.username}</Title>
          {user.zodiac && (
            <Paragraph style={styles.zodiac}>{translatedZodiac}</Paragraph>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>{t('profile.personalInfo')}</Title>
            {!isEditing && (
              <Button 
                mode="text" 
                onPress={() => setIsEditing(true)}
                disabled={isLoading}
              >
                {t('profile.edit')}
              </Button>
            )}
          </View>

          <Divider style={styles.divider} />

          {isEditing ? (
            <View>
              <TextInput
                label={t('auth.email')}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email" />}
              />

              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <View pointerEvents="none">
                  <TextInput
                    label={t('auth.birthdate')}
                    value={birthdate ? birthdate.toLocaleDateString() : ''}
                    style={styles.input}
                    left={<TextInput.Icon icon="calendar" />}
                    editable={false}
                  />
                </View>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={birthdate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}

              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={() => setIsEditing(false)}
                  style={[styles.button, styles.cancelButton]}
                  disabled={isLoading}
                >
                  {t('settings.cancel')}
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  style={styles.button}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {t('profile.save')}
                </Button>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('auth.username')}:</Text>
                <Text style={styles.infoValue}>{user.username}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('auth.email')}:</Text>
                <Text style={styles.infoValue}>{user.email || t('profile.notSet')}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('auth.birthdate')}:</Text>
                <Text style={styles.infoValue}>
                  {user.birthdate ? new Date(user.birthdate).toLocaleDateString() : t('profile.notSet')}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('profile.zodiac')}:</Text>
                <Text style={styles.infoValue}>
                  {user.zodiac ? translatedZodiac : t('profile.notSet')}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('profile.registrationTime')}:</Text>
                <Text style={styles.infoValue}>
                  {user.created_at ? new Date(user.created_at).toLocaleString() : t('profile.unknown')}
                </Text>
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        icon="logout"
      >
        {t('profile.logout')}
      </Button>

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
        action={{
          label: t('profile.close'),
          onPress: () => setShowSnackbar(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
    backgroundColor: '#6200ee',
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 10,
    backgroundColor: '#3700b3',
  },
  username: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  zodiac: {
    color: 'white',
    fontSize: 16,
  },
  infoCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
  },
  divider: {
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 8,
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
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    borderColor: '#6200ee',
  },
  logoutButton: {
    marginBottom: 20,
    borderColor: 'red',
    borderWidth: 1,
  },
});

export default ProfileScreen; 