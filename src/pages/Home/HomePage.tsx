import { useFeaturedMovies } from '@/hooks/use-featured-movies'
import { useGenres } from '@/hooks/use-genres'
import { useRandomReviews } from '@/hooks/use-random-reviews'
import { FeaturedHero } from '@/components/home/FeaturedHero'
import { GenreCarousel } from '@/components/home/GenreCarousel'
import { ReviewCard } from '@/components/ui/ReviewCard'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import styles from './HomePage.module.css'

export function HomePage() {
  const featured = useFeaturedMovies()
  const genres = useGenres()
  const reviews = useRandomReviews()

  return (
    <div className="stack-lg">
      <section>
        {featured.isLoading ? (
          <Spinner />
        ) : featured.data && featured.data.length > 0 ? (
          <FeaturedHero movies={featured.data} />
        ) : null}
      </section>

      {genres.isLoading && <Spinner />}
      {genres.data?.map((genre) => <GenreCarousel key={genre.id} genre={genre} />)}

      <section className={styles.reviewsSection}>
        <h2 className={styles.reviewsTitle}>Reviews</h2>
        {reviews.isLoading ? (
          <Spinner />
        ) : reviews.data && reviews.data.length > 0 ? (
          <div className={styles.reviewsList}>
            {reviews.data.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <EmptyState title="Sem reviews" message="Ainda não há avaliações para mostrar." />
        )}
      </section>
    </div>
  )
}
