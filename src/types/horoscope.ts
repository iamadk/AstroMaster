export interface HoroscopeData {
  id?: string;
  zodiac: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
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
  // 为了与HoroscopeGenerator生成的字段保持兼容
  work_advice?: string;
  love_advice?: string;
  health_advice?: string;
  relationships_advice?: string;
}

export interface HoroscopeParams {
  zodiac: string;
  type: string;
  date: string;
} 