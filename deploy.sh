#!/bin/bash

# ==============================
# 🚀 Next.js Deploy Script
# ==============================

APP_NAME="dichtudong"
PORT=3030
WORKDIR="/var/www/vidocr-clone"
NODE_ENV="production"

echo "=========================================="
echo "🚀 Deploying $APP_NAME on port $PORT ..."
echo "=========================================="

# 1️⃣ Di chuyển vào thư mục dự án
cd $WORKDIR || { echo "❌ Folder $WORKDIR not found!"; exit 1; }

# 2️⃣ Kéo code mới (nếu dùng Git)
if [ -d ".git" ]; then
  echo "🔄 Pulling latest code from Git..."
  git pull origin main || echo "⚠️ Git pull skipped."
fi

# 3️⃣ Cài dependencies
echo "📦 Installing dependencies..."
yarn install --frozen-lockfile || npm install

# 4️⃣ Build production
echo "🏗️ Building project..."
yarn build || npm run build

# 5️⃣ Kiểm tra app trong PM2
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  echo "🔁 Restarting existing PM2 app..."
  if ! pm2 restart "$APP_NAME" --update-env; then
    echo "⚠️ Restart failed, starting a new PM2 app instead..."
    PORT=$PORT NODE_ENV=$NODE_ENV pm2 start npm --name "$APP_NAME" -- run start
  fi
else
  echo "🆕 Starting new PM2 app..."
  PORT=$PORT NODE_ENV=$NODE_ENV pm2 start npm --name "$APP_NAME" -- run start
fi

# 6️⃣ Lưu cấu hình PM2 để tự chạy khi reboot
echo "💾 Saving PM2 config..."
pm2 save
pm2 startup | tail -n 2

# 7️⃣ Hiển thị trạng thái
echo "✅ Deployment completed!"
pm2 list
echo "🌐 App running at: http://$(hostname -I | awk '{print $1}'):$PORT"
