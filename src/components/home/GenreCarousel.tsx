import { useMoviesByGenre } from '@/hooks/use-movies'
import { Carousel } from '@/components/ui/Carousel'
import { MovieCard } from '@/components/ui/MovieCard'
import { Spinner } from '@/components/ui/Spinner'
import type { Genre } from '@/lib/types/genre.types'

interface GenreCarouselProps {
  genre: Genre
}

export function GenreCarousel({ genre }: GenreCarouselProps) {
  const { data, isLoading, isError } = useMoviesByGenre(genre.id)

  const movies = data?.data ?? []
  if (!isLoading && !isError && movies.length === 0) return null

  return (
    <section>
      <h2 className="section-title">{genre.name}</h2>
      {isLoading ? (
        <Spinner />
      ) : (
        <Carousel
          items={movies}
          keyFor={(m) => m.id}
          renderItem={(movie) => <MovieCard movie={movie} />}
        />
      )}
    </section>
  )
}
