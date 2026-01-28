import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Todo, TodoStatus } from '../types/todo'
import { TodoListView } from '../components/todo/TodoListView'
import { TodoItemContainer } from './TodoItemContainer'

interface TodoListContainerProps {
  todos: Todo[]
  onUpdateStatus: (id: string, status: TodoStatus) => void
}

export function TodoListContainer({ todos, onUpdateStatus }: TodoListContainerProps) {
  const navigate = useNavigate()

  const incompleteCount = useMemo(() => {
    return todos.filter(t => t.status !== 'done').length
  }, [todos])

  const handleAddClick = useCallback(() => {
    navigate('/new')
  }, [navigate])

  const renderTodoItem = useCallback((todo: Todo) => {
    return (
      <TodoItemContainer
        todo={todo}
        onUpdateStatus={onUpdateStatus}
      />
    )
  }, [onUpdateStatus])

  return (
    <TodoListView
      todos={todos}
      incompleteCount={incompleteCount}
      onAddClick={handleAddClick}
      renderTodoItem={renderTodoItem}
    />
  )
}
