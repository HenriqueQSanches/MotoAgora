import styles from './HomePage.module.css'
import { SiteHeader } from '../../components/SiteHeader/SiteHeader'
import { SiteFooter } from '../../components/SiteFooter/SiteFooter'

export function HomePage() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#conteudo">
        Pular para o conteúdo
      </a>

      <SiteHeader />

      <main id="conteudo" className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <p className={styles.kicker}>Aluguel de moto</p>
                <h1 className={styles.heroTitle}>
                  Você de <span className={styles.accent}>moto nova</span>, com
                  assinatura simples.
                </h1>
                <p className={styles.heroSubtitle}>
                  Planos claros, suporte de verdade e um processo rápido do
                  cadastro à entrega.
                </p>

                <div className={styles.heroCtas}>
                  <a className={styles.ctaPrimary} href="#cadastro">
                    Alugar agora
                  </a>
                  <a className={styles.ctaSecondary} href="#como-funciona">
                    Como funciona
                  </a>
                </div>

                <div className={styles.trustRow} aria-label="Destaques">
                  <div className={styles.trustItem}>
                    <span className={styles.trustValue}>24–48h</span>
                    <span className={styles.trustLabel}>análise</span>
                  </div>
                  <div className={styles.trustItem}>
                    <span className={styles.trustValue}>Planos</span>
                    <span className={styles.trustLabel}>flexíveis</span>
                  </div>
                  <div className={styles.trustItem}>
                    <span className={styles.trustValue}>Suporte</span>
                    <span className={styles.trustLabel}>WhatsApp</span>
                  </div>
                </div>
              </div>

              <div className={styles.heroMedia} aria-hidden="true">
                <div className={styles.heroPhoto} />
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className={styles.section}>
          <div className={styles.container}>
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Como <span className={styles.sectionTitleHighlight}>Funciona</span>
              </h2>
              <p className={styles.sectionSubtitle}>
                Um fluxo curto e transparente, do cadastro à moto com você.
              </p>
            </header>

            <div className={styles.steps}>
              <article className={styles.stepCard}>
                <h3 className={styles.stepTitle}>Escolha o plano</h3>
                <p className={styles.stepText}>
                  Selecione o plano que melhor se adapta ao seu perfil e
                  necessidade.
                </p>
              </article>
              <article className={styles.stepCard}>
                <h3 className={styles.stepTitle}>Cadastre-se online</h3>
                <p className={styles.stepText}>
                  Preencha seus dados de forma rápida e segura pelo site. Nossa
                  equipe entra em contato só para confirmar os detalhes.
                </p>
              </article>
              <article className={styles.stepCard}>
                <h3 className={styles.stepTitle}>Retire sua moto</h3>
                <p className={styles.stepText}>
                  Agendamos a sua visita e cuidamos de cada detalhe para você
                  sair pilotando com tranquilidade.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="planos" className={styles.sectionAlt}>
          <div className={styles.container}>
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Nossos <span className={styles.sectionTitleHighlight}>Planos</span>
              </h2>
              <p className={styles.sectionSubtitle}>
                Escolha o plano ideal para realizar seu sonho.
              </p>
            </header>

            <div className={styles.pricingGrid}>
              <article className={styles.priceCard}>
                <div className={styles.priceImageWrapper}>
                  <img
                    className={styles.priceImage}
                    src="/assets/plans/plan-conect-2025.jpg"
                    alt="Moto do plano Conect 2025"
                  />
                </div>
                <h3 className={styles.priceTitle}>Plano Conect 2025</h3>
                <p className={styles.priceSubtitle}>Modelo Factor</p>
                <p className={styles.priceValue}>R$399</p>
                <p className={styles.priceMeta}>/semana</p>
                <p className={styles.priceDeposit}>Caução de R$899</p>
                <ul className={styles.priceList}>
                  <li>APP de Rastreo</li>
                  <li>Guincho 24h</li>
                  <li>Reposição de peças por desgaste</li>
                  <li>Sem limite de quilometragem</li>
                  <li>A moto será sua no final do contrato</li>
                </ul>
                <a className={styles.ctaPrimary} href="#cadastro">
                  Quero Minha Moto Agora!
                </a>
              </article>

              <article className={styles.priceCardFeatured}>
                <p className={styles.priceTag}>Mais escolhido</p>
                <div className={styles.priceImageWrapper}>
                  <img
                    className={styles.priceImage}
                    src="/assets/plans/plan-conect-2026.jpg"
                    alt="Moto do plano Conect 2026"
                  />
                </div>
                <h3 className={styles.priceTitle}>Plano Conect 2026</h3>
                <p className={styles.priceHighlight}>
                  FAN 2026 OU FACTOR DX (ZERO KM)
                </p>
                <p className={styles.priceValue}>R$435</p>
                <p className={styles.priceMeta}>/semana</p>
                <p className={styles.priceDeposit}>
                  Caução de R$999 — Parcelado em 12x no cartão
                </p>
                <ul className={styles.priceList}>
                  <li>APP de Rastreo</li>
                  <li>Guincho 24h</li>
                  <li>Reposição de peças por desgaste</li>
                  <li>Sem limite de quilometragem</li>
                  <li>A moto será sua no final do contrato</li>
                </ul>
                <a className={styles.ctaPrimary} href="#cadastro">
                  Quero Minha Moto Agora!
                </a>
              </article>

              <article className={styles.priceCard}>
                <div className={styles.priceImageWrapper}>
                  <img
                    className={styles.priceImage}
                    src="/assets/plans/plan-flex.jpg"
                    alt="Moto do plano Flex"
                  />
                </div>
                <h3 className={styles.priceTitle}>Plano Flex</h3>
                <p className={styles.priceValue}>R$279</p>
                <p className={styles.priceMeta}>/semana</p>
                <p className={styles.priceDeposit}>Caução de R$599</p>
                <ul className={styles.priceList}>
                  <li>Guincho 24h</li>
                  <li>Reposição de peças por desgaste</li>
                  <li>Sem limite de quilometragem</li>
                </ul>
                <a className={styles.ctaPrimary} href="#cadastro">
                  Quero Minha Moto Agora!
                </a>
              </article>
            </div>
          </div>
        </section>

        <section id="beneficios" className={styles.section}>
          <div className={styles.container}>
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Benefícios</h2>
              <p className={styles.sectionSubtitle}>
                Foco no que importa: previsibilidade e tranquilidade.
              </p>
            </header>

            <div className={styles.benefitsGrid}>
              <article className={styles.benefitCard}>
                <h3 className={styles.benefitTitle}>Previsibilidade</h3>
                <p className={styles.benefitText}>
                  Você sabe quanto paga e o que está incluído, sem surpresas.
                </p>
              </article>
              <article className={styles.benefitCard}>
                <h3 className={styles.benefitTitle}>Processo simples</h3>
                <p className={styles.benefitText}>
                  Do cadastro ao contrato digital, tudo com poucas etapas.
                </p>
              </article>
              <article className={styles.benefitCard}>
                <h3 className={styles.benefitTitle}>Suporte</h3>
                <p className={styles.benefitText}>
                  Atendimento objetivo para resolver rápido quando precisar.
                </p>
              </article>
              <article className={styles.benefitCard}>
                <h3 className={styles.benefitTitle}>Moto pronta pra rodar</h3>
                <p className={styles.benefitText}>
                  Revisões e manutenção pensadas para manter você na rua.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="faq" className={styles.sectionAlt}>
          <div className={styles.container}>
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>FAQ</h2>
              <p className={styles.sectionSubtitle}>
                Dúvidas comuns sobre assinatura e processo.
              </p>
            </header>

            <div className={styles.faq}>
              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  Quais documentos eu preciso?
                </summary>
                <p className={styles.faqText}>
                  Vamos listar os documentos conforme as regras do backend.
                  Normalmente: RG/CPF, CNH e comprovantes.
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  Em quanto tempo sai a análise?
                </summary>
                <p className={styles.faqText}>
                  Em geral, 24–48h úteis. Podemos ajustar isso conforme o fluxo
                  final.
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  Posso trocar de plano depois?
                </summary>
                <p className={styles.faqText}>
                  Depende do contrato. A estrutura do site já está pronta para
                  exibir essas regras com clareza.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section id="contato" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.contactCard}>
              <div>
                <h2 className={styles.sectionTitle}>Contato</h2>
                <p className={styles.sectionSubtitle}>
                  Quer tirar dúvidas agora? Chama no WhatsApp ou envie uma
                  mensagem.
                </p>
              </div>
              <div className={styles.contactActions}>
                <a className={styles.ctaPrimary} href="#cadastro">
                  Fazer cadastro
                </a>
                <a className={styles.ctaSecondary} href="#">
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="cadastro" className={styles.sectionAlt}>
          <div className={styles.container}>
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Cadastro</h2>
              <p className={styles.sectionSubtitle}>
                Nesta fase, deixamos o bloco pronto. Depois conectamos com o
                formulário e a API.
              </p>
            </header>

            <div className={styles.formGrid} role="form" aria-label="Cadastro">
              <label className={styles.field}>
                <span>Nome</span>
                <input className={styles.input} placeholder="Seu nome" />
              </label>
              <label className={styles.field}>
                <span>WhatsApp</span>
                <input className={styles.input} placeholder="(00) 00000-0000" />
              </label>
              <label className={styles.fieldFull}>
                <span>Cidade</span>
                <input className={styles.input} placeholder="Sua cidade" />
              </label>
              <div className={styles.formActions}>
                <button className={styles.buttonPrimary} type="button">
                  Enviar
                </button>
                <p className={styles.formHint}>
                  Ao enviar, você concorda com os termos (placeholder).
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

