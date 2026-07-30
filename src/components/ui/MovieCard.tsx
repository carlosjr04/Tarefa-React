import { Link } from 'react-router-dom'
import type { MovieLite } from '@/lib/types/movie.types'
import { icons } from '@/assets/icons'
import styles from './MovieCard.module.css'

interface MovieCardProps {
  movie: MovieLite
  showMeta?: boolean
  /** Badge de ação opcional (ex.: coração nos favoritos, remover nos assistidos). */
  badge?: 'favorite' | 'remove'
  onBadgeClick?: () => void
}

export function MovieCard({
  movie,
  showMeta = true,
  badge,
  onBadgeClick,
}: MovieCardProps) {
  return (
    <Link to={`/movies/${movie.id}`} className={styles.card}>
      <div className={styles.posterWrap}>
        {movie.posterImageUrl ? (
          <img
            className={styles.poster}
            src={movie.posterImageUrl}
            alt={movie.title}
            loading="lazy"
          />
        ) : (
          <div className={styles.fallback}>{movie.title}</div>
        )}

        {badge && (
          <button
            type="button"
            className={`${styles.badge} ${
              badge === 'favorite' ? styles.badgeFav : styles.badgeRemove
            }`}
            aria-label={badge === 'favorite' ? 'Favorito' : 'Remover'}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onBadgeClick?.()
            }}
          >
            {badge === 'favorite' ? (
              <img className={styles.badgeIcon} src={icons.heart} alt="" />
            ) : (
              '−'
            )}
          </button>
        )}
      </div>

      {showMeta && (
        <div className={styles.meta}>
          <div className={styles.title}>{movie.title}</div>
          {movie.releaseYear && <div className={styles.year}>{movie.releaseYear}</div>}
        </div>
      )}
    </Link>
  )
}
