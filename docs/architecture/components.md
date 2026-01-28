# コンポーネント設計

## Container vs Component の責務分離

### Component（View）の責務

- UIの描画のみ
- Propsで受け取ったデータの表示
- Propsで受け取ったイベントハンドラの呼び出し
- ロジックを一切含まない

```typescript
// 良い例: 純粋なプレゼンテーション
interface KanbanCardViewProps {
  todo: Todo
  onClick: () => void
}

export function KanbanCardView({ todo, onClick }: KanbanCardViewProps) {
  return (
    <div onClick={onClick}>
      <span>{todo.title}</span>
      <span>{todo.status}</span>
    </div>
  )
}
```

### Container の責務

- カスタムフックの統合
- イベントハンドラの実装
- ルーティング処理
- Viewへのprops提供
- ドラッグ&ドロップなどの状態管理

```typescript
// 良い例: ロジックをカプセル化（カンバンボード）
export function KanbanBoardContainer({ todos, onUpdateStatus }: KanbanBoardContainerProps) {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleCardClick = useCallback((todoId: string) => {
    navigate(`/edit/${todoId}`)
  }, [navigate])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const newStatus = over.id as TodoStatus
    onUpdateStatus(active.id as string, newStatus)
  }, [onUpdateStatus])

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* カンバンカラムとカード */}
    </DndContext>
  )
}
```

## コンポーネント一覧

### プレゼンテーションコンポーネント

| コンポーネント | ファイル | 説明 |
|--------------|---------|------|
| ConfirmDialogView | `components/common/ConfirmDialogView.tsx` | 確認ダイアログのUI |
| KanbanCardView | `components/kanban/KanbanCardView.tsx` | カンバンカードのUI |
| KanbanColumnView | `components/kanban/KanbanColumnView.tsx` | カンバンカラムのUI（参考用） |
| KanbanBoardView | `components/kanban/KanbanBoardView.tsx` | カンバンボード全体のUI（参考用） |
| DraggableKanbanCard | `components/kanban/DraggableKanbanCard.tsx` | ドラッグ可能なカンバンカード |
| DroppableKanbanColumn | `components/kanban/DroppableKanbanColumn.tsx` | ドロップ可能なカンバンカラム |
| EditPageView | `components/edit/EditPageView.tsx` | 編集画面のUI |
| MarkdownEditor | `components/edit/MarkdownEditor.tsx` | Markdownエディタ |
| TodoItemView | `components/todo/TodoItemView.tsx` | TODOアイテムのUI（レガシー） |
| TodoListView | `components/todo/TodoListView.tsx` | TODO一覧のUI（レガシー） |

### コンテナコンポーネント

| コンポーネント | ファイル | 説明 |
|--------------|---------|------|
| ConfirmDialogContainer | `containers/ConfirmDialogContainer.tsx` | ESCキー、バックドロップクリック処理 |
| KanbanBoardContainer | `containers/KanbanBoardContainer.tsx` | カンバンボード全体の管理、DnDコンテキスト |
| EditPageContainer | `containers/EditPageContainer.tsx` | フォーム管理、CRUD操作 |
| TodoItemContainer | `containers/TodoItemContainer.tsx` | アイテムクリック時のナビゲーション（レガシー） |
| TodoListContainer | `containers/TodoListContainer.tsx` | 一覧表示、未完了カウント計算（レガシー） |

## 依存関係図

```
App.tsx
├── KanbanBoardContainer (/)
│   ├── DndContext (dnd-kit)
│   ├── DroppableKanbanColumn
│   │   └── DraggableKanbanCard
│   │       └── KanbanCardView
│   └── DragOverlay
│       └── KanbanCardView
│
└── EditPageContainer (/new, /edit/:id)
    ├── EditPageView
    │   └── MarkdownEditor
    └── ConfirmDialogContainer
        └── ConfirmDialogView

（レガシー: TodoListContainer → TodoListView → TodoItemContainer → TodoItemView）
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
