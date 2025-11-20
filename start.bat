@echo off
echo 启动博客网站...

start "Blog Server" cmd /k "cd server && npm start"
timeout /t 2 /nobreak > nul
start "Blog Client" cmd /k "cd client && npm run dev"

echo 后端服务器运行在 http://localhost:3001
echo 前端应用运行在 http://localhost:3000
echo 在各自的窗口中按 Ctrl+C 停止服务
