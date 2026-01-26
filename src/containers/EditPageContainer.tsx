import { useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Todo } from '../types/todo'
import { EditPageView } from '../components/edit/EditPageView'
import { useDialog } from '../hooks/useDialog'
import { useEditForm } from '../hooks/useEditForm'

interface EditPageContainerProps {
  getTodo: (id: string) => Todo | undefined
  onAdd: (title: string, detail: string) => void
  onUpdate: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
}

export function EditPageContainer({
  getTodo,
  onAdd,
  onUpdate,
  onDelete,
  onToggleComplete,
}: EditPageContainerProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNewMode = !id
  const todo = id ? getTodo(id) : undefined

  const deleteDialog = useDialog()
  const unsavedDialog = useDialog()

  const navigateBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  const {
    title,
    detail,
    hasChanges,
    canSave,
    setTitle,
    setDetail,
    handleSave,
  } = useEditForm({
    todo,
    isNewMode,
    onAdd,
    onUpdate,
    onNavigateBack: navigateBack,
  })

  const handleBack = useCallback(() => {
    if (hasChanges) {
      unsavedDialog.open()
    } else {
      navigate('/')
    }
  }, [hasChanges, navigate, unsavedDialog])

  const handleDelete = useCallback(() => {
    deleteDialog.open()
  }, [deleteDialog])

  const confirmDelete = useCallback(() => {
    if (!id) return
    onDelete(id)
    navigate('/')
  }, [id, onDelete, navigate])

  const handleToggleComplete = useCallback(() => {
    if (!id) return
    onToggleComplete(id)
  }, [id, onToggleComplete])

  const confirmDiscard = useCallback(() => {
    navigate('/')
  }, [navigate])

  // 編集モードでTODOが見つからない場合
  if (!isNewMode && !todo) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-paper-dark mb-4">
            <svg className="w-8 h-8 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-ink-muted font-medium mb-4">TODOが見つかりません</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-accent hover:text-accent-light transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            一覧に戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <EditPageView
      isNewMode={isNewMode}
      todo={todo}
      title={title}
      detail={detail}
      hasChanges={hasChanges}
      canSave={canSave}
      showDeleteConfirm={deleteDialog.isOpen}
      showUnsavedConfirm={unsavedDialog.isOpen}
      onTitleChange={setTitle}
      onDetailChange={setDetail}
      onSave={handleSave}
      onBack={handleBack}
      onDelete={handleDelete}
      onToggleComplete={handleToggleComplete}
      onConfirmDelete={confirmDelete}
      onCancelDelete={deleteDialog.close}
      onConfirmDiscard={confirmDiscard}
      onCancelDiscard={unsavedDialog.close}
    />
  )
}
