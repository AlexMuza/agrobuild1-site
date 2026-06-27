#!/usr/bin/env bash
# Первичная настройка или полное восстановление деплоя agrobuild1 на Ubuntu VPS.
# Запуск на сервере: bash setup-agrobuild-web.sh
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive
export NEEDRESTART_MODE=a

: "${DEPLOY_PATH:=/var/www/html}"
: "${PM2_APP_NAME:=agrobuild1}"
: "${REPO_URL:=https://github.com/AlexMuza/agrobuild1-site.git}"
: "${DEPLOY_USER:=$(whoami)}"

echo "=== agrobuild1: настройка в ${DEPLOY_PATH} ==="

pm2 delete "$PM2_APP_NAME" 2>/dev/null || true

sudo mkdir -p "$DEPLOY_PATH"
sudo chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "$DEPLOY_PATH"

if [[ -d "${DEPLOY_PATH}/.git" ]]; then
  echo "=== Обновление существующего клона ==="
  git -C "$DEPLOY_PATH" fetch origin
  git -C "$DEPLOY_PATH" reset --hard origin/main
  git -C "$DEPLOY_PATH" clean -fdx
else
  echo "=== Очистка и клонирование ==="
  find "$DEPLOY_PATH" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
  git clone "$REPO_URL" "$DEPLOY_PATH"
fi

cd "$DEPLOY_PATH"

if [[ ! -f .env ]]; then
  cp .env.example .env
fi

# Минимальные production-флаги (не затираем уже настроенные секреты)
ensure_env() {
  local key="$1"
  local value="$2"
  if grep -q "^${key}=" .env; then
    sed -i "s|^${key}=.*|${key}=${value}|" .env
  else
    echo "${key}=${value}" >> .env
  fi
}

ensure_env NODE_ENV production
ensure_env CAPTCHA_DISABLED true
ensure_env TRUST_PROXY true
ensure_env SERVER_PORT 8787

echo "=== Установка зависимостей и сборка ==="
npm ci --include=dev
npm run build
npm prune --omit=dev

echo "=== PM2 ==="
export NODE_ENV=production
pm2 start npm --name "$PM2_APP_NAME" -- start
pm2 save

STARTUP_CMD="$(pm2 startup systemd -u "$DEPLOY_USER" --hp "$HOME" | tail -1 || true)"
if [[ "$STARTUP_CMD" == sudo* ]]; then
  eval "$STARTUP_CMD"
  pm2 save
fi

echo "=== Nginx ==="
sudo tee /etc/nginx/sites-available/agrobuild1 >/dev/null <<'NGINXEOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name agrobuild1.com www.agrobuild1.com _;

    location / {
        proxy_pass http://127.0.0.1:8787;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINXEOF

sudo ln -sf /etc/nginx/sites-available/agrobuild1 /etc/nginx/sites-enabled/agrobuild1
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl reload nginx

echo "=== Проверка ==="
sleep 2
curl -sf "http://127.0.0.1:8787/api/health"
echo
curl -sf -o /dev/null -w "nginx → HTTP %{http_code}\n" "http://127.0.0.1/"
pm2 status
echo "=== Готово: http://$(hostname -I | awk '{print $1}') ==="
