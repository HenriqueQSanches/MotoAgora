import styles from './SiteFooter.module.css'

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.brandName}>MotoAgora</span>
          <span className={styles.brandSub}>Você de moto nova.</span>
        </div>

        <div className={styles.links} id="portal">
          <a className={styles.link} href="#conteudo">
            Voltar ao topo
          </a>
          <a className={styles.link} href="#cadastro">
            Cadastro
          </a>
          <a className={styles.link} href="#contato">
            Contato
          </a>
        </div>

        <p className={styles.copy}>
          © {new Date().getFullYear()} MotoAgora. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}

