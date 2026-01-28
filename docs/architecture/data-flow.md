# データフロー

## 全体像

```
┌──────────────────────────────────────────────────────────────────┐
│                            App.tsx                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                       useTodos                              │  │
│  │  todos, addTodo, updateTodo, deleteTodo, updateTodoStatus, │  │
│  │  getTodo                                                    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                             │                                     │
│         ┌───────────────────┼───────────────────┐                │
│         ▼                   ▼                   ▼                │
│  ┌─────────────┐    ┌────────────┐    ┌────────────┐            │
│  │ KanbanBoard │    │ EditPage   │    │ EditPage   │            │
│  │ Container   │    │ Container  │    │ Container  │            │
│  │  (/)        │    │  (/new)    │    │  (/edit/:id)│            │
│  └─────────────┘    └────────────┘    └────────────┘            │
└──────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                     ┌───────────────┐
                     │ LocalStorage  │
                     └───────────────┘
```

## 状態管理の流れ

### 1. 初期読み込み

```
LocalStorage → useTodos (loadTodos) → todos state → UI表示
```

### 2. TODO追加

```
ユーザー入力 → EditPageContainer.handleSave
            → useTodos.addTodo
            → setTodos (state更新)
            → useEffect (saveTodos)
            → LocalStorage保存
```

### 3. TODO更新

```
ユーザー入力 → EditPageContainer.handleSave
            → useTodos.updateTodo
            → setTodos (state更新)
            → useEffect (saveTodos)
            → LocalStorage保存
```

### 4. TODO削除

```
削除ボタン → 確認ダイアログ表示 → 確認
          → EditPageContainer.confirmDelete
          → useTodos.deleteTodo
          → setTodos (state更新)
          → useEffect (saveTodos)
          → LocalStorage保存
```

### 5. ステータス変更（ドラッグ&ドロップ）

```
カードドラッグ → DndContext.onDragStart → activeId設定
            → ドロップ先にドラッグ
            → DndContext.onDragEnd
            → KanbanBoardContainer.handleDragEnd
            → useTodos.updateTodoStatus
            → setTodos (state更新)
            → useEffect (saveTodos)
            → LocalStorage保存
```

### 6. ステータス変更（編集画面）

```
セレクトボックス変更 → EditPageView.onStatusChange
                   → useEditForm.setStatus（ローカル状態）
                   → 保存ボタンクリック
                   → useEditForm.handleSave
                   → useTodos.updateTodo({ status })
                   → setTodos (state更新)
                   → useEffect (saveTodos)
                   → LocalStorage保存
```

## イベントハンドリングの流れ

### カンバンボードからの遷移

```
KanbanBoardContainer
  │
  ├─ 追加ボタン → handleAddClick → navigate('/new')
  │
  ├─ カードクリック → DraggableKanbanCard.onClick
  │               → handleCardClick → navigate(`/edit/${todo.id}`)
  │
  └─ カードドラッグ → DndContext.onDragStart
                   → DraggableKanbanCard移動
                   → DroppableKanbanColumnにドロップ
                   → DndContext.onDragEnd
                   → handleDragEnd
                   → onUpdateStatus(todoId, newStatus)
```

### EditPageでの操作

```
EditPageView
  │
  ├─ タイトル入力 → EditPageView.onTitleChange
  │              → EditPageContainer → useEditForm.setTitle
  │
  ├─ 詳細入力 → EditPageView.onDetailChange
  │          → EditPageContainer → useEditForm.setDetail
  │
  ├─ ステータス変更 → EditPageView.onStatusChange（セレクトボックス）
  │               → useEditForm.setStatus（ローカル状態）
  │
  ├─ 保存ボタン → EditPageView.onSave
  │            → useEditForm.handleSave
  │            → useTodos.addTodo または updateTodo（statusを含む）
  │
  ├─ 戻るボタン（変更あり） → EditPageView.onBack
  │                       → EditPageContainer.handleBack
  │                       → unsavedDialog.open()
  │                       → ConfirmDialogView表示
  │
  └─ 削除ボタン → EditPageView.onDelete
              → EditPageContainer.handleDelete
              → deleteDialog.open()
              → ConfirmDialogView表示
```

## LocalStorageとの同期

### 保存タイミング

`useTodos`フック内のuseEffectで、`todos`配列が変更されるたびに自動保存：

```typescript
useEffect(() => {
  saveTodos(todos)
}, [todos])
```

### データ構造

```json
{
  "todos": [
    {
      "id": "uuid-v4",
      "title": "タスク名",
      "detail": "詳細（Markdown）",
      "status": "todo",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**TodoStatus型**: `'todo' | 'inProgress' | 'done'`

**マイグレーション**: 旧形式（`completed: boolean`）のデータは`loadTodos`時に自動変換される。
- `completed: true` → `status: 'done'`
- `completed: false` → `status: 'todo'`

### 初期読み込み

```typescript
const [todos, setTodos] = useState<Todo[]>(() => loadTodos())
```

遅延初期化パターンを使用し、コンポーネント初回レンダリング時のみLocalStorageから読み込み。

## 派生状態の計算

### 未完了カウント（KanbanBoardContainer）

```typescript
const todoItems = useMemo(() => todos.filter(t => t.status === 'todo'), [todos])
const inProgressItems = useMemo(() => todos.filter(t => t.status === 'inProgress'), [todos])
const totalIncomplete = todoItems.length + inProgressItems.length
```

### フォーム変更検知（useEditForm）

```typescript
const hasChanges = useMemo(() => {
  if (isNewMode) {
    return title.trim() !== '' || detail !== ''
  } else if (todo) {
    return title !== todo.title || detail !== todo.detail || status !== todo.status
  }
  return false
}, [title, detail, status, todo, isNewMode])

const canSave = useMemo(() => {
  if (!title.trim()) return false
  if (isNewMode) return true
  return hasChanges
}, [title, isNewMode, hasChanges])
```
