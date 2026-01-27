#!/bin/bash

# 開発サーバーをバックグラウンドで起動するスクリプト

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$PROJECT_DIR/.dev-server.pid"
LOG_FILE="$PROJECT_DIR/.dev-server.log"

# ポート指定必須
if [ -z "$1" ]; then
    echo "エラー: ポート番号を指定してください"
    echo "使い方: pnpm dev:start <port>"
    echo "例: pnpm dev:start 3000"
    exit 1
fi
PORT=$1

cd "$PROJECT_DIR"

# 既に起動中かチェック
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
        echo "開発サーバーは既に起動中です (PID: $PID)"
        exit 1
    else
        rm -f "$PID_FILE"
    fi
fi

# バックグラウンドで起動
echo "開発サーバーを起動中... (ポート: $PORT)"
nohup pnpm dev -- --port "$PORT" > "$LOG_FILE" 2>&1 &
PID=$!

# PIDを保存
echo $PID > "$PID_FILE"

echo "開発サーバーを起動しました (PID: $PID)"
echo "ログファイル: $LOG_FILE"
echo "URL: http://localhost:$PORT"
echo "停止するには: pnpm dev:stop"
