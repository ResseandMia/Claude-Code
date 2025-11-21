# 我的博客网站

一个现代化的、Notion 风格的博客网站，支持富文本编辑、实时保存和文章管理。

## 📦 快速下载

**AntibodySystem Branded Document Generator** 现已可用！

### 🎯 推荐下载方式

**从 GitHub Releases 下载**（最稳定）：
1. 访问本仓库的 [Releases 页面](../../releases)
2. 下载最新版本：
   - Windows 用户：下载 `antibodysystem-branded-docs-v1.0.0.zip`
   - Linux/macOS 用户：下载 `antibodysystem-branded-docs-v1.0.0.tar.gz`
3. 解压后按照 `DISTRIBUTION-README.md` 说明安装

### 📋 其他下载方式

**直接下载分发包**（需要 git 访问权限）：
- [antibodysystem-branded-docs-v1.0.0.zip](./antibodysystem-branded-docs-v1.0.0.zip) (Windows)
- [antibodysystem-branded-docs-v1.0.0.tar.gz](./antibodysystem-branded-docs-v1.0.0.tar.gz) (Linux/macOS)

**完整安装指南**：[📘 DOWNLOAD-INSTRUCTIONS.md](./DOWNLOAD-INSTRUCTIONS.md)

---

## 🚀 快速部署

**想立即部署到云端？**

- 📘 [Zeabur 5分钟快速部署](./QUICK-START-ZEABUR.md) **← 推荐！中文界面，免费额度**
- 📗 [完整部署指南](./DEPLOYMENT.md) - 包含 Vercel、VPS、Docker 等多种方案
- 📕 [Zeabur 详细文档](./ZEABUR-DEPLOYMENT.md) - Zeabur 完整教程

## ✨ 功能特点

- 📝 **富文本编辑器** - 基于 TipTap 的类 Notion 编辑器
- 🎨 **简洁美观** - Notion 风格的界面设计
- 💾 **实时保存** - 自动保存编辑内容
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🗂️ **文章管理** - 创建、编辑、删除文章
- 🚀 **易于部署** - 基于文件的数据存储，无需数据库

## 🛠️ 技术栈

### 前端
- **React** - 用户界面框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的构建工具
- **TipTap** - 富文本编辑器
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Axios** - HTTP 客户端

### 后端
- **Node.js** - JavaScript 运行时
- **Express** - Web 应用框架
- **JSON 文件** - 数据持久化

## 📦 安装与运行

### 前置要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
# 安装服务端依赖
cd server
npm install

# 安装客户端依赖
cd ../client
npm install
```

### 运行项目

**方式一：分别启动**

在两个终端窗口中分别运行：

```bash
# 终端 1 - 启动后端服务器（端口 3001）
cd server
npm start

# 终端 2 - 启动前端开发服务器（端口 3000）
cd client
npm run dev
```

**方式二：使用并行启动（推荐）**

在项目根目录创建启动脚本：

```bash
# Linux/Mac
chmod +x start.sh
./start.sh

# Windows
start.bat
```

### 访问应用

打开浏览器访问：`http://localhost:3000`

## 📖 使用说明

### 创建文章

1. 点击左侧边栏的 "**+ 新建文章**" 按钮
2. 在右侧编辑器中输入标题和内容
3. 内容会自动保存

### 编辑文章

1. 在左侧文章列表中点击要编辑的文章
2. 在右侧编辑器中修改内容
3. 修改会自动保存

### 删除文章

1. 将鼠标悬停在文章列表项上
2. 点击右侧出现的删除图标
3. 确认删除

### 编辑器功能

- **粗体** - 点击 B 按钮或使用快捷键
- **斜体** - 点击 I 按钮或使用快捷键
- **标题** - H1、H2、H3 按钮
- **列表** - 无序列表和有序列表
- **引用** - 添加引用块
- **代码块** - 插入代码块

## 📁 项目结构

```
blog-website/
├── client/                 # 前端应用
│   ├── src/
│   │   ├── components/    # React 组件
│   │   │   ├── Editor.tsx        # 富文本编辑器
│   │   │   └── PostList.tsx      # 文章列表
│   │   ├── pages/        # 页面组件
│   │   ├── hooks/        # 自定义 Hooks
│   │   ├── utils/        # 工具函数
│   │   │   └── api.ts           # API 调用
│   │   ├── styles/       # 样式文件
│   │   │   └── index.css        # 全局样式
│   │   ├── App.tsx       # 主应用组件
│   │   └── main.tsx      # 入口文件
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── server/                 # 后端应用
│   ├── src/
│   │   ├── index.js      # 服务器入口
│   │   └── data/         # 数据存储目录
│   │       └── posts.json       # 文章数据
│   └── package.json
└── README.md
```

## 🔧 配置说明

### 修改端口

**前端端口（默认 3000）：**
编辑 `client/vite.config.ts`：
```typescript
server: {
  port: 3000, // 修改为其他端口
}
```

**后端端口（默认 3001）：**
编辑 `server/src/index.js`：
```javascript
const PORT = 3001; // 修改为其他端口
```

### 数据存储位置

文章数据存储在：`server/src/data/posts.json`

## 🚀 部署

### 构建生产版本

```bash
# 构建前端
cd client
npm run build

# 生产环境运行后端
cd ../server
NODE_ENV=production npm start
```

### 部署建议

- **前端**：可部署到 Vercel、Netlify、GitHub Pages 等静态托管服务
- **后端**：可部署到 Heroku、Railway、Render 等 Node.js 托管服务
- **全栈**：可使用 Docker 容器化部署

## 🎯 未来计划

- [ ] 添加标签和分类功能
- [ ] 支持图片上传
- [ ] 添加搜索功能
- [ ] 支持 Markdown 导入/导出
- [ ] 添加用户认证
- [ ] 深色模式
- [ ] 文章草稿功能
- [ ] 版本历史

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，请通过 Issue 联系。
