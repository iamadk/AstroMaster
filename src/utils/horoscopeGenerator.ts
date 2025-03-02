// 星座运势生成器

import { HoroscopeData } from '../services/horoscopeService';

interface HoroscopeContent {
  overview: string;
  mood: string;
  work: string;
  relationships: string;
  health: string;
}

// 星座列表
export const zodiacSigns = [
  '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座',
  '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'
];

// 星座英文名称
export const zodiacSignsEn = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// 星座日期范围
export const zodiacDateRanges = [
  { start: '03-21', end: '04-19' }, // 白羊座
  { start: '04-20', end: '05-20' }, // 金牛座
  { start: '05-21', end: '06-21' }, // 双子座
  { start: '06-22', end: '07-22' }, // 巨蟹座
  { start: '07-23', end: '08-22' }, // 狮子座
  { start: '08-23', end: '09-22' }, // 处女座
  { start: '09-23', end: '10-23' }, // 天秤座
  { start: '10-24', end: '11-22' }, // 天蝎座
  { start: '11-23', end: '12-21' }, // 射手座
  { start: '12-22', end: '01-19' }, // 摩羯座
  { start: '01-20', end: '02-18' }, // 水瓶座
  { start: '02-19', end: '03-20' }  // 双鱼座
];

// 根据生日计算星座
export const calculateZodiac = (birthdate: string): string => {
  // 格式化日期为MM-DD格式
  const date = new Date(birthdate);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const formattedDate = `${month}-${day}`;

  // 特殊处理摩羯座跨年的情况
  if (formattedDate >= '12-22' || formattedDate <= '01-19') {
    return '摩羯座';
  }

  // 查找对应的星座
  for (let i = 0; i < zodiacDateRanges.length; i++) {
    const range = zodiacDateRanges[i];
    if (formattedDate >= range.start && formattedDate <= range.end) {
      return zodiacSigns[i];
    }
  }

  // 默认返回
  return '未知星座';
};

// 星座详细信息接口
export interface ZodiacInfo {
  name: string;
  nameEn: string;
  dateRange: string;
  element: string;
  ruling: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  likes: string[];
  dislikes: string[];
  description: string;
  image?: string;
}

// 默认星座信息
const defaultZodiacInfo: ZodiacInfo = {
  name: '未知星座',
  nameEn: 'Unknown',
  dateRange: '',
  element: '',
  ruling: '',
  traits: [],
  strengths: [],
  weaknesses: [],
  likes: [],
  dislikes: [],
  description: '未能识别的星座'
};

