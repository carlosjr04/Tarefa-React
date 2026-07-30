import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { movieService } from '@/lib/services/movie.service'
import type { MovieListParams } from '@/lib/types/movie.types'

export function useMovies(params: MovieListParams) {
  return useQuery({
    queryKey: ['movies', 'list', params],
    queryFn: () => movieService.list(params),
    placeholderData: keepPreviousData,
  })
}

export function useMoviesByGenre(genreId: number, perPage = 15) {
  return useQuery({
    queryKey: ['movies', 'byGenre', genreId, perPage],
    queryFn: () => movieService.list({ genreIds: [genreId], perPage }),
  })
}
