# 技术规范文档 (Technical Specification)

## 项目信息

- **项目名称**: Notion 风格博客系统
- **版本**: 1.0.0
- **文档版本**: 1.0
- **最后更新**: 2024-11-20

---

## 目录

- [1. 项目概述](#1-项目概述)
- [2. 系统架构](#2-系统架构)
- [3. 技术栈](#3-技术栈)
- [4. 数据模型](#4-数据模型)
- [5. API 接口规范](#5-api-接口规范)
- [6. 前端架构](#6-前端架构)
- [7. 后端架构](#7-后端架构)
- [8. 部署架构](#8-部署架构)
- [9. 安全规范](#9-安全规范)
- [10. 性能优化](#10-性能优化)
- [11. 开发规范](#11-开发规范)
- [12. 测试策略](#12-测试策略)
- [13. 未来规划](#13-未来规划)

---

## 1. 项目概述

### 1.1 项目简介

一个现代化的、类 Notion 风格的博客管理系统，支持富文本编辑、实时保存、文章管理等功能。

### 1.2 核心功能

- ✅ 富文本编辑器（支持标题、格式化、列表、引用、代码块）
- ✅ 文章 CRUD 操作
- ✅ 实时自动保存（500ms 防抖）
- ✅ 响应式设计
- ✅ 文章列表展示
- ✅ 数据持久化

### 1.3 目标用户

- 个人博主
- 内容创作者
- 团队协作文档管理

### 1.4 设计原则

- **简洁优先**: 干净的界面，专注内容创作
- **性能优先**: 快速响应，流畅体验
- **易部署**: 无需复杂配置，支持多种部署方式
- **可扩展**: 模块化设计，易于添加新功能

---

## 2. 系统架构

### 2.1 整体架构

```
┌─────────────────────────────────────────────┐
│              浏览器客户端                    │
│  ┌─────────────────────────────────────┐   │
│  │    React 应用 (Vite + TypeScript)   │   │
│  │  ┌──────────┐  ┌──────────────┐    │   │
│  │  │  App.tsx │──│ PostList.tsx │    │   │
│  │  └──────────┘  └──────────────┘    │   │
│  │  ┌──────────────┐  ┌───────────┐   │   │
│  │  │ Editor.tsx   │──│  TipTap   │   │   │
│  │  └──────────────┘  └───────────┘   │   │
│  │  ┌──────────────────────────────┐  │   │
│  │  │      API Client (Axios)      │  │   │
│  │  └──────────────────────────────┘  │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ↓ HTTP/HTTPS
┌─────────────────────────────────────────────┐
│             Node.js 服务器                   │
│  ┌─────────────────────────────────────┐   │
│  │    Express 应用                      │   │
│  │  ┌──────────┐  ┌──────────────┐    │   │
│  │  │  CORS    │  │ Body Parser  │    │   │
│  │  └──────────┘  └──────────────┘    │   │
│  │  ┌──────────────────────────────┐  │   │
│  │  │      API Routes              │  │   │
│  │  │  GET    /api/posts           │  │   │
│  │  │  GET    /api/posts/:id       │  │   │
│  │  │  POST   /api/posts           │  │   │
│  │  │  PUT    /api/posts/:id       │  │   │
│  │  │  DELETE /api/posts/:id       │  │   │
│  │  └──────────────────────────────┘  │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│            文件系统存储                      │
│  ┌─────────────────────────────────────┐   │
│  │     server/src/data/posts.json      │   │
│  │  [                                  │   │
│  │    {                                │   │
│  │      "id": "1234567890",            │   │
│  │      "title": "文章标题",            │   │
│  │      "content": "<p>...</p>",       │   │
│  │      "createdAt": "2024-11-20",     │   │
│  │      "updatedAt": "2024-11-20"      │   │
│  │    }                                │   │
│  │  ]                                  │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### 2.2 数据流

#### 2.2.1 读取文章流程

```
用户打开应用
    ↓
App.tsx (useEffect)
    ↓
getPosts() API 调用
    ↓
GET /api/posts
    ↓
readPosts() 读取 JSON 文件
    ↓
返回文章列表
    ↓
setState 更新状态
    ↓
PostList 组件渲染
```

#### 2.2.2 编辑文章流程

```
用户在编辑器中输入
    ↓
TipTap onUpdate 事件
    ↓
防抖函数 (500ms)
    ↓
handleSave()
    ↓
updatePost() API 调用
    ↓
PUT /api/posts/:id
    ↓
writePosts() 写入 JSON 文件
    ↓
返回更新后的文章
    ↓
setState 更新状态
    ↓
显示"已保存"状态
```

---

## 3. 技术栈

### 3.1 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | ^18.2.0 | UI 框架 |
| TypeScript | ^5.3.3 | 类型系统 |
| Vite | ^5.0.8 | 构建工具 |
| TipTap | ^2.1.13 | 富文本编辑器 |
| Tailwind CSS | ^3.4.0 | 样式框架 |
| Axios | ^1.6.2 | HTTP 客户端 |

### 3.2 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | 18+ | 运行时环境 |
| Express | ^4.18.2 | Web 框架 |
| CORS | ^2.8.5 | 跨域支持 |
| Body Parser | ^1.20.2 | 请求体解析 |

### 3.3 开发工具

| 工具 | 用途 |
|------|------|
| Git | 版本控制 |
| npm | 包管理 |
| ESLint | 代码检查 |
| Prettier | 代码格式化 |

---

## 4. 数据模型

### 4.1 Post (文章) 数据结构

```typescript
interface Post {
  id: string;           // 唯一标识符（时间戳字符串）
  title: string;        // 文章标题
  content: string;      // 文章内容（HTML 格式）
  createdAt: string;    // 创建时间（ISO 8601）
  updatedAt: string;    // 更新时间（ISO 8601）
}
```

### 4.2 数据示例

```json
{
  "id": "1700483261234",
  "title": "我的第一篇博客",
  "content": "<h1>欢迎</h1><p>这是我的第一篇博客文章。</p>",
  "createdAt": "2024-11-20T10:41:01.234Z",
  "updatedAt": "2024-11-20T11:23:15.456Z"
}
```

### 4.3 存储格式

- **文件路径**: `server/src/data/posts.json`
- **格式**: JSON 数组
- **编码**: UTF-8
- **缩进**: 2 空格（美化）

```json
[
  {
    "id": "1700483261234",
    "title": "文章1",
    "content": "<p>内容1</p>",
    "createdAt": "2024-11-20T10:41:01.234Z",
    "updatedAt": "2024-11-20T10:41:01.234Z"
  },
  {
    "id": "1700483262345",
    "title": "文章2",
    "content": "<p>内容2</p>",
    "createdAt": "2024-11-20T11:00:00.000Z",
    "updatedAt": "2024-11-20T11:00:00.000Z"
  }
]
```

### 4.4 字段约束

| 字段 | 类型 | 必填 | 默认值 | 验证规则 |
|------|------|------|--------|----------|
| id | string | 是 | Date.now().toString() | 唯一，数字字符串 |
| title | string | 否 | "无标题" | 最大长度 200 字符 |
| content | string | 否 | "" | HTML 字符串 |
| createdAt | string | 是 | new Date().toISOString() | ISO 8601 格式 |
| updatedAt | string | 是 | new Date().toISOString() | ISO 8601 格式 |

---

## 5. API 接口规范

### 5.1 接口概览

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | / | 健康检查 |
| GET | /health | 健康检查 |
| GET | /api/posts | 获取所有文章 |
| GET | /api/posts/:id | 获取单篇文章 |
| POST | /api/posts | 创建新文章 |
| PUT | /api/posts/:id | 更新文章 |
| DELETE | /api/posts/:id | 删除文章 |

### 5.2 详细接口文档

#### 5.2.1 健康检查

**请求**
```http
GET /
```

**响应**
```json
{
  "status": "ok",
  "message": "博客 API 服务运行中",
  "timestamp": "2024-11-20T10:00:00.000Z"
}
```

---

#### 5.2.2 获取所有文章

**请求**
```http
GET /api/posts
```

**响应**

- **状态码**: 200 OK
- **Content-Type**: application/json

```json
[
  {
    "id": "1700483261234",
    "title": "文章标题",
    "content": "<p>文章内容</p>",
    "createdAt": "2024-11-20T10:41:01.234Z",
    "updatedAt": "2024-11-20T10:41:01.234Z"
  }
]
```

**错误响应**

- **状态码**: 500 Internal Server Error

```json
{
  "error": "Failed to read posts"
}
```

---

#### 5.2.3 获取单篇文章

**请求**
```http
GET /api/posts/:id
```

**路径参数**
- `id` (string): 文章 ID

**响应**

- **状态码**: 200 OK

```json
{
  "id": "1700483261234",
  "title": "文章标题",
  "content": "<p>文章内容</p>",
  "createdAt": "2024-11-20T10:41:01.234Z",
  "updatedAt": "2024-11-20T10:41:01.234Z"
}
```

**错误响应**

- **状态码**: 404 Not Found

```json
{
  "error": "Post not found"
}
```

---

#### 5.2.4 创建新文章

**请求**
```http
POST /api/posts
Content-Type: application/json
```

**请求体**
```json
{
  "title": "新文章",
  "content": "<p>内容</p>"
}
```

**请求体参数**
- `title` (string, optional): 文章标题，默认 "无标题"
- `content` (string, optional): 文章内容，默认 ""

**响应**

- **状态码**: 201 Created

```json
{
  "id": "1700483261234",
  "title": "新文章",
  "content": "<p>内容</p>",
  "createdAt": "2024-11-20T10:41:01.234Z",
  "updatedAt": "2024-11-20T10:41:01.234Z"
}
```

**错误响应**

- **状态码**: 500 Internal Server Error

```json
{
  "error": "Failed to create post"
}
```

---

#### 5.2.5 更新文章

**请求**
```http
PUT /api/posts/:id
Content-Type: application/json
```

**路径参数**
- `id` (string): 文章 ID

**请求体**
```json
{
  "title": "更新的标题",
  "content": "<p>更新的内容</p>"
}
```

**请求体参数**
- `title` (string, optional): 新标题
- `content` (string, optional): 新内容

**响应**

- **状态码**: 200 OK

```json
{
  "id": "1700483261234",
  "title": "更新的标题",
  "content": "<p>更新的内容</p>",
  "createdAt": "2024-11-20T10:41:01.234Z",
  "updatedAt": "2024-11-20T12:00:00.000Z"
}
```

**错误响应**

- **状态码**: 404 Not Found

```json
{
  "error": "Post not found"
}
```

---

#### 5.2.6 删除文章

**请求**
```http
DELETE /api/posts/:id
```

**路径参数**
- `id` (string): 文章 ID

**响应**

- **状态码**: 200 OK

```json
{
  "message": "Post deleted successfully"
}
```

**错误响应**

- **状态码**: 404 Not Found

```json
{
  "error": "Post not found"
}
```

---

## 6. 前端架构

### 6.1 目录结构

```
client/
├── src/
│   ├── components/          # React 组件
│   │   ├── Editor.tsx       # 富文本编辑器组件
│   │   └── PostList.tsx     # 文章列表组件
│   ├── utils/               # 工具函数
│   │   └── api.ts           # API 调用封装
│   ├── styles/              # 样式文件
│   │   └── index.css        # 全局样式
│   ├── App.tsx              # 根组件
│   └── main.tsx             # 应用入口
├── index.html               # HTML 模板
├── vite.config.ts           # Vite 配置
├── tailwind.config.js       # Tailwind 配置
└── tsconfig.json            # TypeScript 配置
```

### 6.2 组件设计

#### 6.2.1 App.tsx (根组件)

**职责**:
- 管理应用全局状态
- 处理文章 CRUD 操作
- 协调子组件通信

**状态管理**:
```typescript
const [posts, setPosts] = useState<Post[]>([])
const [currentPost, setCurrentPost] = useState<Post | null>(null)
const [loading, setLoading] = useState(true)
```

**主要方法**:
- `loadPosts()`: 加载文章列表
- `handleCreatePost()`: 创建新文章
- `handleUpdatePost()`: 更新文章
- `handleDeletePost()`: 删除文章
- `handleSelectPost()`: 选择文章

---

#### 6.2.2 PostList.tsx (文章列表)

**Props**:
```typescript
interface PostListProps {
  posts: Post[]
  currentPost: Post | null
  onSelect: (post: Post) => void
  onDelete: (id: string) => void
}
```

**功能**:
- 显示文章列表
- 高亮当前选中的文章
- 提供删除按钮
- 显示文章摘要和时间

**辅助方法**:
- `formatDate()`: 格式化时间显示
- `getPreview()`: 从 HTML 提取纯文本预览

---

#### 6.2.3 Editor.tsx (编辑器)

**Props**:
```typescript
interface EditorProps {
  post: Post
  onUpdate: (id: string, title: string, content: string) => void
}
```

**状态**:
```typescript
const [title, setTitle] = useState(post.title)
const [isSaving, setIsSaving] = useState(false)
const editor = useEditor({...})
```

**功能**:
- 富文本编辑
- 自动保存（500ms 防抖）
- 工具栏（粗体、斜体、标题等）
- 保存状态指示

**TipTap 配置**:
```typescript
useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: '开始写作...',
    }),
  ],
  content: post.content,
  onUpdate: ({ editor }) => {
    handleSave(title, editor.getHTML())
  },
})
```

---

### 6.3 API 客户端 (api.ts)

**配置**:
```typescript
const BASE_URL = import.meta.env.VITE_API_URL || ''
const API_URL = `${BASE_URL}/api/posts`
```

**方法**:
```typescript
export const getPosts = async () => Promise<Post[]>
export const getPost = async (id: string) => Promise<Post>
export const createPost = async (data: PostData) => Promise<Post>
export const updatePost = async (id: string, data: Partial<PostData>) => Promise<Post>
export const deletePost = async (id: string) => Promise<void>
```

---

### 6.4 样式设计

#### 6.4.1 Tailwind 主题配置

```javascript
theme: {
  extend: {
    colors: {
      'notion-bg': '#ffffff',
      'notion-hover': '#f7f6f3',
      'notion-border': '#e9e9e7',
      'notion-text': '#37352f',
      'notion-secondary': '#787774',
    }
  },
}
```

#### 6.4.2 编辑器样式

- 标题层级: H1 (2.5rem), H2 (2rem), H3 (1.5rem)
- 行高: 1.6 (段落), 1.2-1.4 (标题)
- 代码块: 背景 `#f7f6f3`, 圆角 5px
- 列表: 左边距 2rem

---

## 7. 后端架构

### 7.1 目录结构

```
server/
├── src/
│   ├── data/                # 数据存储目录
│   │   └── posts.json       # 文章数据
│   └── index.js             # 服务器入口
├── package.json
└── .env.example             # 环境变量示例
```

### 7.2 中间件配置

#### 7.2.1 CORS 配置

```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      /\.zeabur\.app$/,
      /\.vercel\.app$/,
      /\.netlify\.app$/
    ];
    // 验证逻辑...
  },
  credentials: true
};
```

**支持的域名**:
- 本地开发: `localhost:3000`, `localhost:5173`
- Zeabur: `*.zeabur.app`
- Vercel: `*.vercel.app`
- Netlify: `*.netlify.app`

#### 7.2.2 Body Parser

```javascript
app.use(bodyParser.json())
```

---

### 7.3 核心函数

#### 7.3.1 ensureDataFile()

**职责**: 确保数据文件存在

```javascript
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}
```

#### 7.3.2 readPosts()

**职责**: 读取所有文章

```javascript
async function readPosts() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}
```

#### 7.3.3 writePosts()

**职责**: 写入文章数据

```javascript
async function writePosts(posts) {
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2));
}
```

---

### 7.4 错误处理

**策略**:
- 所有 API 路由使用 try-catch
- 返回适当的 HTTP 状态码
- 提供描述性错误信息

**错误响应格式**:
```json
{
  "error": "错误描述"
}
```

---

## 8. 部署架构

### 8.1 支持的部署平台

| 平台 | 前端 | 后端 | 难度 |
|------|------|------|------|
| Zeabur | ✅ | ✅ | ⭐ |
| Vercel + Railway | ✅ | ✅ | ⭐⭐ |
| VPS | ✅ | ✅ | ⭐⭐⭐ |
| Docker | ✅ | ✅ | ⭐⭐⭐⭐ |

### 8.2 环境变量

#### 8.2.1 前端环境变量

| 变量名 | 描述 | 示例 |
|--------|------|------|
| `VITE_API_URL` | 后端 API 地址 | `https://api.example.com` |

#### 8.2.2 后端环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `PORT` | 服务器端口 | `3001` |
| `NODE_ENV` | 运行环境 | `development` |

### 8.3 部署配置文件

#### 8.3.1 Zeabur (zbpack.json)

**前端**:
```json
{
  "build_command": "npm install && npm run build",
  "output_dir": "dist"
}
```

**后端**:
```json
{
  "build_command": "npm install",
  "start_command": "npm start",
  "install_command": "npm install --production"
}
```

#### 8.3.2 Docker (Dockerfile)

**前端多阶段构建**:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

**后端**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

---

## 9. 安全规范

### 9.1 CORS 安全

- ✅ 限制允许的域名
- ✅ 生产环境禁用通配符 `*`
- ✅ 使用正则表达式匹配云平台域名

### 9.2 输入验证

**当前实现**:
- 后端接受所有输入（信任客户端）

**建议改进**:
- 添加标题长度验证
- 内容 HTML 清理（防 XSS）
- 文件大小限制

### 9.3 数据安全

**当前实现**:
- 数据存储在文件系统
- 无加密

**建议改进**:
- 敏感数据加密
- 定期备份
- 访问权限控制

### 9.4 API 安全

**建议添加**:
- 身份验证 (JWT)
- 请求速率限制
- API 密钥

---

## 10. 性能优化

### 10.1 前端优化

#### 10.1.1 已实现

- ✅ Vite 快速构建
- ✅ 代码分割（自动）
- ✅ 防抖保存（500ms）
- ✅ React 组件优化

#### 10.1.2 建议改进

- 添加虚拟滚动（长文章列表）
- 图片懒加载
- 添加 Service Worker（PWA）
- 使用 React.memo 优化渲染

### 10.2 后端优化

#### 10.2.1 已实现

- ✅ 异步文件操作
- ✅ Express 中间件优化

#### 10.2.2 建议改进

- 添加缓存层（Redis）
- 数据库索引（如迁移到数据库）
- 压缩响应（gzip）
- CDN 静态资源

### 10.3 网络优化

#### 建议

- 启用 HTTP/2
- 资源预加载
- 减少请求数量
- 使用 CDN

---

## 11. 开发规范

### 11.1 代码风格

**TypeScript/JavaScript**:
- 使用 2 空格缩进
- 使用单引号
- 函数使用 async/await
- 避免 any 类型

**React**:
- 函数组件优先
- 使用 Hooks
- Props 定义接口
- 组件文件首字母大写

**CSS**:
- 使用 Tailwind 工具类
- 避免内联样式
- 语义化类名

### 11.2 命名规范

- **组件**: PascalCase (PostList, Editor)
- **函数**: camelCase (handleUpdate, formatDate)
- **常量**: UPPER_SNAKE_CASE (API_URL, PORT)
- **接口**: PascalCase + I 前缀可选 (Post, IPost)

### 11.3 文件组织

- 一个组件一个文件
- 相关功能放在同一目录
- 工具函数单独目录
- 类型定义集中管理

### 11.4 Git 提交规范

**格式**:
```
<type>(<scope>): <subject>

<body>
```

**Type**:
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

**示例**:
```
feat(editor): 添加代码高亮功能

- 集成 Prism.js
- 支持多种语言
- 添加主题切换
```

---

## 12. 测试策略

### 12.1 测试类型

**建议添加**:

#### 12.1.1 单元测试

- API 函数测试
- 工具函数测试
- 组件单元测试

#### 12.1.2 集成测试

- API 端到端测试
- 组件交互测试

#### 12.1.3 E2E 测试

- 用户流程测试
- 关键功能测试

### 12.2 测试工具

**推荐**:
- **前端**: Vitest, React Testing Library
- **后端**: Jest, Supertest
- **E2E**: Playwright, Cypress

### 12.3 测试覆盖率

**目标**:
- 核心功能: 80%+
- 工具函数: 90%+
- API 路由: 80%+

---

## 13. 未来规划

### 13.1 短期计划 (1-3 个月)

#### 功能增强
- [ ] 添加用户认证系统
- [ ] 支持图片上传
- [ ] 添加文章标签功能
- [ ] 实现搜索功能
- [ ] 添加草稿功能

#### 技术优化
- [ ] 迁移到数据库 (MongoDB/PostgreSQL)
- [ ] 添加单元测试
- [ ] 性能监控
- [ ] 错误追踪 (Sentry)

### 13.2 中期计划 (3-6 个月)

#### 功能增强
- [ ] 多用户支持
- [ ] 文章分类管理
- [ ] 评论系统
- [ ] Markdown 支持
- [ ] 文章版本历史

#### 技术优化
- [ ] GraphQL API
- [ ] 服务端渲染 (SSR)
- [ ] 微服务架构
- [ ] 容器编排 (Kubernetes)

### 13.3 长期计划 (6-12 个月)

#### 功能增强
- [ ] 协作编辑
- [ ] AI 写作助手
- [ ] 多语言支持
- [ ] 移动应用
- [ ] 插件系统

#### 技术优化
- [ ] 分布式部署
- [ ] 实时协作 (WebSocket)
- [ ] CDN 集成
- [ ] 高可用架构

---

## 附录

### A. 相关文档

- [README.md](./README.md) - 项目介绍
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署指南
- [ZEABUR-DEPLOYMENT.md](./ZEABUR-DEPLOYMENT.md) - Zeabur 详细教程
- [QUICK-START-ZEABUR.md](./QUICK-START-ZEABUR.md) - Zeabur 快速开始

### B. 外部资源

- [TipTap 文档](https://tiptap.dev/)
- [React 文档](https://react.dev/)
- [Express 文档](https://expressjs.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

### C. 技术支持

- GitHub Issues: 报告问题
- Pull Requests: 贡献代码
- Discussions: 讨论功能

---

## 更新日志

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | 2024-11-20 | 初始版本 |

---

**文档维护**: 随着项目演进，请及时更新此文档。
