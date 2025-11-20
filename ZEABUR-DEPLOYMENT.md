# Zeabur 部署指南 🚀

Zeabur 是一个对中国用户友好的云平台，支持中文界面，可以轻松部署前后端应用。

## 🎯 为什么选择 Zeabur？

- ✅ **中文界面** - 操作简单易懂
- ✅ **免费额度** - 个人博客完全够用
- ✅ **一键部署** - 支持 GitHub 自动部署
- ✅ **前后端一起** - 无需分开配置
- ✅ **自动 HTTPS** - 免费提供域名和证书
- ✅ **国内访问快** - 比国外平台更快

---

## 📋 部署步骤

### 方法一：通过 GitHub 部署（推荐）

#### 1. 准备工作

确保你的代码已经推送到 GitHub：
```bash
git add .
git commit -m "准备部署到 Zeabur"
git push
```

#### 2. 注册 Zeabur 账号

1. 访问 [Zeabur 官网](https://zeabur.com)
2. 点击右上角 "登录" 或 "开始使用"
3. 使用 GitHub 账号登录（推荐）

#### 3. 创建项目

1. 登录后，点击 "创建项目"
2. 输入项目名称，如：`my-blog`
3. 选择区域（推荐选择香港或新加坡）

#### 4. 部署后端服务

1. 在项目页面，点击 "添加服务"
2. 选择 "从 GitHub 部署"
3. 选择你的博客仓库
4. Zeabur 会自动检测到项目结构

**配置后端：**
- 服务名称：`blog-server`
- 根目录：`server`
- 构建命令：留空（自动检测）
- 启动命令：`npm start`
- 端口：`3001`

5. 点击 "部署"

#### 5. 部署前端服务

1. 再次点击 "添加服务"
2. 选择同一个 GitHub 仓库
3. 这次配置前端

**配置前端：**
- 服务名称：`blog-client`
- 根目录：`client`
- 构建命令：`npm run build`
- 输出目录：`dist`

#### 6. 配置环境变量

**前端环境变量：**
1. 进入 `blog-client` 服务
2. 点击 "变量" 标签
3. 添加环境变量：
   - 名称：`VITE_API_URL`
   - 值：`https://blog-server-xxxxx.zeabur.app`（后端的 Zeabur 域名）

**后端环境变量：**
1. 进入 `blog-server` 服务
2. 点击 "变量" 标签
3. 添加环境变量：
   - 名称：`PORT`
   - 值：`3001`
   - 名称：`NODE_ENV`
   - 值：`production`

#### 7. 获取域名

部署完成后：
1. Zeabur 会自动分配域名
2. 前端：`https://blog-client-xxxxx.zeabur.app`
3. 后端：`https://blog-server-xxxxx.zeabur.app`

你也可以绑定自己的域名！

---

### 方法二：通过模板一键部署（最简单）

#### 1. 创建 zbpack.json 配置

我已经为你准备好了配置文件，直接使用即可。

#### 2. 推送代码到 GitHub

```bash
git add .
git commit -m "添加 Zeabur 配置"
git push
```

#### 3. 一键部署

1. 访问你的 GitHub 仓库
2. 点击仓库中的 "Deploy on Zeabur" 按钮（如果我添加了）
3. 或者在 Zeabur 控制台选择 GitHub 仓库
4. Zeabur 会自动识别配置并部署

---

## 🔧 配置文件说明

### 后端配置 (server/zbpack.json)

这个文件告诉 Zeabur 如何构建和运行后端。

### 前端配置 (client/zbpack.json)

这个文件告诉 Zeabur 如何构建前端。

### API 地址配置

前端需要知道后端的地址，有两种方式：

**方式1：使用环境变量**
在 Zeabur 控制台设置 `VITE_API_URL`

**方式2：使用相对路径**
如果前后端在同一个域名下，可以直接使用 `/api`

---

## 📝 详细步骤（带截图说明）

### Step 1: 登录 Zeabur

![登录页面]

- 访问 https://zeabur.com
- 点击 "使用 GitHub 登录"
- 授权 Zeabur 访问你的 GitHub 仓库

### Step 2: 创建项目

- 点击 "Create Project"
- 输入项目名称
- 选择服务器区域（推荐 Hong Kong）

### Step 3: 部署后端

- 点击 "Add Service"
- 选择 "Git"
- 选择你的仓库
- 选择分支（通常是 main 或 master）
- 根路径填写：`server`
- Zeabur 会自动检测 package.json

### Step 4: 部署前端

- 再次点击 "Add Service"
- 选择同一个仓库
- 根路径填写：`client`
- Zeabur 会自动检测并构建

### Step 5: 配置域名

- 每个服务都会获得一个 Zeabur 子域名
- 可以在 "Networking" 中添加自定义域名

---

## 🔐 配置自定义域名（可选）

如果你有自己的域名：

### 1. 在 Zeabur 中添加域名

1. 进入服务设置
2. 点击 "Networking" 或 "域名"
3. 点击 "添加域名"
4. 输入你的域名，如：`blog.yourdomain.com`

### 2. 配置 DNS

在你的域名提供商（阿里云、腾讯云等）：

1. 添加 CNAME 记录
2. 主机记录：`blog`（或其他子域名）
3. 记录值：Zeabur 提供的 CNAME 值
4. 等待 DNS 生效（通常几分钟）

### 3. 自动 HTTPS

Zeabur 会自动为你的自定义域名配置 SSL 证书！

---

## 💾 数据持久化

### 配置 Volume（数据卷）

博客的文章数据存储在 `server/src/data/posts.json`，需要持久化：

1. 进入后端服务设置
2. 点击 "Volumes" 或"存储"
3. 添加 Volume：
   - 挂载路径：`/app/src/data`
   - 这样数据就不会在重新部署时丢失

---

## 🔄 自动部署

### 启用自动部署

1. 在 Zeabur 服务设置中
2. 找到 "Git" 设置
3. 启用 "自动部署"
4. 每次 push 代码到 GitHub，Zeabur 会自动重新部署

### 部署分支

可以选择监听哪个分支：
- `main` - 主分支（生产环境）
- `dev` - 开发分支（测试环境）

---

## 💰 费用说明

### 免费额度（足够个人博客使用）

Zeabur 提供免费套餐：
- ✅ 免费额度：每月 $5 美元等值
- ✅ 域名：免费 Zeabur 子域名
- ✅ HTTPS：免费 SSL 证书
- ✅ 流量：足够个人博客使用

### 超出免费额度

- 按实际使用付费
- 个人博客通常不会超出免费额度
- 可以在控制台查看实时用量

---

## 📊 监控和日志

### 查看日志

1. 进入服务详情
2. 点击 "Logs" 或 "日志"
3. 可以实时查看服务运行日志
4. 方便调试问题

### 监控指标

Zeabur 提供：
- CPU 使用率
- 内存使用率
- 网络流量
- 请求次数

---

## 🐛 常见问题

### 1. 前端无法连接后端

**原因**：API 地址配置错误

**解决**：
```bash
# 在 Zeabur 前端服务的环境变量中添加：
VITE_API_URL=https://你的后端域名.zeabur.app
```

重新部署前端。

### 2. 部署后无法访问

**检查事项**：
- 服务是否正在运行（查看状态）
- 端口配置是否正确
- 查看日志是否有错误

### 3. 数据丢失

**原因**：没有配置 Volume

**解决**：
1. 配置 Volume 挂载 `/app/src/data`
2. 数据会持久化保存

### 4. 构建失败

**常见原因**：
- Node 版本不匹配
- 依赖安装失败

**解决**：
查看构建日志，根据错误信息调整。

---

## 🎯 部署检查清单

部署前确认：

- [ ] 代码已推送到 GitHub
- [ ] package.json 中的依赖完整
- [ ] 后端监听正确的端口
- [ ] 前端 API 地址配置正确

部署后确认：

- [ ] 前端服务运行正常
- [ ] 后端服务运行正常
- [ ] 可以创建新文章
- [ ] 可以编辑文章
- [ ] 可以删除文章
- [ ] 数据持久化配置

---

## 🚀 快速部署命令

```bash
# 1. 添加 Zeabur 配置
git add .
git commit -m "添加 Zeabur 配置"
git push

# 2. 在 Zeabur 网站操作
# - 登录 zeabur.com
# - 创建项目
# - 添加服务（后端）
# - 添加服务（前端）
# - 配置环境变量
# - 完成！
```

---

## 📞 需要帮助？

如果部署过程中遇到问题：

1. 查看 Zeabur 文档：https://zeabur.com/docs
2. 查看服务日志定位问题
3. 告诉我具体的错误信息，我来帮你解决！

---

## 🎉 部署完成后

你的博客将可以通过以下地址访问：

- 前端：`https://your-blog.zeabur.app`
- 后端 API：`https://your-blog-api.zeabur.app`

享受写作吧！✨
