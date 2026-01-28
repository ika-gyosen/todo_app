import type { ReactNode } from 'react'
import type { Todo, TodoStatus } from '../../types/todo'
import { KanbanColumnView } from './KanbanColumnView'

interface KanbanBoardViewProps {
  todoItems: Todo[]
  inProgressItems: Todo[]
  doneItems: Todo[]
  onAddClick: () => void
  renderCard: (todo: Todo) => ReactNode
}

const columns: TodoStatus[] = ['todo', 'inProgress', 'done']

export function KanbanBoardView({
  todoItems,
  inProgressItems,
  doneItems,
  onAddClick,
  renderCard,
}: KanbanBoardViewProps) {
  const itemsByStatus: Record<TodoStatus, Todo[]> = {
    todo: todoItems,
    inProgress: inProgressItems,
    done: doneItems,
  }

  const totalIncomplete = todoItems.length + inProgressItems.length

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="shrink-0 px-6 py-4 border-b border-paper-dark bg-paper">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-sans text-2xl font-semibold text-ink tracking-tight">
              TODO Board
            </h1>
            <p className="text-ink-muted text-sm mt-0.5">
              {totalIncomplete} 件の未完了タスク
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
      </header>

      {/* Kanban Board */}
      <div className="flex-1 min-h-0 p-4 md:p-6">
        <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map(status => (
            <KanbanColumnView
              key={status}
              status={status}
              count={itemsByStatus[status].length}
            >
              {itemsByStatus[status].length === 0 ? (
                <div className="flex items-center justify-center h-20 text-ink-muted/50 text-sm">
                  タスクがありません
                </div>
              ) : (
                itemsByStatus[status].map(todo => renderCard(todo))
              )}
            </KanbanColumnView>
          ))}
        </div>
      </div>
    </div>
  )
}
