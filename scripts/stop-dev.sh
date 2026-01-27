#!/bin/bash

# 開発サーバーを停止するスクリプト

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$PROJECT_DIR/.dev-server.pid"

cd "$PROJECT_DIR"

if [ ! -f "$PID_FILE" ]; then
    echo "PIDファイルが見つかりません。サーバーは起動していない可能性があります。"
    exit 1
fi

PID=$(cat "$PID_FILE")

if kill -0 "$PID" 2>/dev/null; then
    echo "開発サーバーを停止中... (PID: $PID)"
    kill "$PID"

    # プロセスが終了するまで待機
    for i in {1..10}; do
        if ! kill -0 "$PID" 2>/dev/null; then
            break
        fi
        sleep 0.5
    done

    # まだ動いていたら強制終了
    if kill -0 "$PID" 2>/dev/null; then
        echo "強制終了しています..."
        kill -9 "$PID" 2>/dev/null
    fi

    rm -f "$PID_FILE"
    echo "開発サーバーを停止しました"
else
    echo "プロセス (PID: $PID) は既に終了しています"
    rm -f "$PID_FILE"
fi
