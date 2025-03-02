import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from 'expo-sqlite';
import { generateHoroscope } from '../utils/horoscopeGenerator';

// 打开数据库
const db = openDatabase('astromaster.db');

// 初始化数据库表
export const initHoroscopeDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS horoscopes (
          id TEXT PRIMARY KEY,
          zodiac TEXT NOT NULL,
          type TEXT NOT NULL,
          date TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TEXT NOT NULL
        )`,
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

// 星座运势数据接口
export interface HoroscopeData {
  id?: string;
  zodiac: string;
  type: string;
  date: string;
  overview: string;
  mood: string;
  lucky_number: string;
  lucky_color: string;
  compatibility: string;
  work: string;
  love: string;
  relationships: string;
  health: string;
  created_at?: string;
}

// 获取星座运势
export const getHoroscope = async (
  zodiac: string,
  type: string,
  date: string
): Promise<HoroscopeData> => {
  try {
    // 首先尝试从缓存中获取
    const cachedData = await getCachedHoroscope(zodiac, type, date);
    if (cachedData) {
      return cachedData;
    }

    // 如果缓存中没有，尝试从数据库中获取
    const dbData = await getHoroscopeFromDB(zodiac, type, date);
    if (dbData) {
      // 将数据存入缓存
      await cacheHoroscope(dbData);
      return dbData;
    }

    // 如果数据库中也没有，生成新的星座运势
    const newHoroscope = generateHoroscope(zodiac, type, date);
    
    // 将新生成的运势保存到数据库
    await saveHoroscopeToDB(newHoroscope);
    
    // 将数据存入缓存
    await cacheHoroscope(newHoroscope);
    
    return newHoroscope;
  } catch (error) {
    console.error('Error getting horoscope:', error);
    throw new Error('获取星座运势时发生错误');
  }
};

// 从缓存中获取星座运势
const getCachedHoroscope = async (
  zodiac: string,
  type: string,
  date: string
): Promise<HoroscopeData | null> => {
  try {
    const cacheKey = `horoscope_${zodiac}_${type}_${date}`;
    const cachedData = await AsyncStorage.getItem(cacheKey);
    
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting cached horoscope:', error);
    return null;
  }
};

// 将星座运势存入缓存
const cacheHoroscope = async (horoscope: HoroscopeData): Promise<void> => {
  try {
    const cacheKey = `horoscope_${horoscope.zodiac}_${horoscope.type}_${horoscope.date}`;
    await AsyncStorage.setItem(cacheKey, JSON.stringify(horoscope));
    
    // 更新缓存索引
    const cacheIndex = await AsyncStorage.getItem('cachedHoroscopes') || '[]';
    const index = JSON.parse(cacheIndex) as string[];
    
    if (!index.includes(cacheKey)) {
      index.push(cacheKey);
      await AsyncStorage.setItem('cachedHoroscopes', JSON.stringify(index));
    }
  } catch (error) {
    console.error('Error caching horoscope:', error);
  }
};

// 从数据库中获取星座运势
const getHoroscopeFromDB = (
  zodiac: string,
  type: string,
  date: string
): Promise<HoroscopeData | null> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM horoscopes WHERE zodiac = ? AND type = ? AND date = ?',
        [zodiac, type, date],
        (_, result) => {
          if (result.rows.length > 0) {
            const data = result.rows.item(0);
            const content = JSON.parse(data.content);
            
            resolve({
              id: data.id,
              zodiac: data.zodiac,
              type: data.type,
              date: data.date,
              overview: content.overview,
              mood: content.mood,
              lucky_number: content.lucky_number,
              lucky_color: content.lucky_color,
              compatibility: content.compatibility,
              work: content.work,
              love: content.love,
              relationships: content.relationships,
              health: content.health,
              created_at: data.created_at
            });
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          console.error('Database error:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// 将星座运势保存到数据库
const saveHoroscopeToDB = (horoscope: HoroscopeData): Promise<void> => {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    const id = `${horoscope.zodiac}_${horoscope.type}_${horoscope.date}`;
    
    const content = JSON.stringify({
      overview: horoscope.overview,
      mood: horoscope.mood,
      lucky_number: horoscope.lucky_number,
      lucky_color: horoscope.lucky_color,
      compatibility: horoscope.compatibility,
      work: horoscope.work,
      love: horoscope.love,
      relationships: horoscope.relationships,
      health: horoscope.health
    });
    
    db.transaction(tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO horoscopes (id, zodiac, type, date, content, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [id, horoscope.zodiac, horoscope.type, horoscope.date, content, now],
        () => {
          resolve();
        },
        (_, error) => {
          console.error('Error saving horoscope to DB:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// 清除缓存的星座运势
export const clearCachedHoroscopes = async (): Promise<void> => {
  try {
    const cacheIndex = await AsyncStorage.getItem('cachedHoroscopes');
    
    if (cacheIndex) {
      const index = JSON.parse(cacheIndex) as string[];
      
      // 删除所有缓存的星座运势
      for (const key of index) {
        await AsyncStorage.removeItem(key);
      }
      
      // 清除索引
      await AsyncStorage.removeItem('cachedHoroscopes');
    }
  } catch (error) {
    console.error('Error clearing cached horoscopes:', error);
    throw new Error('清除缓存的星座运势时发生错误');
  }
}; 