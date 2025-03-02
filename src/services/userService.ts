import { executeQuery } from '../database/database';
import { openDatabase } from 'expo-sqlite';
import { User } from '../contexts/AuthContext';

export interface User {
  id?: number;
  username: string;
  password?: string;
  email?: string;
  birthdate?: string;
  zodiac?: string;
  created_at?: string;
}

// 打开数据库
const db = openDatabase('astromaster.db');

// 用户注册
export const registerUser = async (user: User): Promise<number> => {
  try {
    const result = await executeQuery(
      'INSERT INTO users (username, password, email, birthdate, zodiac) VALUES (?, ?, ?, ?, ?)',
      [user.username, user.password, user.email, user.birthdate, user.zodiac]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// 用户登录
export const loginUser = async (username: string, password: string): Promise<User | null> => {
  try {
    const result = await executeQuery(
      'SELECT id, username, email, birthdate, zodiac, created_at FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    
    if (result.rows.length > 0) {
      return result.rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

// 检查用户名是否已存在
export const checkUsernameExists = async (username: string): Promise<boolean> => {
  try {
    const result = await executeQuery(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking username:', error);
    throw error;
  }
};

// 获取用户信息
export const getUserById = (userId: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE id = ?',
        [userId],
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
            reject(new Error('用户不存在'));
          }
        },
        (_, error) => {
          console.error('Get user error:', error);
          reject(new Error('获取用户信息时发生错误'));
          return false;
        }
      );
    });
  });
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

// 更新用户星座
export const updateUserZodiac = (userId: string, zodiac: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE users SET zodiac = ? WHERE id = ?',
        [zodiac, userId],
        () => {
          resolve();
        },
        (_, error) => {
          console.error('Update zodiac error:', error);
          reject(new Error('更新星座信息时发生错误'));
          return false;
        }
      );
    });
  });
};

// 更新用户生日
export const updateUserBirthdate = (userId: string, birthdate: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE users SET birthdate = ? WHERE id = ?',
        [birthdate, userId],
        () => {
          resolve();
        },
        (_, error) => {
          console.error('Update birthdate error:', error);
          reject(new Error('更新生日信息时发生错误'));
          return false;
        }
      );
    });
  });
};

// 更新用户邮箱
export const updateUserEmail = (userId: string, email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE users SET email = ? WHERE id = ?',
        [email, userId],
        () => {
          resolve();
        },
        (_, error) => {
          console.error('Update email error:', error);
          reject(new Error('更新邮箱信息时发生错误'));
          return false;
        }
      );
    });
  });
};

// 删除用户账户
export const deleteUserAccount = (userId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM users WHERE id = ?',
        [userId],
        () => {
          resolve();
        },
        (_, error) => {
          console.error('Delete account error:', error);
          reject(new Error('删除账户时发生错误'));
          return false;
        }
      );
    });
  });
}; 