import type { ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'
import type { TodoStatus } from '../../types/todo'

interface DroppableKanbanColumnProps {
  status: TodoStatus
  count: number
  children: ReactNode
}

const statusConfig: Record<TodoStatus, { label: string; bgColor: string; borderColor: string; dropBgColor: string; dropBorderColor: string }> = {
  todo: {
    label: 'Todo',
    bgColor: 'bg-paper-dark/50',
    borderColor: 'border-ink-muted/30',
    dropBgColor: 'bg-paper-dark/70',
    dropBorderColor: 'border-ink-muted/60',
  },
  inProgress: {
    label: 'In Progress',
    bgColor: 'bg-accent-pale/50',
    borderColor: 'border-accent/30',
    dropBgColor: 'bg-accent-pale/70',
    dropBorderColor: 'border-accent/60',
  },
  done: {
    label: 'Done',
    bgColor: 'bg-success-light/30',
    borderColor: 'border-success/30',
    dropBgColor: 'bg-success-light/50',
    dropBorderColor: 'border-success/60',
  },
}

export function DroppableKanbanColumn({ status, count, children }: DroppableKanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
    data: { status },
  })

  const config = statusConfig[status]
  const bgColor = isOver ? config.dropBgColor : config.bgColor
  const borderColor = isOver ? config.dropBorderColor : config.borderColor

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col min-h-0 rounded-xl border-2
        transition-all duration-200
        ${bgColor} ${borderColor}
        ${isOver ? 'ring-2 ring-offset-2 ring-accent/30' : ''}
      `}
    >
      {/* Column Header */}
      <div className="shrink-0 px-4 py-3 border-b border-paper-dark/50">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-ink">{config.label}</h2>
          <span className="px-2 py-0.5 text-xs font-medium text-ink-muted bg-white/60 rounded-full">
            {count}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {children}
      </div>
    </div>
  )
}
