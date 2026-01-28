# アーキテクチャ概要

このドキュメントでは、TODOアプリケーションのアーキテクチャについて説明します。

## プロジェクト構造

```
src/
├── components/           # プレゼンテーションコンポーネント（純粋なUI）
│   ├── common/          # 共通コンポーネント
│   ├── kanban/          # カンバンボード関連
│   ├── todo/            # TODO一覧関連（レガシー）
│   └── edit/            # 編集画面関連
│
├── containers/          # コンテナコンポーネント（ロジック管理）
│
├── hooks/               # カスタムフック
│
├── types/               # 型定義
│
└── utils/               # ユーティリティ関数
```

## Container/Componentパターン

このアプリケーションでは、Container/Componentパターンを採用してUI層とロジック層を分離しています。

### コンポーネント（Components）

**役割**: 純粋なプレゼンテーション

- UIの表示のみを担当
- ロジックを一切含まない
- すべての状態とイベントハンドラはPropsで受け取る
- テストが容易（Props → UIのマッピングのみ）

**配置**: `src/components/`

### コンテナ（Containers）

**役割**: ビジネスロジックと状態管理

- フックを使用してロジックを管理
- ルーティング処理
- イベントハンドラの実装
- Componentに必要なPropsを渡す

**配置**: `src/containers/`

## 各レイヤーの責務

| レイヤー | 責務 | 例 |
|---------|------|-----|
| Components | UI表示 | KanbanCardView, DroppableKanbanColumn, EditPageView |
| Containers | ロジック統合 | KanbanBoardContainer, EditPageContainer |
| Hooks | 再利用可能ロジック | useTodos, useDialog, useEditForm |
| Types | 型定義 | Todo interface, TodoStatus型 |
| Utils | ユーティリティ | storage (LocalStorage操作、マイグレーション) |

## データフロー

```
App.tsx (useTodos)
    ↓
Container (ロジック統合)
    ↓
Component (UI表示)
```

詳細については各ドキュメントを参照してください：

- [ディレクトリ構造](./directory-structure.md)
- [コンポーネント設計](./components.md)
- [カスタムフック設計](./hooks.md)
- [データフロー](./data-flow.md)
