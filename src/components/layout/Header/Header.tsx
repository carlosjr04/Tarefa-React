import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Avatar } from '@/components/ui/Avatar/Avatar'
import { icons } from '@/assets/icons'
import styles from './Header.module.css'

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [term, setTerm] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = term.trim()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
    navigate('/login')
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="Film{IN}hos — início">
          <img className={styles.logoImg} src={icons.logo} alt="Film{IN}hos" />
        </Link>

        <div className={styles.spacer} />

        <form className={styles.searchForm} onSubmit={onSearch} role="search">
          <input
            className={styles.searchInput}
            placeholder="Pesquisar..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            aria-label="Pesquisar filmes"
          />
          <button className={styles.searchBtn} type="submit" aria-label="Buscar">
            <img className={styles.searchIconImg} src={icons.search} alt="" />
          </button>
        </form>

        {isAuthenticated ? (
          <div className={styles.userWrap} ref={wrapRef}>
            <button
              className={styles.userBtn}
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Menu do usuário"
            >
              {user?.avatarUrl ? (
                <Avatar avatarUrl={user.avatarUrl} initials={user.initials} size={30} />
              ) : (
                <img className={styles.accountImg} src={icons.account} alt="" />
              )}
            </button>

            {menuOpen && (
              <div className={styles.menu} role="menu">
                {user && (
                  <>
                    <Link
                      to={`/users/${user.id}`}
                      className={styles.menuItem}
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                    >
                      <img className={styles.menuIcon} src={icons.account} alt="" />
                      Meu perfil
                    </Link>
                    <div className={styles.divider} />
                  </>
                )}
                <Link
                  to="/favorites"
                  className={styles.menuItem}
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  <img className={styles.menuIcon} src={icons.heart} alt="" />
                  Favoritos
                </Link>
                <Link
                  to="/watched"
                  className={styles.menuItem}
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  <img className={styles.menuIcon} src={icons.watched} alt="" />
                  Assistidos
                </Link>
                <Link
                  to="/my-reviews"
                  className={styles.menuItem}
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  <img className={styles.menuIcon} src={icons.star} alt="" />
                  Avaliações
                </Link>
                <div className={styles.divider} />
                <button
                  className={`${styles.menuItem} ${styles.danger}`}
                  role="menuitem"
                  onClick={handleLogout}
                >
                  ⟶ Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className={styles.loginLink}>
            Entrar
          </Link>
        )}
      </div>
    </header>
  )
}
