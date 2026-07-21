import { Link } from 'react-router-dom'
import type { Review } from '@/types/review.types'
import { Avatar } from './Avatar'
import { StarRating } from './StarRating'
import styles from './ReviewCard.module.css'

interface ReviewCardProps {
  review: Review
  onEdit?: (review: Review) => void
  onDelete?: (review: Review) => void
  linkUser?: boolean
}

export function ReviewCard({ review, onEdit, onDelete, linkUser = true }: ReviewCardProps) {
  const { movie, user } = review
  const userName = user.fullName ?? 'Usuário'

  return (
    <article className={styles.card}>
      <Link to={`/movies/${movie.id}`}>
        {movie.posterImageUrl ? (
          <img className={styles.poster} src={movie.posterImageUrl} alt={movie.title} />
        ) : (
          <div className={styles.posterFallback}>{movie.title}</div>
        )}
      </Link>

      <div className={styles.body}>
        <div className={styles.headline}>
          <Link to={`/movies/${movie.id}`} className={styles.movieTitle}>
            {movie.title}
          </Link>
          {movie.releaseYear && <span className={styles.year}>{movie.releaseYear}</span>}
          <span className={styles.stars}>
            <StarRating value={review.rating} size={16} />
          </span>
        </div>

        <div className={styles.userRow}>
          <Avatar
            avatarUrl={user.avatarUrl}
            initials={user.initials}
            name={userName}
            size={22}
          />
          {linkUser ? (
            <Link to={`/users/${user.id}`}>{userName}</Link>
          ) : (
            <span>{userName}</span>
          )}
        </div>

        {review.text && <p className={styles.text}>{review.text}</p>}
      </div>

      {(onEdit || onDelete) && (
        <div className={styles.actions}>
          {onEdit && (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => onEdit(review)}
              aria-label="Editar avaliação"
              title="Editar"
            >
              ✎
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.iconDanger}`}
              onClick={() => onDelete(review)}
              aria-label="Apagar avaliação"
              title="Apagar"
            >
              🗑
            </button>
          )}
        </div>
      )}
    </article>
  )
}