// 星座详细信息列表
const zodiacInfoList: ZodiacInfo[] = [
  {
    name: '白羊座',
    nameEn: 'Aries',
    dateRange: '3月21日 - 4月19日',
    element: '火象',
    ruling: '火星',
    traits: ['勇敢', '自信', '热情', '冲动'],
    strengths: ['勇气', '决断力', '自信', '乐观'],
    weaknesses: ['急躁', '冲动', '自我中心', '好斗'],
    likes: ['挑战', '领导', '体育活动', '个人成就'],
    dislikes: ['等待', '承认失败', '被忽视', '细节工作'],
    description: '白羊座是黄道十二宫的第一个星座，象征着新的开始。白羊座的人通常充满活力、热情和冒险精神，喜欢挑战和竞争。他们直率、坦诚，有时会显得有些鲁莽和冲动。白羊座的人通常有很强的领导能力，但也可能因为急躁而忽略细节。'
  },
  {
    name: '金牛座',
    nameEn: 'Taurus',
    dateRange: '4月20日 - 5月20日',
    element: '土象',
    ruling: '金星',
    traits: ['稳重', '实际', '可靠', '固执'],
    strengths: ['可靠', '耐心', '实用', '奉献'],
    weaknesses: ['固执', '占有欲', '物质主义', '抗拒变化'],
    likes: ['园艺', '烹饪', '音乐', '浪漫'],
    dislikes: ['突然变化', '复杂性', '不安全感', '人为合成物'],
    description: '金牛座是黄道十二宫的第二个星座，以其稳定性和可靠性而闻名。金牛座的人通常非常务实、耐心和可靠，他们喜欢安全感和舒适。金牛座的人对美食、艺术和自然有着深厚的欣赏能力，但也可能显得固执和抗拒变化。'
  },
  {
    name: '双子座',
    nameEn: 'Gemini',
    dateRange: '5月21日 - 6月21日',
    element: '风象',
    ruling: '水星',
    traits: ['好奇', '适应性强', '灵活', '交际'],
    strengths: ['沟通能力', '适应性', '学习能力', '多才多艺'],
    weaknesses: ['优柔寡断', '紧张', '不一致', '肤浅'],
    likes: ['交谈', '阅读', '学习新事物', '自由'],
    dislikes: ['孤独', '限制', '重复', '常规'],
    description: '双子座是黄道十二宫的第三个星座，以其多变性和沟通能力而著称。双子座的人通常聪明、好奇心强，喜欢学习新事物和与人交流。他们思维敏捷，适应性强，但有时可能显得优柔寡断或肤浅。'
  },
  {
    name: '巨蟹座',
    nameEn: 'Cancer',
    dateRange: '6月22日 - 7月22日',
    element: '水象',
    ruling: '月亮',
    traits: ['情感丰富', '直觉', '保护', '敏感'],
    strengths: ['情感丰富', '忠诚', '保护', '同情心'],
    weaknesses: ['情绪化', '多愁善感', '过度保护', '记仇'],
    likes: ['家庭', '安全感', '传统', '水'],
    dislikes: ['陌生人', '批评', '暴露隐私', '冷漠'],
    description: '巨蟹座是黄道十二宫的第四个星座，以其情感丰富和保护性而闻名。巨蟹座的人通常非常关心家庭和亲人，有很强的直觉和同情心。他们重视安全感和稳定性，但有时可能过于情绪化或多愁善感。'
  },
  {
    name: '狮子座',
    nameEn: 'Leo',
    dateRange: '7月23日 - 8月22日',
    element: '火象',
    ruling: '太阳',
    traits: ['自信', '慷慨', '忠诚', '戏剧性'],
    strengths: ['创造力', '慷慨', '温暖', '幽默'],
    weaknesses: ['自负', '固执', '懒惰', '不灵活'],
    likes: ['戏剧', '休闲', '昂贵的东西', '明亮的颜色'],
    dislikes: ['被忽视', '面对现实', '不被欣赏', '困难'],
    description: '狮子座是黄道十二宫的第五个星座，以其自信和领导能力而著称。狮子座的人通常热情、慷慨、忠诚，喜欢成为关注的焦点。他们有很强的创造力和表现力，但有时可能显得自负或固执。'
  },
  {
    name: '处女座',
    nameEn: 'Virgo',
    dateRange: '8月23日 - 9月22日',
    element: '土象',
    ruling: '水星',
    traits: ['分析', '实际', '勤奋', '批判'],
    strengths: ['分析能力', '勤奋', '实用', '可靠'],
    weaknesses: ['挑剔', '过度担忧', '完美主义', '过度批判'],
    likes: ['动物', '健康食品', '书籍', '自然'],
    dislikes: ['粗鲁', '寻求帮助', '成为关注焦点', '混乱'],
    description: '处女座是黄道十二宫的第六个星座，以其分析能力和实际性而闻名。处女座的人通常非常勤奋、细心和有条理，注重细节和完美。他们有很强的分析能力和批判性思维，但有时可能过于挑剔或担忧。'
  },
  {
    name: '天秤座',
    nameEn: 'Libra',
    dateRange: '9月23日 - 10月23日',
    element: '风象',
    ruling: '金星',
    traits: ['平衡', '和谐', '公正', '社交'],
    strengths: ['外交', '公平', '社交能力', '合作'],
    weaknesses: ['优柔寡断', '逃避冲突', '怨恨', '自怜'],
    likes: ['和谐', '分享', '户外活动', '艺术'],
    dislikes: ['暴力', '不公', '粗鲁', '一致性'],
    description: '天秤座是黄道十二宫的第七个星座，以其平衡感和公正性而著称。天秤座的人通常追求和谐与平衡，有很强的社交能力和外交才能。他们欣赏美丽和艺术，但有时可能显得优柔寡断或逃避冲突。'
  },
  {
    name: '天蝎座',
    nameEn: 'Scorpio',
    dateRange: '10月24日 - 11月22日',
    element: '水象',
    ruling: '冥王星',
    traits: ['热情', '坚定', '神秘', '强烈'],
    strengths: ['决心', '勇气', '忠诚', '洞察力'],
    weaknesses: ['嫉妒', '固执', '操控', '怀疑'],
    likes: ['真相', '事实', '目标', '伟大的梦想'],
    dislikes: ['虚假', '被动', '谎言', '肤浅'],
    description: '天蝎座是黄道十二宫的第八个星座，以其强烈的情感和神秘感而闻名。天蝎座的人通常非常热情、坚定和有洞察力，他们追求真相和深度。天蝎座的人有很强的决心和忠诚度，但有时可能显得嫉妒或固执。'
  },
  {
    name: '射手座',
    nameEn: 'Sagittarius',
    dateRange: '11月23日 - 12月21日',
    element: '火象',
    ruling: '木星',
    traits: ['乐观', '自由', '哲学', '直率'],
    strengths: ['慷慨', '幽默', '热情', '乐观'],
    weaknesses: ['承诺恐惧症', '不耐烦', '说话不经大脑', '缺乏责任感'],
    likes: ['自由', '旅行', '哲学', '户外活动'],
    dislikes: ['束缚', '细节', '被控制', '平凡'],
    description: '射手座是黄道十二宫的第九个星座，以其乐观和自由精神而著称。射手座的人通常热情、直率、乐观，喜欢冒险和探索。他们有很强的哲学思维和幽默感，但有时可能显得不耐烦或缺乏责任感。'
  },
  {
    name: '摩羯座',
    nameEn: 'Capricorn',
    dateRange: '12月22日 - 1月19日',
    element: '土象',
    ruling: '土星',
    traits: ['负责', '纪律', '自控', '保守'],
    strengths: ['责任感', '纪律性', '自控', '管理能力'],
    weaknesses: ['固执', '悲观', '冷漠', '过于传统'],
    likes: ['家庭', '传统', '质量', '成就'],
    dislikes: ['几乎所有新潮的东西', '承认失败', '浪费时间', '肤浅'],
    description: '摩羯座是黄道十二宫的第十个星座，以其责任感和纪律性而闻名。摩羯座的人通常非常务实、有抱负、有耐心，重视传统和成就。他们有很强的自控能力和管理才能，但有时可能显得过于保守或悲观。'
  },
  {
    name: '水瓶座',
    nameEn: 'Aquarius',
    dateRange: '1月20日 - 2月18日',
    element: '风象',
    ruling: '天王星',
    traits: ['独立', '原创', '人道主义', '叛逆'],
    strengths: ['进步', '原创', '独立', '人道主义'],
    weaknesses: ['情感疏离', '叛逆', '固执', '不切实际'],
    likes: ['有趣', '帮助他人', '与朋友在一起', '智力对话'],
    dislikes: ['限制', '破碎的承诺', '孤独', '平凡'],
    description: '水瓶座是黄道十二宫的第十一个星座，以其独立性和创新精神而著称。水瓶座的人通常非常有创意、独立、人道主义，喜欢新奇和变革。他们有很强的智力和社会意识，但有时可能显得情感疏离或叛逆。'
  },
  {
    name: '双鱼座',
    nameEn: 'Pisces',
    dateRange: '2月19日 - 3月20日',
    element: '水象',
    ruling: '海王星',
    traits: ['直觉', '情感', '艺术', '梦幻'],
    strengths: ['富有同情心', '艺术', '直觉', '温柔'],
    weaknesses: ['恐惧', '过度信任', '悲伤', '逃避现实'],
    likes: ['独处', '睡眠', '音乐', '浪漫'],
    dislikes: ['批评', '残忍', '过去的事实', '平凡'],
    description: '双鱼座是黄道十二宫的第十二个星座，以其情感丰富和直觉能力而闻名。双鱼座的人通常非常有同情心、艺术感和直觉，他们富有想象力和敏感性。双鱼座的人通常很温柔和善良，但有时可能显得过于理想化或逃避现实。'
  }
];

