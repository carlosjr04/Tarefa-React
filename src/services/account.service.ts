import { httpAdapter } from '@/lib/adapter'
import { apiRoutes, DEFAULT_PER_PAGE } from '@/lib/config'
import { BaseService } from '@/services/base-service'
import { normalizePaginatedReviews } from '@/services/review.normalizer'
import type { Paginated } from '@/types/api.types'
import type { MovieLite } from '@/types/movie.types'
import type { Review } from '@/types/review.types'

function listParams(page: number, perPage: number, search?: string): Record<string, string> {
  const params: Record<string, string> = { page: String(page), perPage: String(perPage) }
  if (search?.trim()) params.search = search.trim()
  return params
}

class AccountService extends BaseService {
  public async favorites(
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    search?: string,
  ): Promise<Paginated<MovieLite>> {
    const res = await this.execute<void, Paginated<MovieLite>>({
      method: 'GET',
      url: apiRoutes.ACCOUNT_FAVORITES,
      params: listParams(page, perPage, search),
    })
    return res.data
  }

  /** Idempotente. O movieId vai no body; a remoção usa o id na URL. */
  public async addFavorite(movieId: number): Promise<void> {
    await this.execute<{ movieId: number }, unknown>({
      method: 'POST',
      url: apiRoutes.ACCOUNT_FAVORITES,
      data: { movieId },
    })
  }

  public async removeFavorite(movieId: number): Promise<void> {
    await this.execute<void, unknown>({
      method: 'DELETE',
      url: apiRoutes.accountFavorite(movieId),
    })
  }

  public async watched(
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    search?: string,
  ): Promise<Paginated<MovieLite>> {
    const res = await this.execute<void, Paginated<MovieLite>>({
      method: 'GET',
      url: apiRoutes.ACCOUNT_WATCHED,
      params: listParams(page, perPage, search),
    })
    return res.data
  }

  /** Idempotente. Mesma convenção dos favoritos. */
  public async addWatched(movieId: number): Promise<void> {
    await this.execute<{ movieId: number }, unknown>({
      method: 'POST',
      url: apiRoutes.ACCOUNT_WATCHED,
      data: { movieId },
    })
  }

  public async removeWatched(movieId: number): Promise<void> {
    await this.execute<void, unknown>({
      method: 'DELETE',
      url: apiRoutes.accountWatched(movieId),
    })
  }

  public async myReviews(
    page = 1,
    perPage = DEFAULT_PER_PAGE,
  ): Promise<Paginated<Review>> {
    const res = await this.execute<void, Paginated<Review>>({
      method: 'GET',
      url: apiRoutes.ACCOUNT_REVIEWS,
      params: { page: String(page), perPage: String(perPage) },
    })
    return normalizePaginatedReviews(res.data)
  }
}

export const accountService = new AccountService(httpAdapter)
