import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMovieDetail } from '@/hooks/useMovieDetail'
import { useReviews } from '@/hooks/useReviews'
import { useToggleFavorite } from '@/hooks/useFavorites'
import { useToggleWatched } from '@/hooks/useWatched'
import { useUpsertReview } from '@/hooks/useReviewMutations'
import { useAuth } from '@/hooks/useAuth'
import { StarRating } from '@/components/ui/StarRating'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { ReviewCard } from '@/components/ui/ReviewCard'
import { Pagination } from '@/components/ui/Pagination'
import { ReviewFormModal } from '@/components/ui/ReviewFormModal'
import { getErrorMessage } from '@/interceptors/error.interceptor'
import { icons } from '@/assets/icons'
import styles from './MovieDetailPage.module.css'

function formatDuration(minutes: number | null): string | null {
  if (!minutes) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m.toString().padStart(2, '0')}min` : `${m}min`
}

/** pt-BR usa vírgula decimal: 4,8 */
function formatRating(rating: number | null): string {
  return rating === null ? '—' : rating.toFixed(1).replace('.', ',')
}

function formatCount(count: number): string {
  return new Intl.NumberFormat('pt-BR').format(count)
}

export function MovieDetailPage() {
  const params = useParams<{ id: string }>()
  const movieId = Number(params.id)
  const { isAuthenticated, user } = useAuth()

  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)

  const { data: movie, isLoading, isError, error } = useMovieDetail(movieId)
  const reviews = useReviews(movieId, page)

  const toggleFavorite = useToggleFavorite(movieId)
  const toggleWatched = useToggleWatched(movieId)
  const upsertReview = useUpsertReview()

  const myExistingReview = useMemo(() => {
    if (!user) return undefined
    return reviews.data?.data.find((r) => r.user.id === user.id)
  }, [reviews.data, user])

  if (isLoading) return <Spinner />
  if (isError || !movie) {
    return (
      <EmptyState
        title="Filme não encontrado"
        message={error ? getErrorMessage(error) : undefined}
      />
    )
  }

  const duration = formatDuration(movie.durationMinutes)
  const banner = movie.bannerImageUrl ?? movie.posterImageUrl

  const handleUpsert = (data: { rating: number; text: string }) => {
    upsertReview.mutate(
      { movieId, rating: data.rating, text: data.text },
      { onSuccess: () => setModalOpen(false) },
    )
  }

  return (
    <div>
      <div className={styles.banner}>
        {banner ? (
          <img className={styles.bannerImg} src={banner} alt={movie.title} />
        ) : (
          <div className={styles.bannerFallback}>{movie.title}</div>
        )}
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>{movie.title}</h1>
        <div className={styles.actionIcons}>
          <button
            type="button"
            className={`${styles.iconToggle} ${
              movie.isFavorite ? styles.iconFavActive : ''
            }`}
            disabled={!isAuthenticated || toggleFavorite.isPending}
            onClick={() => toggleFavorite.mutate(movie.isFavorite)}
            aria-pressed={movie.isFavorite}
            aria-label="Favoritar"
            title="Favoritar"
          >
            <img className={styles.iconImg} src={icons.heart} alt="" />
          </button>
          <button
            type="button"
            className={`${styles.iconToggle} ${
              movie.isWatched ? styles.iconActive : ''
            }`}
            disabled={!isAuthenticated || toggleWatched.isPending}
            onClick={() => toggleWatched.mutate(movie.isWatched)}
            aria-pressed={movie.isWatched}
            aria-label="Marcar como assistido"
            title="Marcar como assistido"
          >
            <img className={styles.iconImg} src={icons.watched} alt="" />
          </button>
        </div>
      </div>

      {/* 1) descrição em cima, com elenco/gêneros à direita */}
      <div className={styles.body}>
        <div className={styles.info}>
          {movie.releaseYear && (
            <div className={styles.metaLine}>Ano: {movie.releaseYear}</div>
          )}
          {duration && <div className={styles.metaLine}>Duração: {duration}</div>}
          {(movie.ageRating || movie.contentWarning) && (
            <div className={styles.warningLine}>
              {movie.ageRating && <span className={styles.ageTag}>{movie.ageRating}</span>}
              {movie.contentWarning && <span>{movie.contentWarning}</span>}
            </div>
          )}
          {movie.synopsis && <p className={styles.synopsis}>{movie.synopsis}</p>}
        </div>

        <div className={styles.sideInfo}>
          {movie.cast && (
            <div>
              <strong>Elenco:</strong> {movie.cast}
            </div>
          )}
          {movie.genres.length > 0 && (
            <div style={{ marginTop: 6 }}>
              <strong>Gêneros:</strong> {movie.genres.map((g) => g.name).join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* 2) só depois da descrição vêm as informações de avaliação */}
      <div className={styles.ratingRow}>
        <div className={styles.ratingMain}>
          <StarRating value={movie.avgRating ?? 0} size={30} />
          <span className={styles.ratingValue}>{formatRating(movie.avgRating)}</span>
        </div>
        <span className={styles.ratingCount}>
          {formatCount(movie.reviewCount)}{' '}
          {movie.reviewCount === 1 ? 'avaliação' : 'avaliações'}
        </span>
      </div>

      <div className={styles.reviewCta}>
        {isAuthenticated ? (
          <Button className={styles.ctaButton} onClick={() => setModalOpen(true)}>
            {myExistingReview ? 'Editar uma review' : 'Criar uma review'}
          </Button>
        ) : (
          <p className={styles.loginHint}>Entre para deixar uma review.</p>
        )}
      </div>

      <h2 className={`section-title ${styles.reviewsHead}`}>Reviews</h2>

      {reviews.isLoading ? (
        <Spinner />
      ) : reviews.data && reviews.data.data.length > 0 ? (
        <>
          <div className={styles.reviewsList}>
            {reviews.data.data.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          <Pagination metadata={reviews.data.metadata} onChange={setPage} />
        </>
      ) : (
        <EmptyState title="Nenhuma review" message="Seja o primeiro a avaliar este filme." />
      )}

      <ReviewFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Criar Review:"
        initialRating={myExistingReview?.rating ?? 0}
        initialText={myExistingReview?.text ?? ''}
        submitting={upsertReview.isPending}
        error={upsertReview.isError ? getErrorMessage(upsertReview.error) : undefined}
        onSubmit={handleUpsert}
      />
    </div>
  )
}
