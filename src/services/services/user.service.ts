import { httpClient } from '@/lib/adapter'
import { DEFAULT_PER_PAGE } from '@/lib/config'
import { normalizePaginatedReviews } from '@/lib/services/review.normalizer'
import type { Paginated } from '@/lib/types/api.types'
import type { MovieLite } from '@/lib/types/movie.types'
import type { Review } from '@/lib/types/review.types'
import type { PublicUser } from '@/lib/types/user.types'

export const userService = {
  profile: (id: number): Promise<PublicUser> => httpClient.get<PublicUser>(`/users/${id}`),

  favorites: (
    id: number,
    page = 1,
    perPage = DEFAULT_PER_PAGE,
  ): Promise<Paginated<MovieLite>> =>
    httpClient.getRaw<Paginated<MovieLite>>(`/users/${id}/favorites`, {
      params: { page, perPage },
    }),

  watched: (
    id: number,
    page = 1,
    perPage = DEFAULT_PER_PAGE,
  ): Promise<Paginated<MovieLite>> =>
    httpClient.getRaw<Paginated<MovieLite>>(`/users/${id}/watched`, {
      params: { page, perPage },
    }),

  reviews: (id: number, page = 1, perPage = DEFAULT_PER_PAGE): Promise<Paginated<Review>> =>
    httpClient
      .getRaw<Paginated<Review>>(`/users/${id}/reviews`, { params: { page, perPage } })
      .then(normalizePaginatedReviews),
}
