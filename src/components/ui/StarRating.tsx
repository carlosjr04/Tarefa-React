import { useState } from 'react'
import styles from './StarRating.module.css'

interface StarRatingProps {
  /** Modo display: valor médio (0..5, com meias). */
  value: number
  /** Se presente, ativa o modo interativo. */
  onChange?: (value: number) => void
  size?: number
  showValue?: boolean
  readOnly?: boolean
}

const STAR = '★'

function Star({ fillPercent, size }: { fillPercent: number; size: number }) {
  return (
    <span className={styles.star} style={{ fontSize: size }} aria-hidden="true">
      {STAR}
      <span className={styles.fill} style={{ width: `${fillPercent * 100}%` }}>
        {STAR}
      </span>
    </span>
  )
}

export function StarRating({
  value,
  onChange,
  size = 20,
  showValue = false,
  readOnly = false,
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null)
  const interactive = Boolean(onChange) && !readOnly
  const shown = hover ?? value

  if (!interactive) {
    return (
      <span className={styles.wrap} role="img" aria-label={`${value} de 5 estrelas`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, shown - i))
          return <Star key={i} fillPercent={fill} size={size} />
        })}
        {showValue && <span className={styles.value}>{value.toFixed(1)}</span>}
      </span>
    )
  }

  const setValue = (star: number, half: boolean) => onChange?.(half ? star - 0.5 : star)

  return (
    <span
      className={styles.wrap}
      role="slider"
      aria-label="Selecione a nota"
      aria-valuemin={0.5}
      aria-valuemax={5}
      aria-valuenow={value}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault()
          onChange?.(Math.min(5, (value || 0) + 0.5))
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault()
          onChange?.(Math.max(0.5, (value || 0.5) - 0.5))
        }
      }}
      onMouseLeave={() => setHover(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.max(0, Math.min(1, shown - (star - 1)))
        return (
          <span
            key={star}
            className={styles.star}
            style={{ fontSize: size, position: 'relative' }}
          >
            <Star fillPercent={fill} size={size} />
            <button
              type="button"
              className={`${styles.interactive} ${styles.half} ${styles.halfLeft}`}
              aria-label={`${star - 0.5} estrelas`}
              onMouseEnter={() => setHover(star - 0.5)}
              onClick={() => setValue(star, true)}
            />
            <button
              type="button"
              className={`${styles.interactive} ${styles.half} ${styles.halfRight}`}
              aria-label={`${star} estrelas`}
              onMouseEnter={() => setHover(star)}
              onClick={() => setValue(star, false)}
            />
          </span>
        )
      })}
      {showValue && <span className={styles.value}>{(value || 0).toFixed(1)}</span>}
    </span>
  )
}
