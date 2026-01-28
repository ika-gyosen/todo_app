export type TodoStatus = 'todo' | 'inProgress' | 'done'

export interface Todo {
  id: string
  title: string
  detail: string
  status: TodoStatus
  createdAt: string
}
