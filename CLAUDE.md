# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コマンド

```bash
# 開発サーバー起動（ポート指定必須）
pnpm dev -- --port xxxx

# ビルド
pnpm build

# Lint
pnpm lint
```

### スタイリング

- Tailwind CSS v4 を使用
- カスタムテーマ変数（`--color-paper`, `--color-ink`, etc.）は`src/index.css`で定義
