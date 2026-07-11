#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_DIR"

echo "=== Добавление всех изменений ==="
git add -A

echo "=== Статус ==="
git status

read -rp "Коммит-сообщение: " msg
if [ -z "$msg" ]; then
    echo "❌ Сообщение не может быть пустым"
    exit 1
fi

git commit -m "$msg"

echo "=== Пуш на GitHub ==="
read -rp "GitHub username (tehnoles2021-lab): " username
username="${username:-tehnoles2021-lab}"

read -rsp "GitHub token: " token
echo

read -rp "Force push? (y/n): " force
if [ "$force" = "y" ] || [ "$force" = "Y" ]; then
    git remote set-url origin "https://$username:$token@github.com/tehnoles2021-lab/TwoEras.git"
    git push --force
    git remote set-url origin "https://github.com/tehnoles2021-lab/TwoEras.git"
else
    git remote set-url origin "https://$username:$token@github.com/tehnoles2021-lab/TwoEras.git"
    git push
    git remote set-url origin "https://github.com/tehnoles2021-lab/TwoEras.git"
fi

echo "✅ Готово!"
