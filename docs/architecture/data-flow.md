# データフロー

## 全体像

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    useTodos                            │  │
│  │  todos, addTodo, updateTodo, deleteTodo, toggleComplete│  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│         ┌──────────────────┼──────────────────┐             │
│         ▼                  ▼                  ▼             │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐        │
│  │ TodoList   │    │ EditPage   │    │ EditPage   │        │
│  │ Container  │    │ Container  │    │ Container  │        │
│  │  (/)       │    │  (/new)    │    │  (/edit/:id)│        │
│  └────────────┘    └────────────┘    └────────────┘        │
└─────────────────────────────────────────────────────────────┘
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

### 5. 完了トグル

```
チェックボックスクリック → TodoItemContainer.handleCheckboxClick
                        → useTodos.toggleComplete
                        → setTodos (state更新)
                        → useEffect (saveTodos)
                        → LocalStorage保存
```

## イベントハンドリングの流れ

### TodoListからの遷移

```
TodoListView
  │
  ├─ 追加ボタン → TodoListContainer.handleAddClick
  │             → navigate('/new')
  │
  └─ アイテムクリック → TodoItemView.onClick
                     → TodoItemContainer.handleClick
                     → navigate(`/edit/${todo.id}`)
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
  ├─ 保存ボタン → EditPageView.onSave
  │            → useEditForm.handleSave
  │            → useTodos.addTodo または updateTodo
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
      "completed": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 初期読み込み

```typescript
const [todos, setTodos] = useState<Todo[]>(() => loadTodos())
```

遅延初期化パターンを使用し、コンポーネント初回レンダリング時のみLocalStorageから読み込み。

## 派生状態の計算

### 未完了カウント（TodoListContainer）

```typescript
const incompleteCount = useMemo(() => {
  return todos.filter(t => !t.completed).length
}, [todos])
```

### フォーム変更検知（useEditForm）

```typescript
const hasChanges = useMemo(() => {
  if (isNewMode) {
    return title.trim() !== '' || detail !== ''
  }
  return title !== todo.title || detail !== todo.detail
}, [title, detail, todo, isNewMode])

const canSave = useMemo(() => {
  if (!title.trim()) return false
  if (isNewMode) return true
  return hasChanges
}, [title, isNewMode, hasChanges])
```
