import { icons } from '@/assets/icons'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <a className={styles.icon} href="#" aria-label="Facebook">
          <img src={icons.facebook} alt="" />
        </a>
        <a className={styles.icon} href="#" aria-label="X">
          <img src={icons.x} alt="" />
        </a>
        <a className={styles.icon} href="#" aria-label="Instagram">
          <img src={icons.instagram} alt="" />
        </a>
      </div>
    </footer>
  )
}
