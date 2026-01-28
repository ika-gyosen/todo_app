import type { Todo } from '../../types/todo'

interface KanbanCardViewProps {
  todo: Todo
  onClick: () => void
}

export function KanbanCardView({ todo, onClick }: KanbanCardViewProps) {
  return (
    <div
      onClick={onClick}
      className={`
        group p-3
        bg-white/80 backdrop-blur-sm rounded-lg
        border border-paper-dark/80
        cursor-pointer
        transition-all duration-200
        hover:bg-white hover:shadow-md hover:shadow-ink/5 hover:border-accent/20
        hover:-translate-y-0.5
        ${todo.status === 'done' ? 'opacity-60' : ''}
      `}
    >
      <span
        className={`
          block text-sm font-medium
          transition-colors duration-200
          ${todo.status === 'done'
            ? 'text-ink-muted line-through decoration-ink-muted/50'
            : 'text-ink group-hover:text-accent'
          }
        `}
      >
        {todo.title}
      </span>
      {todo.detail && (
        <span className="block text-xs text-ink-muted truncate mt-1">
          {todo.detail.slice(0, 40)}{todo.detail.length > 40 ? '...' : ''}
        </span>
      )}
    </div>
  )
}
