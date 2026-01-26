import { useRef, useCallback } from 'react'
import { ConfirmDialogView } from '../components/common/ConfirmDialogView'
import { useEscapeKey } from '../hooks/useEscapeKey'

interface ConfirmDialogContainerProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialogContainer({
  isOpen,
  title,
  message,
  confirmLabel = '確認',
  cancelLabel = 'キャンセル',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogContainerProps) {
  const backdropRef = useRef<HTMLDivElement>(null)

  useEscapeKey(onCancel, isOpen)

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onCancel()
    }
  }, [onCancel])

  return (
    <ConfirmDialogView
      isOpen={isOpen}
      title={title}
      message={message}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      variant={variant}
      onConfirm={onConfirm}
      onCancel={onCancel}
      onBackdropClick={handleBackdropClick}
      backdropRef={backdropRef}
    />
  )
}
