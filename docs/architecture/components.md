# コンポーネント設計

## Container vs Component の責務分離

### Component（View）の責務

- UIの描画のみ
- Propsで受け取ったデータの表示
- Propsで受け取ったイベントハンドラの呼び出し
- ロジックを一切含まない

```typescript
// 良い例: 純粋なプレゼンテーション
interface TodoItemViewProps {
  todo: Todo
  onClick: () => void
  onCheckboxClick: (e: React.MouseEvent) => void
}

export function TodoItemView({ todo, onClick, onCheckboxClick }: TodoItemViewProps) {
  return (
    <div onClick={onClick}>
      <input type="checkbox" onClick={onCheckboxClick} checked={todo.completed} />
      <span>{todo.title}</span>
    </div>
  )
}
```

### Container の責務

- カスタムフックの統合
- イベントハンドラの実装
- ルーティング処理
- Viewへのprops提供

```typescript
// 良い例: ロジックをカプセル化
export function TodoItemContainer({ todo, onToggleComplete }: TodoItemContainerProps) {
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    navigate(`/edit/${todo.id}`)
  }, [navigate, todo.id])

  const handleCheckboxClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleComplete(todo.id)
  }, [onToggleComplete, todo.id])

  return (
    <TodoItemView
      todo={todo}
      onClick={handleClick}
      onCheckboxClick={handleCheckboxClick}
    />
  )
}
```

## コンポーネント一覧

### プレゼンテーションコンポーネント

| コンポーネント | ファイル | 説明 |
|--------------|---------|------|
| ConfirmDialogView | `components/common/ConfirmDialogView.tsx` | 確認ダイアログのUI |
| TodoItemView | `components/todo/TodoItemView.tsx` | TODOアイテムのUI |
| TodoListView | `components/todo/TodoListView.tsx` | TODO一覧のUI |
| EditPageView | `components/edit/EditPageView.tsx` | 編集画面のUI |
| MarkdownEditor | `components/edit/MarkdownEditor.tsx` | Markdownエディタ |

### コンテナコンポーネント

| コンポーネント | ファイル | 説明 |
|--------------|---------|------|
| ConfirmDialogContainer | `containers/ConfirmDialogContainer.tsx` | ESCキー、バックドロップクリック処理 |
| TodoItemContainer | `containers/TodoItemContainer.tsx` | アイテムクリック時のナビゲーション |
| TodoListContainer | `containers/TodoListContainer.tsx` | 一覧表示、未完了カウント計算 |
| EditPageContainer | `containers/EditPageContainer.tsx` | フォーム管理、CRUD操作 |

## 依存関係図

```
App.tsx
├── TodoListContainer
│   ├── TodoListView
│   └── TodoItemContainer
│       └── TodoItemView
│
└── EditPageContainer
    ├── EditPageView
    │   └── MarkdownEditor
    └── ConfirmDialogContainer
        └── ConfirmDialogView
```

## Props設計のガイドライン

### 1. 明示的な型定義

```typescript
interface TodoItemViewProps {
  todo: Todo                              // データ
  onClick: () => void                     // イベントハンドラ
  onCheckboxClick: (e: React.MouseEvent) => void  // イベント付きハンドラ
}
```

### 2. コールバックは具体的に命名

```typescript
// 良い例
onTitleChange: (title: string) => void
onConfirmDelete: () => void

// 悪い例
onChange: (value: any) => void
onAction: () => void
```

### 3. Render Props パターンの活用

```typescript
interface TodoListViewProps {
  todos: Todo[]
  renderTodoItem: (todo: Todo, index: number) => ReactNode
}
```

### 4. 状態と派生値を分離

```typescript
interface EditPageViewProps {
  // 状態
  title: string
  detail: string

  // 派生値（Containerで計算）
  hasChanges: boolean
  canSave: boolean
}
```
