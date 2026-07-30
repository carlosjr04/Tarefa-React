interface SpinnerProps {
  size?: number
  center?: boolean
}

export function Spinner({ size = 28, center = true }: SpinnerProps) {
  const svg = (
    <svg
      className="spin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Carregando"
    >
      <circle cx="12" cy="12" r="9" stroke="var(--color-border)" strokeWidth="3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="var(--color-primary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )

  if (!center) return svg
  return <div className="center-block">{svg}</div>
}
