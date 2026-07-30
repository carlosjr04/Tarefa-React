import styles from './Avatar.module.css'

interface AvatarProps {
  avatarUrl?: string | null
  initials?: string
  name?: string | null
  size?: number
}

export function Avatar({ avatarUrl, initials, name, size = 36 }: AvatarProps) {
  const label = name ?? 'Usuário'
  const text = (initials || name?.slice(0, 2) || '?').toUpperCase()
  return (
    <span
      className={styles.avatar}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-label={label}
    >
      {avatarUrl ? (
        <img className={styles.img} src={avatarUrl} alt={label} />
      ) : (
        text
      )}
    </span>
  )
}
