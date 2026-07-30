import type { Paginated } from '@/types/api.types'
import type { Review } from '@/types/review.types'

/**
 * A API é inconsistente com `rating`: `POST /reviews` devolve number,
 * enquanto as listagens devolvem string ("4.5"). Normalizamos para number
 * antes de qualquer coisa subir para os hooks/componentes.
 */
export function normalizeReview(review: Review): Review {
  return { ...review, rating: Number(review.rating) }
}

export function normalizeReviews(reviews: Review[]): Review[] {
  return reviews.map(normalizeReview)
}

export function normalizePaginatedReviews(page: Paginated<Review>): Paginated<Review> {
  return { ...page, data: normalizeReviews(page.data) }
}