// 生成星座运势
export const generateHoroscope = (
  zodiac: string,
  type: string,
  date: string
): HoroscopeData => {
  // 根据星座和日期生成伪随机数
  const seed = hashString(zodiac + type + date);
  
  // 生成运势内容
  return {
    zodiac,
    type,
    date,
    overview: generateOverview(zodiac, type, seed),
    mood: generateMood(seed),
    lucky_number: generateLuckyNumber(seed),
    lucky_color: generateLuckyColor(seed),
    compatibility: generateCompatibility(zodiac, seed),
    work: generateWorkAdvice(zodiac, type, seed),
    love: generateLoveAdvice(zodiac, type, seed),
    relationships: generateRelationshipsAdvice(zodiac, type, seed),
    health: generateHealthAdvice(zodiac, type, seed)
  };
};

// 生成详细的星座信息
export const getDetailedZodiacInfo = (zodiac: string): ZodiacInfo => {
  const index = zodiacSigns.indexOf(zodiac);
  if (index === -1) {
    return defaultZodiacInfo;
  }
  
  return zodiacInfoList[index];
};

// 辅助函数：根据字符串生成哈希值
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// 生成总体运势
const generateOverview = (zodiac: string, type: string, seed: number): string => {
  // 根据不同的类型生成不同的时间前缀
  let timePrefix = '';
  switch (type) {
    case 'daily':
      timePrefix = '今天';
      break;
    case 'tomorrow':
      timePrefix = '明天';
      break;
    case 'weekly':
      timePrefix = '这周';
      break;
    case 'monthly':
      timePrefix = '这个月';
      break;
    case 'yearly':
      timePrefix = '今年';
      break;
    default:
      timePrefix = '今天';
  }

  const overviews = [
    `${timePrefix}对于${zodiac}来说是充满活力的时段。你的创造力和直觉都处于高峰状态，这将帮助你解决一些棘手的问题。`,
    `${zodiac}${timePrefix}可能会面临一些挑战，但不要担心，这些挑战将帮助你成长。保持冷静和耐心，你会度过这个时期。`,
    `${timePrefix}是${zodiac}反思和计划的好时机。花些时间思考你的长期目标，并制定实现这些目标的具体步骤。`,
    `${zodiac}${timePrefix}的社交运势很好。这是与朋友和家人联系的好时机，也可能遇到对你未来很重要的人。`,
    `${timePrefix}${zodiac}的财运不错。可能会有意外的收入或者投资机会，但记得谨慎决策，不要冲动行事。`,
    `${zodiac}${timePrefix}的健康状况需要关注。确保你有足够的休息，并注意饮食和锻炼，保持身心健康。`,
    `${timePrefix}是${zodiac}展示才能的好时机。不要害怕站在聚光灯下，你的努力和才华将得到认可和赞赏。`,
    `${zodiac}${timePrefix}可能会感到有些情绪波动。尝试通过冥想或其他放松技巧来平衡你的情绪，保持内心平静。`,
    `${timePrefix}对于${zodiac}来说是学习和成长的时期。保持开放的心态，你可能会获得新的见解和知识。`,
    `${zodiac}${timePrefix}的直觉特别强。相信你的第一感觉，它可能会引导你做出正确的决定。`
  ];

  const index = seed % overviews.length;
  return overviews[index];
};

