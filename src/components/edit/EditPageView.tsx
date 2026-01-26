import type { Todo } from '../../types/todo'
import { MarkdownEditor } from './MarkdownEditor'
import { ConfirmDialogContainer } from '../../containers/ConfirmDialogContainer'

interface EditPageViewProps {
  isNewMode: boolean
  todo?: Todo
  title: string
  detail: string
  hasChanges: boolean
  canSave: boolean
  showDeleteConfirm: boolean
  showUnsavedConfirm: boolean
  onTitleChange: (title: string) => void
  onDetailChange: (detail: string) => void
  onSave: () => void
  onBack: () => void
  onDelete: () => void
  onToggleComplete: () => void
  onConfirmDelete: () => void
  onCancelDelete: () => void
  onConfirmDiscard: () => void
  onCancelDiscard: () => void
}

export function EditPageView({
  isNewMode,
  todo,
  title,
  detail,
  hasChanges,
  canSave,
  showDeleteConfirm,
  showUnsavedConfirm,
  onTitleChange,
  onDetailChange,
  onSave,
  onBack,
  onDelete,
  onToggleComplete,
  onConfirmDelete,
  onCancelDelete,
  onConfirmDiscard,
  onCancelDiscard,
}: EditPageViewProps) {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="shrink-0 flex justify-between items-center px-6 py-4 border-b border-paper-dark bg-paper">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-ink-light hover:text-accent transition-colors"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">戻る</span>
          </button>
          <div className="h-6 w-px bg-paper-dark" />
          <h1 className="font-sans text-xl font-semibold text-ink">
            {isNewMode ? '新しいTODO' : 'TODOを編集'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Complete toggle - 編集モードのみ */}
          {!isNewMode && todo && (
            <label className="flex items-center gap-2 px-4 py-2 bg-white border border-paper-dark rounded-xl cursor-pointer hover:border-accent/30 transition-all">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={onToggleComplete}
              />
              <span className={`text-sm font-medium ${todo.completed ? 'text-success' : 'text-ink-light'}`}>
                {todo.completed ? '完了済み' : '未完了'}
              </span>
            </label>
          )}

          {/* Delete button - 編集モードのみ */}
          {!isNewMode && (
            <button
              onClick={onDelete}
              className="px-4 py-2.5 text-danger hover:bg-danger-light/30 rounded-xl transition-colors"
            >
              削除
            </button>
          )}

          {/* Save/Create button */}
          <button
            onClick={onSave}
            disabled={!canSave}
            className="px-5 py-2.5 text-white bg-accent hover:bg-accent-light disabled:bg-ink-muted disabled:cursor-not-allowed rounded-xl transition-all shadow-sm hover:shadow-md disabled:shadow-none"
          >
            {isNewMode ? '作成' : hasChanges ? '保存' : '保存済み'}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden p-6 gap-4">
        {/* Title */}
        <div className="shrink-0">
          <input
            type="text"
            value={title}
            onChange={e => onTitleChange(e.target.value)}
            autoFocus={isNewMode}
            className="w-full px-4 py-3 bg-white border border-paper-dark rounded-xl text-xl font-medium text-ink placeholder-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
            placeholder="タスクのタイトルを入力..."
          />
        </div>

        {/* Markdown Editor - fills remaining space */}
        <div className="flex-1 min-h-0">
          <MarkdownEditor value={detail} onChange={onDetailChange} />
        </div>

        {/* Meta info - 編集モードのみ */}
        {!isNewMode && todo && (
          <div className="shrink-0 flex items-center gap-2 text-sm text-ink-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            作成: {new Date(todo.createdAt).toLocaleString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ConfirmDialogContainer
        isOpen={showDeleteConfirm}
        title="削除の確認"
        message="このTODOを削除しますか？この操作は取り消せません。"
        confirmLabel="削除"
        variant="danger"
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />

      <ConfirmDialogContainer
        isOpen={showUnsavedConfirm}
        title="未保存の変更"
        message={isNewMode ? "入力内容が破棄されます。戻りますか？" : "未保存の変更があります。保存せずに戻りますか？"}
        confirmLabel="破棄して戻る"
        variant="warning"
        onConfirm={onConfirmDiscard}
        onCancel={onCancelDiscard}
      />
    </div>
  )
}
