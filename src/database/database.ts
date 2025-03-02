import * as SQLite from 'expo-sqlite';

// 打开数据库连接
export const db = SQLite.openDatabase('astromaster.db');

// 初始化数据库表
export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // 创建用户表
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          email TEXT,
          birthdate TEXT,
          zodiac TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );`,
        [],
        () => {
          console.log('Users table created successfully');
        },
        (_, error) => {
          console.error('Error creating users table:', error);
          reject(error);
          return false;
        }
      );

      // 创建星座运势表
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS horoscopes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          zodiac TEXT NOT NULL,
          type TEXT NOT NULL,
          date TEXT NOT NULL,
          overview TEXT,
          mood TEXT,
          work TEXT,
          relationships TEXT,
          health TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(zodiac, type, date)
        );`,
        [],
        () => {
          console.log('Horoscopes table created successfully');
          resolve();
        },
        (_, error) => {
          console.error('Error creating horoscopes table:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// 执行SQL查询的通用函数
export const executeQuery = (
  sql: string,
  params: any[] = []
): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}; 