# 博客网站部署指南

本指南提供多种部署方案，从简单到专业，你可以根据自己的需求选择。

## 📋 部署方案对比

| 方案 | 难度 | 费用 | 适用场景 |
|------|------|------|----------|
| 方案1：本地运行 | ⭐ | 免费 | 本地测试、个人使用 |
| 方案2：Vercel + Railway | ⭐⭐ | 免费 | 个人博客、小型项目 |
| 方案3：单服务器部署 | ⭐⭐⭐ | 低成本 | 完全掌控、生产环境 |
| 方案4：Docker 部署 | ⭐⭐⭐⭐ | 可选 | 专业部署、易迁移 |

---

## 方案1：本地运行（最简单）

适合在自己电脑上运行，或者内网访问。

### 步骤：

1. **安装依赖**
```bash
# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

2. **启动服务**

**Linux/Mac：**
```bash
chmod +x start.sh
./start.sh
```

**Windows：**
双击运行 `start.bat`

**或者手动启动：**
```bash
# 终端1 - 启动后端
cd server
npm start

# 终端2 - 启动前端
cd client
npm run dev
```

3. **访问**
打开浏览器访问：`http://localhost:3000`

---

## 方案2：免费云部署（推荐新手）

使用免费的云服务，无需自己的服务器。

### 2.1 前端部署到 Vercel（免费）

Vercel 是最适合部署 React 应用的平台。

**步骤：**

1. 注册 [Vercel](https://vercel.com) 账号

2. 安装 Vercel CLI
```bash
npm install -g vercel
```

3. 在 `client` 目录下创建 `vercel.json`：
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "你的后端URL/api/:path*"
    }
  ]
}
```

4. 部署前端
```bash
cd client
vercel --prod
```

5. 按照提示完成部署，Vercel 会给你一个域名，如：`https://your-blog.vercel.app`

### 2.2 后端部署到 Railway（免费）

Railway 提供免费的 Node.js 托管。

**步骤：**

1. 注册 [Railway](https://railway.app) 账号

2. 安装 Railway CLI
```bash
npm install -g @railway/cli
```

3. 登录并部署
```bash
cd server
railway login
railway init
railway up
```

4. 获取后端 URL，如：`https://your-blog-production.up.railway.app`

5. 更新前端的 API 地址（在 Vercel 环境变量中设置）

### 2.3 替代方案：Netlify + Render

- **前端**: [Netlify](https://www.netlify.com)（免费）
- **后端**: [Render](https://render.com)（免费）

---

## 方案3：VPS 单服务器部署

如果你有自己的云服务器（阿里云、腾讯云、AWS 等），这是最灵活的方案。

### 前置要求：
- 一台 Linux 服务器（Ubuntu/CentOS）
- Node.js 16+
- Nginx
- PM2（进程管理器）

### 步骤：

#### 1. 安装必要软件

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 Nginx
sudo apt install -y nginx

# 安装 PM2
sudo npm install -g pm2
```

#### 2. 上传代码到服务器

```bash
# 在本地
git push origin main

# 在服务器
cd /var/www
git clone https://github.com/你的用户名/Claude-Code.git blog
cd blog
```

#### 3. 安装依赖并构建

```bash
# 安装后端依赖
cd server
npm install --production

# 安装前端依赖并构建
cd ../client
npm install
npm run build
```

#### 4. 配置 PM2 启动后端

```bash
cd /var/www/blog/server

# 启动后端
pm2 start src/index.js --name blog-server

# 设置开机自启
pm2 startup
pm2 save
```

#### 5. 配置 Nginx

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/blog
```

粘贴以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 改成你的域名或 IP

    # 前端静态文件
    location / {
        root /var/www/blog/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. 配置 SSL（可选但推荐）

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com
```

#### 7. 访问你的网站

浏览器访问：`http://your-domain.com` 或 `http://your-server-ip`

---

## 方案4：Docker 部署（最专业）

使用 Docker 容器化部署，易于迁移和扩展。

### 创建 Docker 配置文件

#### 1. 创建前端 Dockerfile

`client/Dockerfile`：
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

`client/nginx.conf`：
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    location /api {
        proxy_pass http://server:3001;
    }
}
```

#### 2. 创建后端 Dockerfile

`server/Dockerfile`：
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

#### 3. 创建 docker-compose.yml

在项目根目录：
```yaml
version: '3.8'

services:
  server:
    build: ./server
    container_name: blog-server
    ports:
      - "3001:3001"
    volumes:
      - ./server/src/data:/app/src/data
    restart: unless-stopped

  client:
    build: ./client
    container_name: blog-client
    ports:
      - "80:80"
    depends_on:
      - server
    restart: unless-stopped
```

#### 4. 部署

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

---

## 📝 部署后的配置

### 数据备份

文章数据存储在 `server/src/data/posts.json`，定期备份这个文件：

```bash
# 创建备份脚本
nano backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp server/src/data/posts.json backups/posts_$DATE.json
echo "Backup created: posts_$DATE.json"
```

```bash
chmod +x backup.sh

# 设置定时备份（每天凌晨2点）
crontab -e
# 添加：0 2 * * * /var/www/blog/backup.sh
```

### 环境变量配置

如果需要配置不同环境的端口等：

**server/.env**：
```env
PORT=3001
NODE_ENV=production
```

**client/.env.production**：
```env
VITE_API_URL=https://your-api-domain.com
```

---

## 🔧 常见问题

### 1. 前端访问不到后端 API

检查 CORS 配置，确保后端允许前端域名访问。

### 2. 服务器重启后服务停止

确保使用 PM2 并执行了 `pm2 startup` 和 `pm2 save`。

### 3. 文件权限问题

```bash
sudo chown -R $USER:$USER /var/www/blog
chmod -R 755 /var/www/blog
```

### 4. Nginx 502 错误

检查后端是否正常运行：
```bash
pm2 status
pm2 logs blog-server
```

---

## 🚀 推荐部署方案

**个人博客（新手）：**
- 前端：Vercel（免费）
- 后端：Railway（免费）

**小团队/公司：**
- 单台 VPS + Nginx + PM2

**专业/企业：**
- Docker + Kubernetes
- 或使用云服务（AWS/阿里云全家桶）

---

## 📞 需要帮助？

如果在部署过程中遇到问题，请提供：
1. 部署方案编号
2. 错误信息
3. 服务器环境（如果是 VPS）

祝你部署顺利！🎉
