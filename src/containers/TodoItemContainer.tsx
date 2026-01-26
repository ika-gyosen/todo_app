import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Todo } from '../types/todo'
import { TodoItemView } from '../components/todo/TodoItemView'

interface TodoItemContainerProps {
  todo: Todo
  onToggleComplete: (id: string) => void
}

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
