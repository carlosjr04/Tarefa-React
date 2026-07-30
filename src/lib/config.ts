export const DEFAULT_PER_PAGE = 12

export const RATING_VALUES = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const

/** Rotas da API centralizadas. Segmentos dinâmicos são funções. */
export const apiRoutes = {
  // auth
  SIGNUP: '/auth/signup',
  LOGIN: '/auth/login',
  LOGOUT: '/account/logout',
  PROFILE: '/account/profile',

  // movies
  MOVIES: '/movies',
  MOVIES_FEATURED: '/movies/featured',
  movieDetail: (id: number) => `/movies/${id}`,

  // genres
  GENRES: '/genres',

  // reviews
  REVIEWS: '/reviews',
  REVIEWS_RANDOM: '/reviews/random',
  review: (id: number) => `/reviews/${id}`,

  // account
  ACCOUNT_FAVORITES: '/account/favorites',
  accountFavorite: (movieId: number) => `/account/favorites/${movieId}`,
  ACCOUNT_WATCHED: '/account/watched',
  accountWatched: (movieId: number) => `/account/watched/${movieId}`,
  ACCOUNT_REVIEWS: '/account/reviews',

  // users
  user: (id: number) => `/users/${id}`,
  userFavorites: (id: number) => `/users/${id}/favorites`,
  userWatched: (id: number) => `/users/${id}/watched`,
  userReviews: (id: number) => `/users/${id}/reviews`,
} as const
