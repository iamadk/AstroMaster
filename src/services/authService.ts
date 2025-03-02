import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from 'expo-sqlite';
import { User } from '../contexts/AuthContext';
import '../utils/cryptoPolyfill';
import { v4 as uuidv4 } from 'uuid';

// 打开数据库
const db = openDatabase('astromaster.db');

// 初始化数据库表
export const initDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          email TEXT,
          birthdate TEXT,
          zodiac TEXT,
          created_at TEXT
        )`,
        [],
        () => {
          console.log('Users table created successfully');
          resolve();
        },
        (_, error) => {
          console.error('Error creating users table:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// 用户登录
export const loginUser = (username: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (_, result) => {
          if (result.rows.length > 0) {
            const user = result.rows.item(0);
            resolve({
              id: user.id,
              username: user.username,
              email: user.email,
              birthdate: user.birthdate,
              zodiac: user.zodiac,
              created_at: user.created_at
            });
          } else {
            reject(new Error('用户名或密码不正确'));
          }
        },
        (_, error) => {
          console.error('Login error:', error);
          reject(new Error('登录时发生错误'));
          return false;
        }
      );
    });
  });
};

// 用户注册
export const registerUser = (
  username: string, 
  password: string, 
  email?: string
): Promise<User> => {
  return new Promise((resolve, reject) => {
    // 检查用户名是否已存在
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (_, result) => {
          if (result.rows.length > 0) {
            reject(new Error('用户名已存在'));
          } else {
            // 创建新用户
            const userId = uuidv4();
            const now = new Date().toISOString();
            
            tx.executeSql(
              'INSERT INTO users (id, username, password, email, created_at) VALUES (?, ?, ?, ?, ?)',
              [userId, username, password, email || null, now],
              () => {
                resolve({
                  id: userId,
                  username,
                  email,
                  created_at: now
                });
              },
              (_, error) => {
                console.error('Registration error:', error);
                reject(new Error('注册时发生错误'));
                return false;
              }
            );
          }
        },
        (_, error) => {
          console.error('User check error:', error);
          reject(new Error('注册时发生错误'));
          return false;
        }
      );
    });
  });
};

// 用户登出
export const logoutUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('登出时发生错误');
  }
};

// 更新用户资料
export const updateUserProfile = (user: User): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE users 
         SET email = ?, birthdate = ?, zodiac = ?
         WHERE id = ?`,
        [user.email || null, user.birthdate || null, user.zodiac || null, user.id],
        () => {
          resolve();
        },
        (_, error) => {
          console.error('Update profile error:', error);
          reject(new Error('更新资料时发生错误'));
          return false;
        }
      );
    });
  });
}; 