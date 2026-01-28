# カスタムフック設計

## フック一覧

| フック | ファイル | 説明 |
|-------|---------|------|
| useTodos | `hooks/useTodos.ts` | TODO CRUD操作、LocalStorage同期 |
| useEditForm | `hooks/useEditForm.ts` | フォーム状態管理 |
| useDialog | `hooks/useDialog.ts` | ダイアログ開閉 |
| useEscapeKey | `hooks/useEscapeKey.ts` | ESCキーハンドリング |

## 各フックの詳細

### useTodos

**責務**: TODOデータの管理とLocalStorage永続化

```typescript
function useTodos() {
  // 戻り値
  return {
    todos: Todo[]           // 全TODOリスト
    addTodo: (title: string, detail: string) => Todo
    updateTodo: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void
    deleteTodo: (id: string) => void
    updateTodoStatus: (id: string, status: TodoStatus) => void  // ステータス専用更新
    getTodo: (id: string) => Todo | undefined
  }
}
```

**使用場所**: `App.tsx`

**注意**: `toggleComplete`は`updateTodoStatus`に置き換えられた。カンバンボードのドラッグ&ドロップで任意のステータス（'todo' | 'inProgress' | 'done'）を直接指定できるようにするため。

### useEditForm

**責務**: 編集フォームの状態管理と保存ロジック

```typescript
interface UseEditFormProps {
  todo?: Todo
  isNewMode: boolean
  onAdd: (title: string, detail: string) => void
  onUpdate: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void
  onNavigateBack: () => void
}

function useEditForm(props: UseEditFormProps) {
  return {
    title: string           // タイトル入力値
    detail: string          // 詳細入力値
    status: TodoStatus      // ステータス（'todo' | 'inProgress' | 'done'）
    hasChanges: boolean     // 変更有無（派生状態）
    canSave: boolean        // 保存可能か（派生状態）
    setTitle: (title: string) => void
    setDetail: (detail: string) => void
    setStatus: (status: TodoStatus) => void
    handleSave: () => void
  }
}
```

**使用場所**: `EditPageContainer`

**特徴**:
- todoが変わった時にフォームを自動リセット（title, detail, statusすべて）
- `hasChanges`と`canSave`は派生状態として計算
- `hasChanges`はstatusの変更も検知する
- 新規作成モードと編集モードの両方に対応
- 保存時にstatusも含めて`onUpdate`に渡す

### useDialog

**責務**: ダイアログの開閉状態管理

```typescript
function useDialog(initialState = false) {
  return {
    isOpen: boolean         // ダイアログの開閉状態
    open: () => void        // ダイアログを開く
    close: () => void       // ダイアログを閉じる
  }
}
```

**使用場所**: `EditPageContainer`（削除確認、未保存確認）

**使用例**:
```typescript
const deleteDialog = useDialog()
const unsavedDialog = useDialog()

// 削除ボタン押下時
const handleDelete = () => deleteDialog.open()

// ダイアログで確認された時
const confirmDelete = () => {
  onDelete(id)
  navigate('/')
}
```

### useEscapeKey

**責務**: ESCキー押下時のコールバック実行

```typescript
function useEscapeKey(
  callback: () => void,   // ESCキー押下時に実行
  enabled: boolean = true // 有効/無効の切り替え
)
```

**使用場所**: `ConfirmDialogContainer`

**使用例**:
```typescript
// ダイアログが開いている時のみESCキーを監視
useEscapeKey(onCancel, isOpen)
```

## フック間の依存関係

```
App.tsx
└── useTodos (データ管理)

EditPageContainer
├── useEditForm (フォーム管理)
│   └── 内部でuseMemoを使用（派生状態計算）
└── useDialog × 2 (ダイアログ管理)

ConfirmDialogContainer
└── useEscapeKey (キーボード操作)
```

## フック設計のガイドライン

### 1. 単一責任

各フックは1つの責務のみを持つ

```typescript
// 良い例: ダイアログの開閉のみ
function useDialog() { ... }

// 悪い例: 複数の責務を混在
function useDialogWithValidation() { ... }
```

### 2. 派生状態はuseMemoで計算

```typescript
const hasChanges = useMemo(() => {
  if (isNewMode) {
    return title.trim() !== '' || detail !== ''
  } else if (todo) {
    return title !== todo.title || detail !== todo.detail || status !== todo.status
  }
  return false
}, [title, detail, status, todo, isNewMode])
```

### 3. 安定した参照のためuseCallbackを使用

```typescript
const handleSave = useCallback(() => {
  // 保存処理
}, [dependencies])
```

### 4. 副作用はuseEffectで隔離

```typescript
// useTodos内でのLocalStorage同期
useEffect(() => {
  saveTodos(todos)
}, [todos])
```
