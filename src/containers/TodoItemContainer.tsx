import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Todo, TodoStatus } from '../types/todo'
import { TodoItemView } from '../components/todo/TodoItemView'

interface TodoItemContainerProps {
  todo: Todo
  onUpdateStatus: (id: string, status: TodoStatus) => void
}

export function TodoItemContainer({ todo, onUpdateStatus }: TodoItemContainerProps) {
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    navigate(`/edit/${todo.id}`)
  }, [navigate, todo.id])

  const handleCheckboxClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const newStatus: TodoStatus = todo.status === 'done' ? 'todo' : 'done'
    onUpdateStatus(todo.id, newStatus)
  }, [onUpdateStatus, todo.id, todo.status])

  return (
    <TodoItemView
      todo={todo}
      onClick={handleClick}
      onCheckboxClick={handleCheckboxClick}
    />
  )
}
