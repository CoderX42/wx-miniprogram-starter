#!/usr/bin/env bash
# deploy.sh — 部署图片到 CDN 服务器
# 使用前请配置 REMOTE_HOST、REMOTE_PATH 环境变量，或修改下面的默认值

set -e

REMOTE_HOST="${REMOTE_HOST:-user@cdn.example.com}"
REMOTE_PATH="${REMOTE_PATH:-/data/cdn/wx-app}"
LOCAL_DIR="${LOCAL_DIR:-./images}"

if [ ! -d "$LOCAL_DIR" ]; then
  echo "[deploy] no local dir: $LOCAL_DIR, skip"
  exit 0
fi

echo "[deploy] $LOCAL_DIR -> $REMOTE_HOST:$REMOTE_PATH"
rsync -avz --delete \
  --exclude '*.sh' \
  --exclude '*.js' \
  --exclude '.DS_Store' \
  ./ "$REMOTE_HOST:$REMOTE_PATH/"

echo "[deploy] done"
