# ディレクトリ構造

## 完全なディレクトリツリー

```
src/
├── components/                    # プレゼンテーションコンポーネント
│   ├── common/
│   │   └── ConfirmDialogView.tsx  # 確認ダイアログUI
│   ├── todo/
│   │   ├── TodoItemView.tsx       # TODOアイテムUI
│   │   └── TodoListView.tsx       # TODO一覧UI
│   └── edit/
│       ├── EditPageView.tsx       # 編集画面UI
│       └── MarkdownEditor.tsx     # Markdownエディタ
│
├── containers/                    # コンテナコンポーネント
│   ├── ConfirmDialogContainer.tsx # ダイアログロジック
│   ├── TodoItemContainer.tsx      # アイテムナビゲーション
│   ├── TodoListContainer.tsx      # 一覧ロジック
│   └── EditPageContainer.tsx      # 編集ロジック
│
├── hooks/                         # カスタムフック
│   ├── useTodos.ts               # TODO CRUD操作
│   ├── useEditForm.ts            # フォーム状態管理
│   ├── useDialog.ts              # ダイアログ開閉
│   └── useEscapeKey.ts           # ESCキーハンドリング
│
├── types/
│   └── todo.ts                   # Todo型定義
│
├── utils/
│   └── storage.ts                # LocalStorage操作
│
├── App.tsx                       # ルートコンポーネント
└── main.tsx                      # エントリーポイント
```

## 各ディレクトリの役割

### `components/`

純粋なプレゼンテーションコンポーネントを配置。サブディレクトリで機能ごとに分類：

- `common/`: 複数の画面で共有されるコンポーネント
- `todo/`: TODO一覧画面関連
- `edit/`: 編集画面関連

### `containers/`

ロジックを持つコンテナコンポーネントを配置。対応するViewコンポーネントと1:1の関係。

### `hooks/`

再利用可能なカスタムフックを配置。

### `types/`

TypeScriptの型定義を配置。

### `utils/`

純粋なユーティリティ関数を配置。

## ファイル命名規則

| 種類 | 命名パターン | 例 |
|-----|-------------|-----|
| Viewコンポーネント | `*View.tsx` | `TodoItemView.tsx` |
| Container | `*Container.tsx` | `TodoItemContainer.tsx` |
| カスタムフック | `use*.ts` | `useDialog.ts` |
| 型定義 | `*.ts` | `todo.ts` |

## インポートパス規則

```typescript
// コンポーネント内でのインポート例
import type { Todo } from '../../types/todo'
import { ConfirmDialogContainer } from '../../containers/ConfirmDialogContainer'

// コンテナ内でのインポート例
import { TodoItemView } from '../components/todo/TodoItemView'
import { useDialog } from '../hooks/useDialog'
```
