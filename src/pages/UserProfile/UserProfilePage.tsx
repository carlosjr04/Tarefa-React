import { useParams } from 'react-router-dom'
import {
  useUserProfile,
  useUserFavorites,
  useUserWatched,
  useUserReviews,
} from '@/hooks/use-user-profile'
import { Avatar } from '@/components/ui/Avatar/Avatar'
import { ReviewCard } from '@/components/ui/ReviewCard/ReviewCard'
import { Spinner } from '@/components/ui/Spinner/Spinner'
import { EmptyState } from '@/components/ui/EmptyState/EmptyState'
import styles from './UserProfilePage.module.css'
import MovieRow from '@/components/ui/MovieRow/MovieRow'



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
