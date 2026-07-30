import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { reviewService } from '@/lib/services/review.service'

export function useReviews(movieId: number, page = 1) {
  return useQuery({
    queryKey: ['reviews', 'movie', movieId, page],
    queryFn: () => reviewService.listByMovie(movieId, page),
    enabled: Number.isFinite(movieId) && movieId > 0,
    placeholderData: keepPreviousData,
  })
}