// 生成情绪状态
const generateMood = (seed: number): string => {
  const moods = [
    '平静', '兴奋', '满足', '焦虑', '乐观',
    '沉思', '活力充沛', '敏感', '平衡', '热情',
    '冷静', '好奇', '放松', '专注', '愉快'
  ];

  const index = seed % moods.length;
  return moods[index];
};

// 生成幸运数字
const generateLuckyNumber = (seed: number): string => {
  const number = (seed % 99) + 1;
  return number.toString();
};

// 生成幸运颜色
const generateLuckyColor = (seed: number): string => {
  const colors = [
    '红色', '蓝色', '绿色', '黄色', '紫色',
    '橙色', '粉色', '白色', '黑色', '金色',
    '银色', '棕色', '青色', '米色', '灰色'
  ];

  const index = seed % colors.length;
  return colors[index];
};

// 生成相配星座
const generateCompatibility = (zodiac: string, seed: number): string => {
  // 排除自己的星座
  const compatibleSigns = zodiacSigns.filter(sign => sign !== zodiac);
  const index = seed % compatibleSigns.length;
  return compatibleSigns[index];
};

// 生成工作建议
const generateWorkAdvice = (zodiac: string, type: string, seed: number): string => {
  // 根据不同的类型生成不同的时间前缀
  let timePrefix = '';
  switch (type) {
    case 'daily':
      timePrefix = '今天';
      break;
    case 'tomorrow':
      timePrefix = '明天';
      break;
    case 'weekly':
      timePrefix = '这周';
      break;
    case 'monthly':
      timePrefix = '这个月';
      break;
    case 'yearly':
      timePrefix = '今年';
      break;
    default:
      timePrefix = '今天';
  }

  const advices = [
    `${timePrefix}是${zodiac}在工作中展示领导能力的好时机。不要害怕承担更多责任，你的努力将得到回报。`,
    `${zodiac}${timePrefix}在工作中可能会遇到一些挑战。保持冷静和专注，寻求同事的支持和建议。`,
    `${timePrefix}是${zodiac}反思职业目标的好时机。考虑你的长期职业规划，并采取具体步骤向这些目标迈进。`,
    `${zodiac}${timePrefix}的团队合作运势很好。这是与同事合作解决问题的好时机，共同努力将带来更好的结果。`,
    `${timePrefix}${zodiac}的创造力特别强。利用这一点来解决工作中的问题，你可能会有突破性的想法。`,
    `${zodiac}${timePrefix}应该注意工作与生活的平衡。不要让工作压力影响你的健康和个人生活。`,
    `${timePrefix}是${zodiac}学习新技能的好时机。参加培训或研讨会，提升你的专业知识和能力。`,
    `${zodiac}${timePrefix}可能会收到关于工作表现的反馈。保持开放的心态，将批评视为成长的机会。`,
    `${timePrefix}对于${zodiac}来说是建立职业网络的好时机。参加行业活动或与同行交流，扩展你的人脉。`,
    `${zodiac}${timePrefix}应该专注于完成未完成的任务。清理你的待办事项列表，为新的项目腾出空间。`
  ];

  const index = seed % advices.length;
  return advices[index];
};

