import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { accountService } from '@/lib/services/account.service'

export function useMyReviews(page = 1) {
  return useQuery({
    queryKey: ['myReviews', page],
    queryFn: () => accountService.myReviews(page),
    placeholderData: keepPreviousData,
  })
}
