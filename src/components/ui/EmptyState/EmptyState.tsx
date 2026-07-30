import type { ReactNode } from 'react'

interface EmptyStateProps {
  title?: string
  message?: string
  children?: ReactNode
}

export function EmptyState({
  title = 'Nada por aqui',
  message,
  children,
}: EmptyStateProps) {
  return (
    <div className="center-block">
      <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
        {title}
      </p>
      {message && <p style={{ margin: 0 }}>{message}</p>}
      {children}
    </div>
  )
}
