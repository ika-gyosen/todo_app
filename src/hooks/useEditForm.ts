import { useState, useMemo, useCallback } from 'react'
import type { Todo } from '../types/todo'

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

  const hasChanges = useMemo(() => {
    if (isNewMode) {
      return title.trim() !== '' || detail !== ''
    } else if (todo) {
      return title !== todo.title || detail !== todo.detail
    }
    return false
  }, [title, detail, todo, isNewMode])

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
      onUpdate(todo.id, { title: title.trim(), detail })
    }
  }, [todo, title, detail, isNewMode, onAdd, onUpdate, onNavigateBack])

  return {
    title,
    detail,
    hasChanges,
    canSave,
    setTitle,
    setDetail,
    handleSave,
  }
}
