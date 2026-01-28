import { useState, useMemo, useCallback } from 'react'
import type { Todo, TodoStatus } from '../types/todo'

interface UseEditFormProps {
  todo?: Todo
  isNewMode: boolean
  onAdd: (title: string, detail: string) => void
  onUpdate: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void
  onNavigateBack: () => void
}

export function useEditForm({
  todo,
  isNewMode,
  onAdd,
  onUpdate,
  onNavigateBack,
}: UseEditFormProps) {
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [status, setStatus] = useState<TodoStatus>('todo')
  const [prevTodoId, setPrevTodoId] = useState<string | null>(null)

  // todoが変わった時にフォームをリセット（レンダリング中の状態調整パターン）
  const currentTodoId = todo?.id ?? null
  if (currentTodoId !== prevTodoId) {
    setPrevTodoId(currentTodoId)
    if (todo) {
      setTitle(todo.title)
      setDetail(todo.detail)
      setStatus(todo.status)
    } else if (isNewMode) {
      setTitle('')
      setDetail('')
      setStatus('todo')
    }
  }

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

  const handleSave = useCallback(() => {
    if (!title.trim()) return

    if (isNewMode) {
      onAdd(title.trim(), detail)
      onNavigateBack()
    } else if (todo) {
      onUpdate(todo.id, { title: title.trim(), detail, status })
    }
  }, [todo, title, detail, status, isNewMode, onAdd, onUpdate, onNavigateBack])

  return {
    title,
    detail,
    status,
    hasChanges,
    canSave,
    setTitle,
    setDetail,
    setStatus,
    handleSave,
  }
}
