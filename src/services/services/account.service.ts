import { httpClient } from '@/lib/adapter'
import { DEFAULT_PER_PAGE } from '@/lib/config'
import { normalizePaginatedReviews } from '@/lib/services/review.normalizer'
import type { Paginated } from '@/lib/types/api.types'
import type { MovieLite } from '@/lib/types/movie.types'
import type { Review } from '@/lib/types/review.types'

function listParams(page: number, perPage: number, search?: string) {
  const params: Record<string, string | number> = { page, perPage }
  if (search?.trim()) params.search = search.trim()
  return params
}

export const accountService = {
  favorites: (
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    search?: string,
  ): Promise<Paginated<MovieLite>> =>
    httpClient.getRaw<Paginated<MovieLite>>('/account/favorites', {
      params: listParams(page, perPage, search),
    }),

  /** Idempotente. O movieId vai no body; a remoção usa o id na URL. */
  addFavorite: (movieId: number): Promise<void> =>
    httpClient.post<{ message: string }>('/account/favorites', { movieId }).then(() => undefined),

  removeFavorite: (movieId: number): Promise<void> =>
    httpClient.del(`/account/favorites/${movieId}`),

  watched: (
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    search?: string,
  ): Promise<Paginated<MovieLite>> =>
    httpClient.getRaw<Paginated<MovieLite>>('/account/watched', {
      params: listParams(page, perPage, search),
    }),

  /** Idempotente. Mesma convenção dos favoritos. */
  addWatched: (movieId: number): Promise<void> =>
    httpClient.post<{ message: string }>('/account/watched', { movieId }).then(() => undefined),

  removeWatched: (movieId: number): Promise<void> =>
    httpClient.del(`/account/watched/${movieId}`),

  myReviews: (page = 1, perPage = DEFAULT_PER_PAGE): Promise<Paginated<Review>> =>
    httpClient
      .getRaw<Paginated<Review>>('/account/reviews', { params: { page, perPage } })
      .then(normalizePaginatedReviews),
}
