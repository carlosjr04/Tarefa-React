import { useState, type ReactNode } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, FreeMode, Keyboard, Mousewheel } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper'
import 'swiper/css'
import 'swiper/css/free-mode'
import styles from './Carousel.module.css'

interface CarouselProps<T> {
  items: T[]
  renderItem: (item: T) => ReactNode
  keyFor: (item: T) => string | number
}

/** Slides parciais nas pontas sinalizam que há mais conteúdo para o lado. */
const BREAKPOINTS = {
  0: { slidesPerView: 2.2, spaceBetween: 10 },
  480: { slidesPerView: 3.2, spaceBetween: 12 },
  700: { slidesPerView: 4.3, spaceBetween: 14 },
  900: { slidesPerView: 5.3, spaceBetween: 14 },
  1100: { slidesPerView: 5.5, spaceBetween: 16 },
}

export function Carousel<T>({ items, renderItem, keyFor }: CarouselProps<T>) {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  const syncEdges = (instance: SwiperClass) => {
    setIsBeginning(instance.isBeginning)
    setIsEnd(instance.isEnd)
  }

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={`${styles.arrow} ${styles.left}`}
        onClick={() => swiper?.slidePrev()}
        disabled={isBeginning}
        aria-label="Anterior"
      >
        ‹
      </button>

      <Swiper
        modules={[FreeMode, Keyboard, Mousewheel, A11y]}
        breakpoints={BREAKPOINTS}
        freeMode={{ enabled: true, momentumBounce: false }}
        keyboard={{ enabled: true }}
        mousewheel={{ forceToAxis: true }}
        watchSlidesProgress
        className={styles.swiper}
        onSwiper={(instance) => {
          setSwiper(instance)
          syncEdges(instance)
        }}
        onSlideChange={syncEdges}
        onResize={syncEdges}
        onReachBeginning={() => setIsBeginning(true)}
        onReachEnd={() => setIsEnd(true)}
        onFromEdge={syncEdges}
      >
        {items.map((item) => (
          <SwiperSlide key={keyFor(item)} className={styles.slide}>
            {renderItem(item)}
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        className={`${styles.arrow} ${styles.right}`}
        onClick={() => swiper?.slideNext()}
        disabled={isEnd}
        aria-label="Próximo"
      >
        ›
      </button>
    </div>
  )
}
