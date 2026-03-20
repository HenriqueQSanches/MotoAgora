import styles from './SiteHeader.module.css'

const nav = [
  { label: 'Home', href: '#conteudo' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Planos', href: '#planos' },
  { label: 'Benefícios', href: '#beneficios' },
  { label: 'Cadastro', href: '#cadastro' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contato', href: '#contato' },
  { label: 'Portal do Cliente', href: '/dashboard' },
]

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a className={styles.brand} href="#conteudo" aria-label="MotoAgora">
          <img
            className={styles.logo}
            src="/assets/brand/logo.png"
            alt="MotoAgora"
          />
        </a>

        <nav className={styles.nav} aria-label="Navegação principal">
          {nav.map((item) => (
            <a key={item.href} className={styles.navLink} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <a className={styles.cta} href="#cadastro">
            Alugar Agora
          </a>
        </div>
      </div>
    </header>
  )
}

