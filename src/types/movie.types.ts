import type { Genre } from '@/types/genre.types'

/** Forma mínima do filme — é o que vem embutido nas reviews (sem `genres`). */
export interface MovieSummary {
  id: number
  title: string
  posterImageUrl: string | null
  releaseYear: number | null
}

export interface MovieLite extends MovieSummary {
  genres: Genre[]
}

export interface MovieDetail extends MovieLite {
  synopsis: string | null
  bannerImageUrl: string | null
  durationMinutes: number | null
  ageRating: string | null
  contentWarning: string | null
  cast: string | null
  createdAt: string
  updatedAt: string
  avgRating: number | null
  reviewCount: number
  isFavorite: boolean
  isWatched: boolean
}

export interface MovieListParams {
  q?: string
  genreIds?: number[]
  page?: number
  perPage?: number
}

export interface CreateMoviePayload {
  title: string
  synopsis?: string
  posterImageUrl?: string
  bannerImageUrl?: string
  releaseYear?: number
  durationMinutes?: number
  ageRating?: string
  contentWarning?: string
  cast?: string
  genreIds?: number[]
}

export type UpdateMoviePayload = Partial<CreateMoviePayload>
