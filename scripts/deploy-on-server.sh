#!/usr/bin/env bash
set -euo pipefail

# This script is intended to run on the VPS.
# GitHub Actions deploy.yml runs these commands via SSH.

: "${DEPLOY_PATH:=/var/www/html}"
: "${PM2_APP_NAME:=agrobuild1}"

cd "$DEPLOY_PATH"

git pull --ff-only
npm ci --include=dev
npm run build
npm prune --omit=dev
pm2 restart "$PM2_APP_NAME"

