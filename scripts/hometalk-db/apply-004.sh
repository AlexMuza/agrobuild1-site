#!/usr/bin/env bash
set -euo pipefail
# Применить миграцию HomeTalk 004 к PostgreSQL (на сервере с psql).
# export DATABASE_URL='postgresql://...'
: "${DATABASE_URL:?Задайте DATABASE_URL}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$SCRIPT_DIR/004_stage2_trust.sql"
echo "Миграция 004 применена."
