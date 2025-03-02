import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Text, Button, RadioButton, Card, Title, Paragraph, Avatar, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage, LanguageType } from '../contexts/LanguageContext';

const LanguageFirstCheck: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>('zh');
  const [isLoading, setIsLoading] = useState(true);
  const { setLanguage } = useLanguage();
  const theme = useTheme();

  useEffect(() => {
    const checkLanguageSelection = async () => {
      try {
        const hasSelectedLanguage = await AsyncStorage.getItem('hasSelectedLanguage');
        setVisible(hasSelectedLanguage !== 'true');
      } catch (error) {
        console.error('Error checking language selection:', error);
        setVisible(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkLanguageSelection();
  }, []);

  const handleContinue = async () => {
    // 设置语言
    setLanguage(selectedLanguage);
    
    // 标记已经选择过语言，下次不再显示此界面
    await AsyncStorage.setItem('hasSelectedLanguage', 'true');
    
    // 关闭弹窗
    setVisible(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {}}
    >
      <View style={styles.centeredView}>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.logoContainer}>
              <Avatar.Icon 
                size={80}
                icon="star-circle"
                color="#ffffff"
                style={styles.logo}
              />
              <Title style={[styles.appTitle, { color: theme.colors.primary }]}>AstroMaster</Title>
            </View>

            <Title style={[styles.title, { color: theme.colors.onSurface }]}>请选择语言 / Select Language</Title>
            
            <Paragraph style={[styles.description, { color: theme.colors.onSurface }]}>
              请选择您喜欢的语言，以获得最佳使用体验。
            </Paragraph>
            <Paragraph style={[styles.description, { color: theme.colors.onSurface }]}>
              Please select your preferred language for the best experience.
            </Paragraph>

            <View style={styles.radioGroup}>
              <RadioButton.Group 
                onValueChange={value => setSelectedLanguage(value as LanguageType)} 
                value={selectedLanguage}
              >
                <RadioButton.Item 
                  label="中文" 
                  value="zh"
                  labelStyle={{ color: theme.colors.onSurface }}
                  color={theme.colors.primary}
                />
                <RadioButton.Item 
                  label="English" 
                  value="en"
                  labelStyle={{ color: theme.colors.onSurface }}
                  color={theme.colors.primary}
                />
              </RadioButton.Group>
            </View>

            <Button 
              mode="contained" 
              onPress={handleContinue}
              style={styles.button}
              contentStyle={styles.buttonContent}
              buttonColor={theme.colors.primary}
            >
              {selectedLanguage === 'zh' ? '继续' : 'Continue'}
            </Button>
          </Card.Content>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    backgroundColor: '#6200ee',
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    textAlign: 'center',
    marginBottom: 5,
    fontSize: 14,
  },
  radioGroup: {
    marginTop: 15,
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
});

export default LanguageFirstCheck; 