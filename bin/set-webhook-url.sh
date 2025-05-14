#!/bin/bash

# 遞迴找出包含 package.json，且 "name": "api" 的目錄
find_api_dir() {
  find . -type f -name "package.json" | while read -r file; do
    if grep -q '"name": *"api"' "$file"; then
      dir=$(dirname "$file")
      if [ -f "$dir/.env" ]; then
        echo "$dir"
        return 0
      fi
    fi
  done
  return 1
}

API_DIR=$(find_api_dir)

if [ -z "$API_DIR" ]; then
  echo "Error: Could not find a directory with package.json name=\"api\" and a .env file."
  exit 1
fi

# 讀取 .env 中的變數
ENV_FILE="$API_DIR/.env"
TOKEN=$(grep '^TELEGRAM_BOT_TOKEN=' "$ENV_FILE" | cut -d '=' -f2- | tr -d '\r')
DOMAIN=$(grep '^DOMAIN=' "$ENV_FILE" | cut -d '=' -f2- | tr -d '\r')

if [ -z "$TOKEN" ] || [ -z "$DOMAIN" ]; then
  echo "Error: TELEGRAM_BOT_TOKEN or DOMAIN not found in $ENV_FILE"
  exit 1
fi

# 設定 webhook
WEBHOOK_URL="https://$DOMAIN/api/telegram/webhook"
echo "Setting webhook to: $WEBHOOK_URL"

curl -s -X POST "https://api.telegram.org/bot$TOKEN/setWebhook" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "url=$WEBHOOK_URL"
