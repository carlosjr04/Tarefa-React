import { httpClient } from '@/adapters/http.adapter'
import { DEFAULT_PER_PAGE } from '@/config/env'
import {
  normalizePaginatedReviews,
  normalizeReview,
  normalizeReviews,
} from '@/services/review.normalizer'
import type { Paginated } from '@/types/api.types'
import type { Review, UpdateReviewPayload, UpsertReviewPayload } from '@/types/review.types'

export const reviewService = {
  listByMovie: (
    movieId: number,
    page = 1,
    perPage = DEFAULT_PER_PAGE,
  ): Promise<Paginated<Review>> =>
    httpClient
      .getRaw<Paginated<Review>>('/reviews', { params: { movieId, page, perPage } })
      .then(normalizePaginatedReviews),

  random: (count = 10): Promise<Review[]> =>
    httpClient
      .get<Review[]>('/reviews/random', { params: { count } })
      .then(normalizeReviews),

  upsert: (payload: UpsertReviewPayload): Promise<Review> =>
    httpClient.post<Review>('/reviews', payload).then(normalizeReview),

  update: (id: number, payload: UpdateReviewPayload): Promise<Review> =>
    httpClient.put<Review>(`/reviews/${id}`, payload).then(normalizeReview),

  remove: (id: number): Promise<void> => httpClient.del(`/reviews/${id}`),
}
