#!/bin/bash

ENV=$1

if [[ -z "$ENV" ]]; then
  echo "Please specify the environment, e.g.: ./set-env.sh dev or ./set-env.sh prod"
  exit 1
fi

# 找出包含 Pulumi.yaml 的資料夾
pulumi_dir=$(find . -type f -name "Pulumi.yaml" -exec dirname {} \; | head -n 1)

if [ -n "$pulumi_dir" ]; then
  cd "$pulumi_dir" || exit
  echo "✅ 進入資料夾：$pulumi_dir"
else
  echo "❌ 找不到 Pulumi.yaml 的資料夾"
  exit 1
fi

STACK_NAME="gravityxlab/$ENV"

echo "🔍 選擇 Pulumi stack: $STACK_NAME"
if ! pulumi stack select "$STACK_NAME" --non-interactive; then
  echo "❌ 無法選擇 stack: $STACK_NAME，請確認 stack 是否存在"
  exit 1
fi

pulumi stack select "$STACK_NAME"

POSTGRES_URL=$(pulumi stack output postgresUrl --show-secrets)

rm -f ../api/.env ../db/.env ../web/.env

echo "POSTGRES_URL=${POSTGRES_URL}" | tee -a ../api/.env ../db/.env > /dev/null

pulumi config --show-secrets | awk '
  NR == 1 { next } # 跳過表頭
  /^env:/ {
    key = $1
    $1 = ""
    sub(/^ +/, "", $0)
    value = $0
    sub(/^env:/, "", key)

    if (key ~ /^PUBLIC_/) {
      # 寫入 web/.env，key 改成 VITE_PUBLIC_XXX
      print "VITE_" key "=" value >> "../web/.env"
      # 同時寫入 api/.env，保持 PUBLIC_XXX
      print key "=" value >> "../api/.env"
    } else {
      # 其他全部寫入 api/.env
      print key "=" value >> "../api/.env"
    }
  }
'

echo ".env files have been written to apps/api/.env and apps/db/.env"
