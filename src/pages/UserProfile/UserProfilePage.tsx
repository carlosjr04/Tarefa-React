import { useParams } from 'react-router-dom'
import {
  useUserProfile,
  useUserFavorites,
  useUserWatched,
  useUserReviews,
} from '@/hooks/useUserProfile'
import { Avatar } from '@/components/ui/Avatar'
import { Carousel } from '@/components/ui/Carousel'
import { MovieCard } from '@/components/ui/MovieCard'
import { ReviewCard } from '@/components/ui/ReviewCard'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import type { MovieLite } from '@/types/movie.types'
import styles from './UserProfilePage.module.css'

function MovieRow({ title, movies }: { title: string; movies: MovieLite[] }) {
  if (movies.length === 0) return null
  return (
    <section>
      <h2 className="section-title">{title}</h2>
      <Carousel
        items={movies}
        keyFor={(m) => m.id}
        renderItem={(movie) => <MovieCard movie={movie} showMeta={false} />}
      />
    </section>
  )
}

export function UserProfilePage() {
  const params = useParams<{ id: string }>()
  const userId = Number(params.id)

  const profile = useUserProfile(userId)
  const favorites = useUserFavorites(userId)
  const watched = useUserWatched(userId)
  const reviews = useUserReviews(userId)

  if (profile.isLoading) return <Spinner />
  if (profile.isError || !profile.data) {
    return <EmptyState title="Usuário não encontrado" />
  }

  const user = profile.data
  const reviewList = reviews.data?.data ?? []

  return (
    <div className="stack-lg">
      <div className={styles.head}>
        <Avatar
          avatarUrl={user.avatarUrl}
          initials={user.initials}
          name={user.fullName}
          size={96}
        />
        <h1 className={styles.name}>{user.fullName ?? 'Usuário'}</h1>
      </div>

      <MovieRow title="Favoritos" movies={favorites.data?.data ?? []} />
      <MovieRow title="Assistidos" movies={watched.data?.data ?? []} />

      <section>
        <h2 className={styles.reviewsTitle}>Reviews</h2>
        {reviews.isLoading ? (
          <Spinner />
        ) : reviewList.length > 0 ? (
          <div className={styles.reviewsList}>
            {reviewList.map((review) => (
              <ReviewCard key={review.id} review={review} linkUser={false} />
            ))}
          </div>
        ) : (
          <EmptyState title="Sem reviews" message="Este usuário ainda não avaliou filmes." />
        )}
      </section>
    </div>
  )
}
