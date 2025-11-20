#!/bin/bash

# VPS 自动部署脚本
# 使用方法: chmod +x deploy-vps.sh && ./deploy-vps.sh

set -e

echo "🚀 开始部署博客网站..."

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目路径
PROJECT_DIR="/var/www/blog"

# 检查是否为 root 或使用 sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}请使用 sudo 运行此脚本${NC}"
    exit 1
fi

echo -e "${GREEN}1. 检查并安装必要软件...${NC}"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "安装 Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
else
    echo "Node.js 已安装: $(node -v)"
fi

# 检查 Nginx
if ! command -v nginx &> /dev/null; then
    echo "安装 Nginx..."
    apt-get install -y nginx
else
    echo "Nginx 已安装"
fi

# 检查 PM2
if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    npm install -g pm2
else
    echo "PM2 已安装"
fi

echo -e "${GREEN}2. 拉取最新代码...${NC}"

if [ -d "$PROJECT_DIR" ]; then
    cd $PROJECT_DIR
    git pull
else
    echo "项目目录不存在，请先 clone 代码到 $PROJECT_DIR"
    exit 1
fi

echo -e "${GREEN}3. 安装后端依赖...${NC}"
cd $PROJECT_DIR/server
npm install --production

echo -e "${GREEN}4. 构建前端...${NC}"
cd $PROJECT_DIR/client
npm install
npm run build

echo -e "${GREEN}5. 启动/重启后端服务...${NC}"
cd $PROJECT_DIR/server
pm2 delete blog-server 2>/dev/null || true
pm2 start src/index.js --name blog-server
pm2 save

echo -e "${GREEN}6. 配置 Nginx...${NC}"

# 备份现有配置
if [ -f /etc/nginx/sites-available/blog ]; then
    cp /etc/nginx/sites-available/blog /etc/nginx/sites-available/blog.backup.$(date +%Y%m%d_%H%M%S)
fi

# 复制 Nginx 配置
cp $PROJECT_DIR/nginx-vps.conf /etc/nginx/sites-available/blog

# 创建软链接
ln -sf /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx

echo -e "${GREEN}7. 设置开机自启...${NC}"
systemctl enable nginx
pm2 startup systemd -u $SUDO_USER --hp /home/$SUDO_USER
pm2 save

echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""
echo "📝 下一步："
echo "1. 修改 /etc/nginx/sites-available/blog 中的域名"
echo "2. 如需 HTTPS，运行: certbot --nginx -d yourdomain.com"
echo "3. 访问你的网站进行测试"
echo ""
echo "📊 常用命令："
echo "  查看后端日志: pm2 logs blog-server"
echo "  重启后端: pm2 restart blog-server"
echo "  查看 Nginx 日志: tail -f /var/log/nginx/blog_error.log"
