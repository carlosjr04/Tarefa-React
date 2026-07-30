import { httpAdapter } from '@/lib/adapter'
import { apiRoutes, DEFAULT_PER_PAGE } from '@/lib/config'
import { BaseService } from '@/services/base-service'
import { normalizePaginatedReviews } from '@/services/review.normalizer'
import type { ApiResponse, Paginated } from '@/types/api.types'
import type { MovieLite } from '@/types/movie.types'
import type { Review } from '@/types/review.types'
import type { PublicUser } from '@/types/user.types'

class UserService extends BaseService {
  public async profile(id: number): Promise<PublicUser> {
    const res = await this.execute<void, ApiResponse<PublicUser>>({
      method: 'GET',
      url: apiRoutes.user(id),
    })
    return res.data.data
  }

  public async favorites(
    id: number,
    page = 1,
    perPage = DEFAULT_PER_PAGE,
  ): Promise<Paginated<MovieLite>> {
    const res = await this.execute<void, Paginated<MovieLite>>({
      method: 'GET',
      url: apiRoutes.userFavorites(id),
      params: { page: String(page), perPage: String(perPage) },
    })
    return res.data
  }

  public async watched(
    id: number,
    page = 1,
    perPage = DEFAULT_PER_PAGE,
  ): Promise<Paginated<MovieLite>> {
    const res = await this.execute<void, Paginated<MovieLite>>({
      method: 'GET',
      url: apiRoutes.userWatched(id),
      params: { page: String(page), perPage: String(perPage) },
    })
    return res.data
  }

  public async reviews(
    id: number,
    page = 1,
    perPage = DEFAULT_PER_PAGE,
  ): Promise<Paginated<Review>> {
    const res = await this.execute<void, Paginated<Review>>({
      method: 'GET',
      url: apiRoutes.userReviews(id),
      params: { page: String(page), perPage: String(perPage) },
    })
    return normalizePaginatedReviews(res.data)
  }
}

export const userService = new UserService(httpAdapter)
