import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, RadioButton, Card, Title, Paragraph, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/MainNavigator';
import { useLanguage, LanguageType } from '../../contexts/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LanguageSelectionScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'LanguageSelection'>;

const LanguageSelectionScreen: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>(language);
  const navigation = useNavigation<LanguageSelectionScreenNavigationProp>();

  const handleContinue = async () => {
    // 设置语言
    setLanguage(selectedLanguage);
    
    // 标记已经选择过语言，下次不再显示此界面
    await AsyncStorage.setItem('hasSelectedLanguage', 'true');
    
    // 导航到登录页面
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Avatar.Icon 
          size={100}
          icon="star-circle"
          color="#ffffff"
          style={styles.logo}
        />
        <Text style={styles.appName}>AstroMaster</Text>
        <Text style={styles.appSlogan}>Explore the mysteries of the zodiac</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>请选择语言 / Select Language</Title>
          <Paragraph style={styles.description}>
            请选择您喜欢的语言，以获得最佳使用体验。
          </Paragraph>
          <Paragraph style={styles.description}>
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
              />
              <RadioButton.Item 
                label="English" 
                value="en"
              />
            </RadioButton.Group>
          </View>
        </Card.Content>
      </Card>

      <Button 
        mode="contained" 
        onPress={handleContinue}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        {selectedLanguage === 'zh' ? '继续' : 'Continue'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    marginBottom: 10,
    backgroundColor: '#6200ee',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 5,
  },
  appSlogan: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 10,
  },
  radioGroup: {
    marginTop: 15,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default LanguageSelectionScreen; 