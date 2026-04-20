# Применяет 004_stage2_trust.sql к PostgreSQL HomeTalk.
# Требуется psql в PATH и переменная окружения DATABASE_URL.
$ErrorActionPreference = "Stop"
if (-not $env:DATABASE_URL) {
    Write-Error "Задайте DATABASE_URL (строка подключения PostgreSQL для HomeTalk)."
}
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$sql = Join-Path $here "004_stage2_trust.sql"
& psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -f $sql
Write-Host "Миграция 004 применена."
