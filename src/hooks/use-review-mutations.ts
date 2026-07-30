import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewService } from '@/lib/services/review.service'
import type { UpdateReviewPayload, UpsertReviewPayload } from '@/lib/types/review.types'

export function useUpsertReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpsertReviewPayload) => reviewService.upsert(payload),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: ['movie', review.movie.id] })
      queryClient.invalidateQueries({ queryKey: ['reviews', 'movie', review.movie.id] })
      queryClient.invalidateQueries({ queryKey: ['myReviews'] })
    },
  })
}

export function useUpdateReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateReviewPayload }) =>
      reviewService.update(id, payload),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: ['movie', review.movie.id] })
      queryClient.invalidateQueries({ queryKey: ['reviews', 'movie', review.movie.id] })
      queryClient.invalidateQueries({ queryKey: ['myReviews'] })
    },
  })
}

export function useDeleteReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => reviewService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReviews'] })
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['movie'] })
    },
  })
}
