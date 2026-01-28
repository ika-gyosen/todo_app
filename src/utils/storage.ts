import type { Todo, TodoStatus } from '../types/todo'

const STORAGE_KEY = 'todos'

interface LegacyTodo {
  id: string
  title: string
  detail: string
  completed: boolean
  createdAt: string
}

function migrateTodo(todo: LegacyTodo | Todo): Todo {
  if ('completed' in todo && !('status' in todo)) {
    const { completed, ...rest } = todo as LegacyTodo
    const status: TodoStatus = completed ? 'done' : 'todo'
    return { ...rest, status }
  }
  return todo as Todo
}

export function loadTodos(): Todo[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return []
  try {
    const parsed = JSON.parse(data) as (LegacyTodo | Todo)[]
    return parsed.map(migrateTodo)
  } catch {
    return []
  }
}

export function saveTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}
