import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { HomePage } from '@/pages/Home/HomePage'
import { MovieDetailPage } from '@/pages/MovieDetail/MovieDetailPage'
import { SearchPage } from '@/pages/Search/SearchPage'
import { FavoritesPage } from '@/pages/Collection/FavoritesPage'
import { WatchedPage } from '@/pages/Collection/WatchedPage'
import { MyReviewsPage } from '@/pages/MyReview/MyReviewsPage'
import { UserProfilePage } from '@/pages/UserProfile/UserProfilePage'
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/users/:id" element={<UserProfilePage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/watched" element={<WatchedPage />} />
          <Route path="/my-reviews" element={<MyReviewsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
