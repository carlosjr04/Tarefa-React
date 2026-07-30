import type { Genre } from '@/types/genre.types'
import styles from './FilterChips.module.css'

interface FilterChipsProps {
  genres: Genre[]
  selectedIds: number[]
  onToggle: (id: number) => void
}

export function FilterChips({ genres, selectedIds, onToggle }: FilterChipsProps) {
  return (
    <div className={styles.chips}>
      {genres.map((genre) => {
        const selected = selectedIds.includes(genre.id)
        return (
          <button
            type="button"
            key={genre.id}
            className={`${styles.chip} ${selected ? styles.selected : ''}`}
            onClick={() => onToggle(genre.id)}
            aria-pressed={selected}
          >
            <span className={styles.icon}>{selected ? '−' : '+'}</span>
            {genre.name}
          </button>
        )
      })}
    </div>
  )
}
