import { useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Todo } from '../types/todo'
import { MarkdownEditor } from './MarkdownEditor'
import { ConfirmDialog } from './ConfirmDialog'

interface EditPageProps {
  getTodo: (id: string) => Todo | undefined
  onAdd: (title: string, detail: string) => void
  onUpdate: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
}

export function EditPage({ getTodo, onAdd, onUpdate, onDelete, onToggleComplete }: EditPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNewMode = !id
  const todo = id ? getTodo(id) : undefined

  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false)
  const [prevTodoId, setPrevTodoId] = useState<string | null>(null)

  // todoが変わった時にフォームをリセット（レンダリング中の状態調整パターン）
  const currentTodoId = todo?.id ?? null
  if (currentTodoId !== prevTodoId) {
    setPrevTodoId(currentTodoId)
    if (todo) {
      setTitle(todo.title)
      setDetail(todo.detail)
    } else if (isNewMode) {
      setTitle('')
      setDetail('')
    }
  }

  // hasChangesは派生状態として計算
  const hasChanges = useMemo(() => {
    if (isNewMode) {
      return title.trim() !== '' || detail !== ''
    } else if (todo) {
      return title !== todo.title || detail !== todo.detail
    }
    return false
  }, [title, detail, todo, isNewMode])

  const handleSave = useCallback(() => {
    if (!title.trim()) return

    if (isNewMode) {
      onAdd(title.trim(), detail)
      navigate('/')
    } else if (id) {
      onUpdate(id, { title: title.trim(), detail })
    }
  }, [id, title, detail, isNewMode, onAdd, onUpdate, navigate])

  const handleBack = useCallback(() => {
    if (hasChanges) {
      setShowUnsavedConfirm(true)
    } else {
      navigate('/')
    }
  }, [hasChanges, navigate])

  const handleDelete = useCallback(() => {
    setShowDeleteConfirm(true)
  }, [])

  const confirmDelete = useCallback(() => {
    if (!id) return
    onDelete(id)
    navigate('/')
  }, [id, onDelete, navigate])

  const handleToggleComplete = useCallback(() => {
    if (!id) return
    onToggleComplete(id)
  }, [id, onToggleComplete])

  // 編集モードでTODOが見つからない場合
  if (!isNewMode && !todo) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-paper-dark mb-4">
            <svg className="w-8 h-8 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-ink-muted font-medium mb-4">TODOが見つかりません</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-accent hover:text-accent-light transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            一覧に戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="shrink-0 flex justify-between items-center px-6 py-4 border-b border-paper-dark bg-paper">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="group inline-flex items-center gap-2 text-ink-light hover:text-accent transition-colors"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">戻る</span>
          </button>
          <div className="h-6 w-px bg-paper-dark" />
          <h1 className="font-sans text-xl font-semibold text-ink">
            {isNewMode ? '新しいTODO' : 'TODOを編集'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Complete toggle - 編集モードのみ */}
          {!isNewMode && todo && (
            <label className="flex items-center gap-2 px-4 py-2 bg-white border border-paper-dark rounded-xl cursor-pointer hover:border-accent/30 transition-all">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={handleToggleComplete}
              />
              <span className={`text-sm font-medium ${todo.completed ? 'text-success' : 'text-ink-light'}`}>
                {todo.completed ? '完了済み' : '未完了'}
              </span>
            </label>
          )}

          {/* Delete button - 編集モードのみ */}
          {!isNewMode && (
            <button
              onClick={handleDelete}
              className="px-4 py-2.5 text-danger hover:bg-danger-light/30 rounded-xl transition-colors"
            >
              削除
            </button>
          )}

          {/* Save/Create button */}
          <button
            onClick={handleSave}
            disabled={!title.trim() || (!isNewMode && !hasChanges)}
            className="px-5 py-2.5 text-white bg-accent hover:bg-accent-light disabled:bg-ink-muted disabled:cursor-not-allowed rounded-xl transition-all shadow-sm hover:shadow-md disabled:shadow-none"
          >
            {isNewMode ? '作成' : hasChanges ? '保存' : '保存済み'}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden p-6 gap-4">
        {/* Title */}
        <div className="shrink-0">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus={isNewMode}
            className="w-full px-4 py-3 bg-white border border-paper-dark rounded-xl text-xl font-medium text-ink placeholder-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
            placeholder="タスクのタイトルを入力..."
          />
        </div>

        {/* Markdown Editor - fills remaining space */}
        <div className="flex-1 min-h-0">
          <MarkdownEditor value={detail} onChange={setDetail} />
        </div>

        {/* Meta info - 編集モードのみ */}
        {!isNewMode && todo && (
          <div className="shrink-0 flex items-center gap-2 text-sm text-ink-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            作成: {new Date(todo.createdAt).toLocaleString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="削除の確認"
        message="このTODOを削除しますか？この操作は取り消せません。"
        confirmLabel="削除"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showUnsavedConfirm}
        title="未保存の変更"
        message={isNewMode ? "入力内容が破棄されます。戻りますか？" : "未保存の変更があります。保存せずに戻りますか？"}
        confirmLabel="破棄して戻る"
        variant="warning"
        onConfirm={() => navigate('/')}
        onCancel={() => setShowUnsavedConfirm(false)}
      />
    </div>
  )
}
