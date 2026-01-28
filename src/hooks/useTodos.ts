import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Todo, TodoStatus } from '../types/todo'
import { loadTodos, saveTodos } from '../utils/storage'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos())

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const addTodo = useCallback((title: string, detail: string) => {
    const newTodo: Todo = {
      id: uuidv4(),
      title,
      detail,
      status: 'todo',
      createdAt: new Date().toISOString(),
    }
    setTodos(prev => [newTodo, ...prev])
    return newTodo
  }, [])

  const updateTodo = useCallback((id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, ...updates } : todo
    ))
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, [])

  const updateTodoStatus = useCallback((id: string, status: TodoStatus) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, status } : todo
    ))
  }, [])

  const getTodo = useCallback((id: string) => {
    return todos.find(todo => todo.id === id)
  }, [todos])

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    updateTodoStatus,
    getTodo,
  }
}
