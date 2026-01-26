import type { Todo } from '../../types/todo'

interface TodoItemViewProps {
  todo: Todo
  onClick: () => void
  onCheckboxClick: (e: React.MouseEvent) => void
}

export function TodoItemView({ todo, onClick, onCheckboxClick }: TodoItemViewProps) {
  return (
    <div
      onClick={onClick}
      className={`
        group flex items-center gap-4 p-4
        bg-white/80 backdrop-blur-sm rounded-xl
        border border-paper-dark/80
        cursor-pointer
        transition-all duration-200
        hover:bg-white hover:shadow-lg hover:shadow-ink/5 hover:border-accent/20
        hover:-translate-y-0.5
        ${todo.completed ? 'opacity-60' : ''}
      `}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onClick={onCheckboxClick}
        onChange={() => {}}
        className="shrink-0"
      />
      <div className="flex-1 min-w-0">
        <span
          className={`
            block text-base font-medium truncate
            transition-colors duration-200
            ${todo.completed
              ? 'text-ink-muted line-through decoration-ink-muted/50'
              : 'text-ink group-hover:text-accent'
            }
          `}
        >
          {todo.title}
        </span>
        {todo.detail && (
          <span className="block text-sm text-ink-muted truncate mt-0.5">
            {todo.detail.slice(0, 60)}{todo.detail.length > 60 ? '...' : ''}
          </span>
        )}
      </div>
      <svg
        className="w-5 h-5 text-ink-muted/50 group-hover:text-accent transition-all duration-200 group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )
}
