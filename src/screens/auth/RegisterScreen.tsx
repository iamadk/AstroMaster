import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Title, Snackbar, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/MainNavigator';
import { useAuth } from '../../contexts/AuthContext';
import { checkUsernameExists } from '../../services/userService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { calculateZodiac } from '../../utils/horoscopeGenerator';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, isLoading, error, clearError } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // 表单验证
  const isUsernameValid = () => username.length >= 3;
  const isPasswordValid = () => password.length >= 6;
  const isConfirmPasswordValid = () => password === confirmPassword;
  const isEmailValid = () => {
    if (!email) return true; // 邮箱是可选的
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // 验证表单
    if (!isUsernameValid()) {
      setSnackbarMessage('用户名至少需要3个字符');
      setSnackbarVisible(true);
      return;
    }

    if (!isPasswordValid()) {
      setSnackbarMessage('密码至少需要6个字符');
      setSnackbarVisible(true);
      return;
    }

    if (!isConfirmPasswordValid()) {
      setSnackbarMessage('两次输入的密码不一致');
      setSnackbarVisible(true);
      return;
    }

    if (!isEmailValid()) {
      setSnackbarMessage('请输入有效的邮箱地址');
      setSnackbarVisible(true);
      return;
    }

    try {
      await register(username, password, email);
    } catch (error) {
      // 错误已经在AuthContext中处理
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthdate(selectedDate);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Title style={styles.appTitle}>星座大师</Title>
          <Text style={styles.appSubtitle}>创建您的账户</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            label="用户名"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
            left={<TextInput.Icon icon="account" />}
            error={username.length > 0 && !isUsernameValid()}
          />
          {username.length > 0 && !isUsernameValid() && (
            <HelperText type="error" visible={true}>
              用户名至少需要3个字符
            </HelperText>
          )}

          <TextInput
            label="密码"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry}
            style={styles.input}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? 'eye' : 'eye-off'}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
            left={<TextInput.Icon icon="lock" />}
            error={password.length > 0 && !isPasswordValid()}
          />
          {password.length > 0 && !isPasswordValid() && (
            <HelperText type="error" visible={true}>
              密码至少需要6个字符
            </HelperText>
          )}

          <TextInput
            label="确认密码"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={confirmSecureTextEntry}
            style={styles.input}
            right={
              <TextInput.Icon
                icon={confirmSecureTextEntry ? 'eye' : 'eye-off'}
                onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
              />
            }
            left={<TextInput.Icon icon="lock-check" />}
            error={confirmPassword.length > 0 && !isConfirmPasswordValid()}
          />
          {confirmPassword.length > 0 && !isConfirmPasswordValid() && (
            <HelperText type="error" visible={true}>
              两次输入的密码不一致
            </HelperText>
          )}

          <TextInput
            label="邮箱 (可选)"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
            error={email.length > 0 && !isEmailValid()}
          />
          {email.length > 0 && !isEmailValid() && (
            <HelperText type="error" visible={true}>
              请输入有效的邮箱地址
            </HelperText>
          )}

          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View pointerEvents="none">
              <TextInput
                label="出生日期（可选）"
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

          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.registerButton}
            loading={isLoading}
            disabled={isLoading}
          >
            注册
          </Button>

          <View style={styles.loginContainer}>
            <Text>已有账号？</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>返回登录</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible || !!error}
        onDismiss={() => {
          setSnackbarVisible(false);
          if (error) clearError();
        }}
        duration={3000}
        action={{
          label: '关闭',
          onPress: () => {
            setSnackbarVisible(false);
            if (error) clearError();
          },
        }}
      >
        {error || snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  appSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  registerButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#6200ee',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default RegisterScreen; 