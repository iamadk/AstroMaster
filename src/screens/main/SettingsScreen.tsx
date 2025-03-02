import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, Switch, Button, Divider, List, RadioButton, Dialog, Portal, Paragraph, useTheme as usePaperTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useLanguage, LanguageType } from '../../contexts/LanguageContext';

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const paperTheme = usePaperTheme();
  const { notificationsEnabled, toggleNotifications } = useNotifications();
  const { language, setLanguage, t } = useLanguage();
  
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [tempLanguage, setTempLanguage] = useState<LanguageType>(language);

  const handleClearData = async () => {
    try {
      // 清除搜索历史和缓存数据
      await AsyncStorage.removeItem('searchHistory');
      await AsyncStorage.removeItem('cachedHoroscopes');
      
      Alert.alert(t('settings.confirm'), t('settings.clearCacheDesc'));
      setShowClearDataDialog(false);
    } catch (error) {
      console.error('Error clearing data:', error);
      Alert.alert(t('settings.error'), t('settings.clearCacheError'));
    }
  };

  const handleLanguageChange = () => {
    setLanguage(tempLanguage);
    setShowLanguageDialog(false);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <Card style={[styles.card, { backgroundColor: paperTheme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: paperTheme.colors.onSurface }]}>{t('settings.appSettings')}</Title>
          <Divider style={[styles.divider, { backgroundColor: theme === 'dark' ? '#444' : '#e0e0e0' }]} />
          
          <List.Item
            title={t('settings.darkMode')}
            description={t('settings.darkModeDesc')}
            titleStyle={{ color: paperTheme.colors.onSurface }}
            descriptionStyle={{ color: theme === 'dark' ? '#aaa' : '#666' }}
            left={props => <List.Icon {...props} icon="theme-light-dark" color={paperTheme.colors.primary} />}
            right={props => (
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                color={paperTheme.colors.primary}
              />
            )}
          />
          
          <List.Item
            title={t('settings.notifications')}
            description={t('settings.notificationsDesc')}
            titleStyle={{ color: paperTheme.colors.onSurface }}
            descriptionStyle={{ color: theme === 'dark' ? '#aaa' : '#666' }}
            left={props => <List.Icon {...props} icon="bell" color={paperTheme.colors.primary} />}
            right={props => (
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                color={paperTheme.colors.primary}
              />
            )}
          />
          
          <List.Item
            title={t('settings.language')}
            description={`${t('settings.currentLanguage')}${language === 'zh' ? t('settings.chinese') : t('settings.english')}`}
            titleStyle={{ color: paperTheme.colors.onSurface }}
            descriptionStyle={{ color: theme === 'dark' ? '#aaa' : '#666' }}
            left={props => <List.Icon {...props} icon="translate" color={paperTheme.colors.primary} />}
            onPress={() => setShowLanguageDialog(true)}
            right={props => <List.Icon {...props} icon="chevron-right" color={theme === 'dark' ? '#aaa' : '#757575'} />}
          />
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: paperTheme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: paperTheme.colors.onSurface }]}>{t('settings.dataPrivacy')}</Title>
          <Divider style={[styles.divider, { backgroundColor: theme === 'dark' ? '#444' : '#e0e0e0' }]} />
          
          <List.Item
            title={t('settings.clearCache')}
            description={t('settings.clearCacheDesc')}
            titleStyle={{ color: paperTheme.colors.onSurface }}
            descriptionStyle={{ color: theme === 'dark' ? '#aaa' : '#666' }}
            left={props => <List.Icon {...props} icon="delete" color={paperTheme.colors.primary} />}
            onPress={() => setShowClearDataDialog(true)}
          />
          
          <List.Item
            title={t('settings.privacy')}
            description={t('settings.privacyDesc')}
            titleStyle={{ color: paperTheme.colors.onSurface }}
            descriptionStyle={{ color: theme === 'dark' ? '#aaa' : '#666' }}
            left={props => <List.Icon {...props} icon="shield-account" color={paperTheme.colors.primary} />}
            onPress={() => {/* 导航到隐私政策页面 */}}
            right={props => <List.Icon {...props} icon="chevron-right" color={theme === 'dark' ? '#aaa' : '#757575'} />}
          />
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: paperTheme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: paperTheme.colors.onSurface }]}>{t('settings.about')}</Title>
          <Divider style={[styles.divider, { backgroundColor: theme === 'dark' ? '#444' : '#e0e0e0' }]} />
          
          <List.Item
            title={t('settings.aboutApp')}
            description={t('settings.version')}
            titleStyle={{ color: paperTheme.colors.onSurface }}
            descriptionStyle={{ color: theme === 'dark' ? '#aaa' : '#666' }}
            left={props => <List.Icon {...props} icon="information" color={paperTheme.colors.primary} />}
            onPress={() => setShowAboutDialog(true)}
          />
          
          <List.Item
            title={t('settings.rate')}
            description={t('settings.rateDesc')}
            titleStyle={{ color: paperTheme.colors.onSurface }}
            descriptionStyle={{ color: theme === 'dark' ? '#aaa' : '#666' }}
            left={props => <List.Icon {...props} icon="star" color={paperTheme.colors.primary} />}
            onPress={() => {/* 打开应用商店评分页面 */}}
            right={props => <List.Icon {...props} icon="chevron-right" color={theme === 'dark' ? '#aaa' : '#757575'} />}
          />
          
          <List.Item
            title={t('settings.feedback')}
            description={t('settings.feedbackDesc')}
            titleStyle={{ color: paperTheme.colors.onSurface }}
            descriptionStyle={{ color: theme === 'dark' ? '#aaa' : '#666' }}
            left={props => <List.Icon {...props} icon="message-text" color={paperTheme.colors.primary} />}
            onPress={() => {/* 导航到反馈页面 */}}
            right={props => <List.Icon {...props} icon="chevron-right" color={theme === 'dark' ? '#aaa' : '#757575'} />}
          />
        </Card.Content>
      </Card>

      {/* 语言选择对话框 */}
      <Portal>
        <Dialog 
          visible={showLanguageDialog} 
          onDismiss={() => setShowLanguageDialog(false)}
          style={{ backgroundColor: paperTheme.colors.surface }}
        >
          <Dialog.Title style={{ color: paperTheme.colors.onSurface }}>{t('settings.selectLanguage')}</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={value => setTempLanguage(value as LanguageType)} value={tempLanguage}>
              <RadioButton.Item 
                label={t('settings.chinese')} 
                value="zh" 
                labelStyle={{ color: paperTheme.colors.onSurface }}
                color={paperTheme.colors.primary}
              />
              <RadioButton.Item 
                label={t('settings.english')} 
                value="en" 
                labelStyle={{ color: paperTheme.colors.onSurface }}
                color={paperTheme.colors.primary}
              />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor={paperTheme.colors.primary} onPress={() => setShowLanguageDialog(false)}>{t('settings.cancel')}</Button>
            <Button textColor={paperTheme.colors.primary} onPress={handleLanguageChange}>{t('settings.confirm')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* 关于对话框 */}
      <Portal>
        <Dialog 
          visible={showAboutDialog} 
          onDismiss={() => setShowAboutDialog(false)}
          style={{ backgroundColor: paperTheme.colors.surface }}
        >
          <Dialog.Title style={{ color: paperTheme.colors.onSurface }}>{t('settings.aboutApp')}</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{ color: paperTheme.colors.onSurface }}>
              {t('settings.aboutText')}
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor={paperTheme.colors.primary} onPress={() => setShowAboutDialog(false)}>{t('settings.close')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* 清除数据确认对话框 */}
      <Portal>
        <Dialog 
          visible={showClearDataDialog} 
          onDismiss={() => setShowClearDataDialog(false)}
          style={{ backgroundColor: paperTheme.colors.surface }}
        >
          <Dialog.Title style={{ color: paperTheme.colors.onSurface }}>{t('settings.confirmClear')}</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{ color: paperTheme.colors.onSurface }}>
              {t('settings.confirmClearDesc')}
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor={paperTheme.colors.primary} onPress={() => setShowClearDataDialog(false)}>{t('settings.cancel')}</Button>
            <Button textColor={paperTheme.colors.primary} onPress={handleClearData}>{t('settings.confirm')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  divider: {
    marginBottom: 10,
  },
});

export default SettingsScreen; 