// 生成爱情建议
const generateLoveAdvice = (zodiac: string, type: string, seed: number): string => {
  // 根据不同的类型生成不同的时间前缀
  let timePrefix = '';
  switch (type) {
    case 'daily':
      timePrefix = '今天';
      break;
    case 'tomorrow':
      timePrefix = '明天';
      break;
    case 'weekly':
      timePrefix = '这周';
      break;
    case 'monthly':
      timePrefix = '这个月';
      break;
    case 'yearly':
      timePrefix = '今年';
      break;
    default:
      timePrefix = '今天';
  }

  const advices = [
    `${timePrefix}是${zodiac}表达爱意的好时机。不要害怕向伴侣表达你的感受，真诚的沟通将加深你们的关系。`,
    `${zodiac}${timePrefix}在感情中可能会遇到一些挑战。保持耐心和理解，尝试从伴侣的角度看问题。`,
    `${timePrefix}是${zodiac}反思感情需求的好时机。考虑你在关系中真正想要什么，并与伴侣坦诚交流。`,
    `${zodiac}${timePrefix}的浪漫运势很好。这是与伴侣共度浪漫时光的好时机，或者对单身者来说可能会遇到有趣的人。`,
    `${timePrefix}${zodiac}应该关注感情中的小细节。一个小小的体贴举动可能会对你的关系产生积极影响。`,
    `${zodiac}${timePrefix}可能会感到有些情感波动。尝试理解这些情绪的根源，避免将负面情绪投射到伴侣身上。`,
    `${timePrefix}是${zodiac}在感情中寻求平衡的好时机。确保你既给予又接受，保持关系的健康发展。`,
    `${zodiac}${timePrefix}应该关注自己的需求。自爱是健康关系的基础，确保你的情感需求得到满足。`,
    `${timePrefix}对于${zodiac}来说是加深感情连接的好时机。与伴侣分享你的梦想和恐惧，建立更深层次的理解。`,
    `${zodiac}单身者${timePrefix}可能会遇到有吸引力的人。保持开放的心态，但也要保持真实的自我。`
  ];

  const index = seed % advices.length;
  return advices[index];
};

