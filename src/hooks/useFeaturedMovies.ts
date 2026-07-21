import { useQuery } from '@tanstack/react-query'
import { movieService } from '@/services/movie.service'

export function useFeaturedMovies(count = 10) {
  return useQuery({
    queryKey: ['movies', 'featured', count],
    queryFn: () => movieService.featured(count),
  })
}
