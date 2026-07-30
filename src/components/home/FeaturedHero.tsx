import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Autoplay, EffectFade, Keyboard, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import type { MovieLite } from '@/lib/types/movie.types'
import styles from './FeaturedHero.module.css'

interface FeaturedHeroProps {
  movies: MovieLite[]
}

export function FeaturedHero({ movies }: FeaturedHeroProps) {
  if (movies.length === 0) return null

  return (
    <div className={styles.wrap}>
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Keyboard, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={movies.length > 1}
        autoplay={
          movies.length > 1
            ? { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }
            : false
        }
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
        className={styles.swiper}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <Link to={`/movies/${movie.id}`} className={styles.slide}>
              {movie.posterImageUrl ? (
                <img
                  className={styles.image}
                  src={movie.posterImageUrl}
                  alt={movie.title}
                />
              ) : (
                <div className={styles.fallback}>{movie.title}</div>
              )}
              <div className={styles.overlay} />
              <div className={styles.caption}>
                <span className={styles.title}>{movie.title}</span>
                {movie.genres.length > 0 && (
                  <span className={styles.genres}>
                    {movie.genres.map((g) => g.name).join(' · ')}
                  </span>
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
