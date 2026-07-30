import { useQuery } from '@tanstack/react-query'
import { reviewService } from '@/lib/services/review.service'

export function useRandomReviews(count = 10) {
  return useQuery({
    queryKey: ['reviews', 'random', count],
    queryFn: () => reviewService.random(count),
  })
}