// 生成健康建议
const generateHealthAdvice = (zodiac: string, type: string, seed: number): string => {
  // 根据不同的类型生成不同的时间前缀
  let timePrefix = '';
  switch (type) {
    case 'daily':
      timePrefix = '今天';
      break;
    case 'tomorrow':
      timePrefix = '明天';
      break;
    case 'weekly':
      timePrefix = '这周';
      break;
    case 'monthly':
      timePrefix = '这个月';
      break;
    case 'yearly':
      timePrefix = '今年';
      break;
    default:
      timePrefix = '今天';
  }

  const advices = [
    `${timePrefix}${zodiac}应该特别注意身体的信号。如果感到疲劳或不适，给自己一些休息的时间。`,
    `${zodiac}${timePrefix}的能量水平很高。这是进行体育锻炼或开始新健身计划的好时机。`,
    `${timePrefix}是${zodiac}关注饮食健康的好时机。尝试增加更多的水果和蔬菜，减少加工食品的摄入。`,
    `${zodiac}${timePrefix}应该关注心理健康。尝试冥想或深呼吸练习，减轻压力和焦虑。`,
    `${timePrefix}${zodiac}可能会感到有些疲劳。确保你有足够的睡眠，并在需要时小憩一下。`,
    `${zodiac}${timePrefix}应该避免过度劳累。合理安排你的时间和精力，避免倦怠。`,
    `${timePrefix}是${zodiac}尝试新健康习惯的好时机。考虑加入瑜伽课或尝试新的健康食谱。`,
    `${zodiac}${timePrefix}应该关注姿势和人体工程学。特别是如果你长时间坐在电脑前工作。`,
    `${timePrefix}对于${zodiac}来说是戒除不良习惯的好时机。考虑减少咖啡因或糖的摄入，或者戒烟。`,
    `${zodiac}${timePrefix}应该关注水分摄入。确保你喝足够的水，保持身体水分平衡。`
  ];

  const index = seed % advices.length;
  return advices[index];
};

// 生成友人关系建议
const generateRelationshipsAdvice = (zodiac: string, type: string, seed: number): string => {
  // 根据不同的类型生成不同的时间前缀
  let timePrefix = '';
  switch (type) {
    case 'daily':
      timePrefix = '今天';
      break;
    case 'tomorrow':
      timePrefix = '明天';
      break;
    case 'weekly':
      timePrefix = '这周';
      break;
    case 'monthly':
      timePrefix = '这个月';
      break;
    case 'yearly':
      timePrefix = '今年';
      break;
    default:
      timePrefix = '今天';
  }

  const advices = [
    `${timePrefix}是${zodiac}加强友谊联系的好时机。主动联系久未联系的朋友，或者安排一次小型聚会。`,
    `${zodiac}${timePrefix}可能会与一位老朋友重逢，这可能会带来意想不到的机会或启发。`,
    `${timePrefix}${zodiac}在社交场合中会特别受欢迎，你的魅力将吸引志同道合的人靠近。`,
    `${zodiac}${timePrefix}应该学会在友谊中设定健康的界限，不要因为帮助朋友而牺牲自己的需求。`,
    `${timePrefix}对于${zodiac}来说是解决朋友间误会的好时机。坦诚的沟通将帮助你修复可能受损的关系。`,
    `${zodiac}${timePrefix}可能会遇到一些社交挑战，记住保持真实的自我，而不是迎合他人的期望。`,
    `${timePrefix}是${zodiac}扩展社交圈的好时机。参加新的活动或加入兴趣小组，你会遇到有趣的新朋友。`,
    `${zodiac}${timePrefix}应该重视质量而非数量的社交关系，花时间与真正关心你的人在一起。`,
    `${timePrefix}${zodiac}的直觉在判断他人意图方面特别准确，相信你的感觉来决定谁值得你的信任。`,
    `${zodiac}在${timePrefix}的团队合作中表现出色，你的协调能力和包容心将帮助集体达成目标。`
  ];

  const index = seed % advices.length;
  return advices[index];
};