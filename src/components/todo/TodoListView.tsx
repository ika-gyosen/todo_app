import type { ReactNode } from 'react'
import type { Todo } from '../../types/todo'

interface TodoListViewProps {
  todos: Todo[]
  incompleteCount: number
  onAddClick: () => void
  renderTodoItem: (todo: Todo, index: number) => ReactNode
}

export function TodoListView({
  todos,
  incompleteCount,
  onAddClick,
  renderTodoItem,
}: TodoListViewProps) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-10">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-sans text-3xl font-semibold text-ink tracking-tight">
              TODO List
            </h1>
            <p className="text-ink-muted text-sm mt-1">
              {incompleteCount} 件の未完了タスク
            </p>
          </div>
          <button
            onClick={onAddClick}
            className="group flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-light transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">追加</span>
          </button>
        </div>
        <div className="mt-6 h-px bg-gradient-to-r from-paper-dark via-ink-muted/20 to-paper-dark" />
      </header>

      {/* Content */}
      {todos.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-paper-dark mb-4">
            <svg className="w-8 h-8 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-ink-muted font-medium">TODOがありません</p>
          <p className="text-ink-muted/70 text-sm mt-1">「追加」ボタンから新しいタスクを作成</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo, index) => (
            <li
              key={todo.id}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
            >
              {renderTodoItem(todo, index)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
