import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Todo, TodoStatus } from '../types/todo'
import { KanbanBoardView, KanbanCardView } from '../components/kanban'

interface KanbanBoardContainerProps {
  todos: Todo[]
  onUpdateStatus: (id: string, status: TodoStatus) => void
}

// onUpdateStatus is used in task#5 for drag & drop
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function KanbanBoardContainer({ todos, onUpdateStatus: _onUpdateStatus }: KanbanBoardContainerProps) {
  const navigate = useNavigate()

  const todoItems = useMemo(() => {
    return todos.filter(t => t.status === 'todo')
  }, [todos])

  const inProgressItems = useMemo(() => {
    return todos.filter(t => t.status === 'inProgress')
  }, [todos])

  const doneItems = useMemo(() => {
    return todos.filter(t => t.status === 'done')
  }, [todos])

  const handleAddClick = useCallback(() => {
    navigate('/new')
  }, [navigate])

  const handleCardClick = useCallback((todoId: string) => {
    navigate(`/edit/${todoId}`)
  }, [navigate])

  const renderCard = useCallback((todo: Todo) => {
    return (
      <KanbanCardView
        key={todo.id}
        todo={todo}
        onClick={() => handleCardClick(todo.id)}
      />
    )
  }, [handleCardClick])

  return (
    <KanbanBoardView
      todoItems={todoItems}
      inProgressItems={inProgressItems}
      doneItems={doneItems}
      onAddClick={handleAddClick}
      renderCard={renderCard}
    />
  )
}
