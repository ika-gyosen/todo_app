import ReactMarkdown from 'react-markdown'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div className="h-full grid grid-cols-2 gap-6">
      {/* Editor */}
      <div className="flex flex-col min-h-0">
        <label className="shrink-0 flex items-center gap-2 text-sm font-medium text-ink-light mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          詳細（Markdown）
        </label>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 min-h-0 px-4 py-3 bg-white border border-paper-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all resize-none font-mono text-sm text-ink placeholder-ink-muted/50"
          placeholder="# 見出し&#10;&#10;本文を入力...&#10;&#10;- リスト項目&#10;- リスト項目&#10;&#10;**太字** や *斜体* も使えます"
        />
      </div>

      {/* Preview */}
      <div className="flex flex-col min-h-0">
        <label className="shrink-0 flex items-center gap-2 text-sm font-medium text-ink-light mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          プレビュー
        </label>
        <div className="flex-1 min-h-0 px-4 py-3 bg-white/50 border border-paper-dark rounded-xl overflow-auto">
          {value ? (
            <div className="markdown-preview">
              <ReactMarkdown>{value}</ReactMarkdown>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-ink-muted/50 italic text-sm">プレビューがここに表示されます</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
