import type { ReactNode } from 'react'
import type { TodoStatus } from '../../types/todo'

interface KanbanColumnViewProps {
  status: TodoStatus
  count: number
  children: ReactNode
}

const statusConfig: Record<TodoStatus, { label: string; bgColor: string; borderColor: string }> = {
  todo: {
    label: 'Todo',
    bgColor: 'bg-paper-dark/50',
    borderColor: 'border-ink-muted/30',
  },
  inProgress: {
    label: 'In Progress',
    bgColor: 'bg-accent-pale/50',
    borderColor: 'border-accent/30',
  },
  done: {
    label: 'Done',
    bgColor: 'bg-success-light/30',
    borderColor: 'border-success/30',
  },
}

export function KanbanColumnView({ status, count, children }: KanbanColumnViewProps) {
  const config = statusConfig[status]

  return (
    <div className={`flex flex-col min-h-0 ${config.bgColor} rounded-xl border ${config.borderColor}`}>
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
