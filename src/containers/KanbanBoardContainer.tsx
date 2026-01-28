import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import type { Todo, TodoStatus } from '../types/todo'
import { DraggableKanbanCard, DroppableKanbanColumn, KanbanCardView } from '../components/kanban'

interface KanbanBoardContainerProps {
  todos: Todo[]
  onUpdateStatus: (id: string, status: TodoStatus) => void
}

export function KanbanBoardContainer({ todos, onUpdateStatus }: KanbanBoardContainerProps) {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )

  const todoItems = useMemo(() => {
    return todos.filter(t => t.status === 'todo')
  }, [todos])

  const inProgressItems = useMemo(() => {
    return todos.filter(t => t.status === 'inProgress')
  }, [todos])

  const doneItems = useMemo(() => {
    return todos.filter(t => t.status === 'done')
  }, [todos])

  const activeTodo = useMemo(() => {
    if (!activeId) return null
    return todos.find(t => t.id === activeId) ?? null
  }, [activeId, todos])

  const handleAddClick = useCallback(() => {
    navigate('/new')
  }, [navigate])

  const handleCardClick = useCallback((todoId: string) => {
    navigate(`/edit/${todoId}`)
  }, [navigate])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const todoId = active.id as string
    const newStatus = over.id as TodoStatus

    const todo = todos.find(t => t.id === todoId)
    if (todo && todo.status !== newStatus) {
      onUpdateStatus(todoId, newStatus)
    }
  }, [todos, onUpdateStatus])

  const handleDragCancel = useCallback(() => {
    setActiveId(null)
  }, [])

  const columns: { status: TodoStatus; items: Todo[] }[] = [
    { status: 'todo', items: todoItems },
    { status: 'inProgress', items: inProgressItems },
    { status: 'done', items: doneItems },
  ]

  const totalIncomplete = todoItems.length + inProgressItems.length

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
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
              onClick={handleAddClick}
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
            {columns.map(({ status, items }) => (
              <DroppableKanbanColumn key={status} status={status} count={items.length}>
                {items.length === 0 ? (
                  <div className="flex items-center justify-center h-20 text-ink-muted/50 text-sm">
                    タスクがありません
                  </div>
                ) : (
                  items.map(todo => (
                    <DraggableKanbanCard
                      key={todo.id}
                      todo={todo}
                      onClick={() => handleCardClick(todo.id)}
                    />
                  ))
                )}
              </DroppableKanbanColumn>
            ))}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeTodo ? (
          <KanbanCardView
            todo={activeTodo}
            onClick={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
