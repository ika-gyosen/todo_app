import type { RefObject } from 'react'

interface ConfirmDialogViewProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  variant: 'danger' | 'warning' | 'default'
  onConfirm: () => void
  onCancel: () => void
  onBackdropClick: (e: React.MouseEvent) => void
  backdropRef: RefObject<HTMLDivElement | null>
}

const variantStyles = {
  danger: {
    icon: (
      <svg className="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    iconBg: 'bg-danger-light/30',
    button: 'bg-danger hover:bg-danger/90'
  },
  warning: {
    icon: (
      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    iconBg: 'bg-amber-100',
    button: 'bg-amber-600 hover:bg-amber-700'
  },
  default: {
    icon: (
      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-accent-pale',
    button: 'bg-accent hover:bg-accent-light'
  }
}

export function ConfirmDialogView({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant,
  onConfirm,
  onCancel,
  onBackdropClick,
  backdropRef,
}: ConfirmDialogViewProps) {
  if (!isOpen) return null

  const styles = variantStyles[variant]

  return (
    <div
      ref={backdropRef}
      onClick={onBackdropClick}
      className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
    >
      <div className="bg-paper rounded-2xl w-full max-w-md shadow-2xl shadow-ink/20 animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`shrink-0 w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center`}>
              {styles.icon}
            </div>
            <div className="flex-1 pt-1">
              <h3 className="font-sans text-lg font-semibold text-ink mb-2">{title}</h3>
              <p className="text-ink-light leading-relaxed">{message}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-paper-dark bg-paper-dark/30 rounded-b-2xl">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-ink-light hover:text-ink bg-white border border-paper-dark hover:border-ink-muted/30 rounded-xl transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 text-white ${styles.button} rounded-xl transition-all shadow-sm hover:shadow-md`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
