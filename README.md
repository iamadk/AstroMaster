# 星座大师 (AstroMaster)

一款专业的星座运势查询应用，为用户提供每日、每周、每月和每年的星座运势预测。

## 功能特点

- **星座运势查询**：查询白羊座、金牛座等12个星座的运势
- **多种运势类型**：支持每日、明日、每周、每月和每年的运势查询
- **星座计算器**：根据出生日期自动计算星座
- **用户账户系统**：注册登录功能，保存个人星座偏好
- **个性化设置**：深色/浅色主题切换，通知设置等
- **本地数据存储**：使用SQLite保存用户数据和星座运势

## 技术栈

- React Native / Expo
- TypeScript
- React Navigation
- React Native Paper (UI组件库)
- Expo SQLite (本地数据库)
- Expo Notifications (通知功能)
- AsyncStorage (本地存储)

## 安装与运行

### 前提条件

- Node.js (v14.0.0或更高版本)
- npm或yarn
- Expo CLI
- iOS/Android模拟器或实体设备

### 安装步骤

1. 克隆仓库
```
git clone https://github.com/yourusername/astromaster.git
cd astromaster
```

2. 安装依赖
```
npm install
# 或
yarn install
```

3. 启动应用
```
npm start
# 或
yarn start
```

4. 在模拟器或设备上运行
- 按`i`在iOS模拟器上运行
- 按`a`在Android模拟器上运行
- 或使用Expo Go应用扫描终端中显示的QR码

## 项目结构

```
src/
├── contexts/         # React上下文
├── navigation/       # 导航配置
├── screens/          # 应用屏幕
│   ├── auth/         # 认证相关屏幕
│   └── main/         # 主要功能屏幕
├── services/         # 服务层
└── utils/            # 工具函数
assets/               # 图片和其他资源
```

## 使用指南

1. **注册/登录**：首次使用需要创建账户或登录
2. **星座选择**：在首页选择您的星座
3. **运势类型**：选择想要查询的运势类型（每日、每周等）
4. **查看详情**：点击查询按钮后查看详细运势
5. **个人设置**：在个人页面可以修改个人信息和星座
6. **应用设置**：在设置页面可以调整主题、语言和通知等

## 贡献指南

欢迎贡献代码、报告问题或提出新功能建议。请遵循以下步骤：

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

本项目采用MIT许可证 - 详情请参阅LICENSE文件

## 联系方式

项目维护者 - iamadk - 您的邮箱

项目链接: [https://github.com/iamadk/AstroMaster](https://github.com/iamadk/AstroMaster) 