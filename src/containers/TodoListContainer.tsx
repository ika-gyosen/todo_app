import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Todo } from '../types/todo'
import { TodoListView } from '../components/todo/TodoListView'
import { TodoItemContainer } from './TodoItemContainer'

interface TodoListContainerProps {
  todos: Todo[]
  onToggleComplete: (id: string) => void
}

export function TodoListContainer({ todos, onToggleComplete }: TodoListContainerProps) {
  const navigate = useNavigate()

  const incompleteCount = useMemo(() => {
    return todos.filter(t => !t.completed).length
  }, [todos])

  const handleAddClick = useCallback(() => {
    navigate('/new')
  }, [navigate])

  const renderTodoItem = useCallback((todo: Todo) => {
    return (
      <TodoItemContainer
        todo={todo}
        onToggleComplete={onToggleComplete}
      />
    )
  }, [onToggleComplete])

  return (
    <TodoListView
      todos={todos}
      incompleteCount={incompleteCount}
      onAddClick={handleAddClick}
      renderTodoItem={renderTodoItem}
    />
  )
}
