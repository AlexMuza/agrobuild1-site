#!/usr/bin/env python3
"""Удалённый запуск setup-agrobuild-web.sh на VM 102."""
import os
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "192.168.88.103")
USER = os.environ.get("DEPLOY_USER", "webadmin")
PASSWORD = os.environ.get("DEPLOY_PASS", "")
SCRIPT_URL = os.environ.get(
    "SETUP_SCRIPT_URL",
    "https://raw.githubusercontent.com/AlexMuza/agrobuild1-site/main/scripts/setup-agrobuild-web.sh",
)


def main() -> int:
    if not PASSWORD:
        print(
            "Задайте пароль SSH: $env:DEPLOY_PASS='...'; python scripts/remote-fix-deploy.py",
            file=sys.stderr,
        )
        return 1

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        print(f"Подключение к {USER}@{HOST}...")
        client.connect(
            HOST,
            username=USER,
            password=PASSWORD,
            timeout=30,
            allow_agent=False,
            look_for_keys=False,
        )
    except paramiko.AuthenticationException:
        print("Ошибка: неверный пароль DEPLOY_PASS.", file=sys.stderr)
        return 1
    except Exception as exc:
        print(f"Ошибка подключения: {exc}", file=sys.stderr)
        return 1

    cmd = f"curl -fsSL {SCRIPT_URL} | bash"
    print("Запуск setup-agrobuild-web.sh на сервере (5–10 мин)...")
    stdin, stdout, stderr = client.exec_command(cmd, get_pty=True, timeout=900)

    for line in stdout:
        print(line.rstrip())
    err = stderr.read().decode("utf-8", errors="replace")
    if err.strip():
        print(err, file=sys.stderr)

    code = stdout.channel.recv_exit_status()
    client.close()
    return code


if __name__ == "__main__":
    sys.exit(main())
