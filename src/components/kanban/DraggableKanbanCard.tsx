import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Todo } from '../../types/todo'

interface DraggableKanbanCardProps {
  todo: Todo
  onClick: () => void
}

export function DraggableKanbanCard({ todo, onClick }: DraggableKanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: todo.id,
    data: { todo },
  })

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      onClick()
    }
    e.stopPropagation()
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`
        group p-3
        bg-white/80 backdrop-blur-sm rounded-lg
        border border-paper-dark/80
        cursor-grab
        transition-all duration-200
        ${isDragging
          ? 'opacity-50 shadow-xl scale-105 z-50'
          : 'hover:bg-white hover:shadow-md hover:shadow-ink/5 hover:border-accent/20 hover:-translate-y-0.5'
        }
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
