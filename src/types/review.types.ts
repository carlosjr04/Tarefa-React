import type { MovieSummary } from '@/types/movie.types'
import type { PublicUser } from '@/types/user.types'

export type Rating = 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5

export interface Review {
  id: number
  /** A API devolve `rating` ora como number, ora como string — os services normalizam para number. */
  rating: number
  text: string | null
  createdAt: string
  updatedAt: string
  user: PublicUser
  movie: MovieSummary
}

export interface UpsertReviewPayload {
  movieId: number
  rating: number
  text?: string
}

export interface UpdateReviewPayload {
  rating: number
  text?: string
}
