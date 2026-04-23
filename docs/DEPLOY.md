# Деплой на VPS (agrobuild1-site)

Проект — Vite + React (статика в `dist/`) и Express-бэкенд в `server/`. В **production** один процесс Node обслуживает и `/api/*`, и клиентское приложение из `dist/` (см. `server/app.js`, флаги `NODE_ENV` / `SERVE_CLIENT`).

## Автодеплой (GitHub Actions)

При пуше в ветку **`main`** срабатывает [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml): по SSH выполняется `git pull`, `npm ci`, `npm run build`, `npm prune`, `pm2 restart`.

### Секреты репозитория (Settings → Secrets and variables → Actions)

| Секрет | Назначение |
|--------|------------|
| `DEPLOY_HOST` | IP или домен VPS |
| `DEPLOY_USER` | SSH-пользователь |
| `DEPLOY_SSH_KEY` | Приватный ключ (PEM), **без пароля** для CI |
| `DEPLOY_PORT` | Порт SSH (часто `22`) |
| `DEPLOY_PATH` | Каталог с **клоном этого репозитория** на сервере (абсолютный путь) |
| `PM2_APP_NAME` | Имя процесса в PM2 (должно совпадать с тем, что задано при первом `pm2 start`) |

### Боевой VPS (www.agrobuild1.com)

Сайт на вашем сервере развёрнут в **`/var/www/html`**: там лежат клон репозитория, `.env`, собранный `dist/`, а PM2-процесс `agrobuild1` запускает `server/index.js` с рабочей директорией `/var/www/html`. В секрете **`DEPLOY_PATH`** в GitHub укажите:

```text
/var/www/html
```

Если перенесёте проект в другой каталог — обновите секрет и при необходимости значение по умолчанию в [`scripts/deploy-on-server.sh`](../scripts/deploy-on-server.sh).

Ручной прогон того же сценария на сервере: скрипт [`scripts/deploy-on-server.sh`](../scripts/deploy-on-server.sh) (переменные окружения `DEPLOY_PATH`, `PM2_APP_NAME` при необходимости переопределяют значения по умолчанию).

## Первая настройка сервера

1. Установите **Node.js** (LTS), **git**, **npm**, глобально **pm2** (`npm i -g pm2`).
2. Клонируйте репозиторий в каталог деплоя (для текущего боевого сервера это **`/var/www/html`** — совпадает с секретом `DEPLOY_PATH`).
3. Скопируйте [`.env.example`](../.env.example) в **`.env`** в корне проекта на сервере и заполните секреты. Файл **`.env` не коммитить**.
4. Установите зависимости и соберите фронтенд:
   ```bash
   cd "$DEPLOY_PATH"
   npm ci --include=dev
   npm run build
   npm prune --omit=dev
   ```
5. Запуск в production (обязательно `NODE_ENV=production`, чтобы отдавался `dist/`):
   ```bash
   export NODE_ENV=production
   # Порт: хостинг может задать PORT; иначе см. SERVER_PORT в .env (по умолчанию 8787)
   pm2 start npm --name agrobuild1 -- start
   pm2 save
   ```
   Имя `agrobuild1` должно совпасть с `PM2_APP_NAME` в секретах Actions. При другом имени замените во всех местах.

### Проверка

- `GET /api/health` — сводка конфигурации (без утечки секретов).
- Логи: `pm2 logs agrobuild1`.

### Nginx (опционально)

Если перед Node стоит reverse proxy, в **`.env`** на сервере включите доверие к прокси, чтобы корректно работали лимиты по IP:

```env
TRUST_PROXY=true
```

Пример фрагмента `location` (порт подставьте свой, как в `PORT` / `SERVER_PORT`):

```nginx
location / {
    proxy_pass http://127.0.0.1:8787;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Локальная разработка

- Фронт: `npm run dev` (прокси `/api` → `http://localhost:8787`, см. `vite.config.ts`).
- Бэкенд: `npm run dev:server` или `npm run dev:all`.

Подробнее о переменных окружения — в [`.env.example`](../.env.example).
