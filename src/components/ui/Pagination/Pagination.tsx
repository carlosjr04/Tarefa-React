import type { Metadata } from '@/types/api.types'
import styles from './Pagination.module.css'

interface PaginationProps {
  metadata: Metadata
  onChange: (page: number) => void
}

function pageWindow(current: number, last: number): number[] {
  const span = 2
  const start = Math.max(1, current - span)
  const end = Math.min(last, current + span)
  const pages: number[] = []
  for (let p = start; p <= end; p++) pages.push(p)
  return pages
}

export function Pagination({ metadata, onChange }: PaginationProps) {
  const { currentPage, lastPage } = metadata
  if (lastPage <= 1) return null

  const pages = pageWindow(currentPage, lastPage)

  return (
    <nav className={styles.wrap} aria-label="Paginação">
      <button
        type="button"
        className={`${styles.item} ${styles.arrow}`}
        disabled={currentPage <= 1}
        onClick={() => onChange(currentPage - 1)}
        aria-label="Página anterior"
      >
        ‹
      </button>

      {pages[0] > 1 && (
        <>
          <button type="button" className={styles.item} onClick={() => onChange(1)}>
            1
          </button>
          {pages[0] > 2 && <span className="muted">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          type="button"
          key={p}
          className={`${styles.item} ${p === currentPage ? styles.active : ''}`}
          aria-current={p === currentPage ? 'page' : undefined}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < lastPage && (
        <>
          {pages[pages.length - 1] < lastPage - 1 && <span className="muted">…</span>}
          <button
            type="button"
            className={styles.item}
            onClick={() => onChange(lastPage)}
          >
            {lastPage}
          </button>
        </>
      )}

      <button
        type="button"
        className={`${styles.item} ${styles.arrow}`}
        disabled={currentPage >= lastPage}
        onClick={() => onChange(currentPage + 1)}
        aria-label="Próxima página"
      >
        ›
      </button>
    </nav>
  )
}
