#!/bin/bash

echo "启动博客网站..."

# 启动后端服务器
cd server
npm start &
SERVER_PID=$!

# 等待后端启动
sleep 2

# 启动前端开发服务器
cd ../client
npm run dev &
CLIENT_PID=$!

echo "后端服务器运行在 http://localhost:3001"
echo "前端应用运行在 http://localhost:3000"
echo "按 Ctrl+C 停止所有服务"

# 捕获 Ctrl+C 信号并终止所有进程
trap "kill $SERVER_PID $CLIENT_PID; exit" INT

# 等待
wait
