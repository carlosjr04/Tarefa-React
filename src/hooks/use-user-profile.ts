import { useQuery } from '@tanstack/react-query'
import { userService } from '@/lib/services/user.service'

export function useUserProfile(id: number) {
  return useQuery({
    queryKey: ['user', id, 'profile'],
    queryFn: () => userService.profile(id),
    enabled: Number.isFinite(id) && id > 0,
  })
}

export function useUserFavorites(id: number) {
  return useQuery({
    queryKey: ['user', id, 'favorites'],
    queryFn: () => userService.favorites(id, 1, 20),
    enabled: Number.isFinite(id) && id > 0,
  })
}

export function useUserWatched(id: number) {
  return useQuery({
    queryKey: ['user', id, 'watched'],
    queryFn: () => userService.watched(id, 1, 20),
    enabled: Number.isFinite(id) && id > 0,
  })
}

export function useUserReviews(id: number, page = 1) {
  return useQuery({
    queryKey: ['user', id, 'reviews', page],
    queryFn: () => userService.reviews(id, page),
    enabled: Number.isFinite(id) && id > 0,
  })
}
