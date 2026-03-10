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
              <h2 className={styles.sectionTitle}>Como funciona</h2>
              <p className={styles.sectionSubtitle}>
                Um fluxo curto e transparente, do cadastro à moto com você.
              </p>
            </header>

            <div className={styles.steps}>
              <article className={styles.stepCard}>
                <h3 className={styles.stepTitle}>1. Cadastro</h3>
                <p className={styles.stepText}>
                  Informe seus dados e escolha o plano que faz sentido para o
                  seu momento.
                </p>
              </article>
              <article className={styles.stepCard}>
                <h3 className={styles.stepTitle}>2. Análise</h3>
                <p className={styles.stepText}>
                  Validamos informações e retornamos com a aprovação e próximos
                  passos.
                </p>
              </article>
              <article className={styles.stepCard}>
                <h3 className={styles.stepTitle}>3. Assinatura</h3>
                <p className={styles.stepText}>
                  Contrato digital, sem burocracia. Tudo na palma da mão.
                </p>
              </article>
              <article className={styles.stepCard}>
                <h3 className={styles.stepTitle}>4. Retirada</h3>
                <p className={styles.stepText}>
                  Agende e retire sua moto. Pronto: agora é só rodar.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="planos" className={styles.sectionAlt}>
          <div className={styles.container}>
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Planos</h2>
              <p className={styles.sectionSubtitle}>
                Valores e detalhes finais serão conectados ao backend. Por ora,
                deixamos o layout pronto para receber os dados.
              </p>
            </header>

            <div className={styles.pricingGrid}>
              <article className={styles.priceCard}>
                <h3 className={styles.priceTitle}>Essencial</h3>
                <p className={styles.priceValue}>R$ —</p>
                <ul className={styles.priceList}>
                  <li>Plano de entrada</li>
                  <li>Manutenção inclusa</li>
                  <li>Suporte via WhatsApp</li>
                </ul>
                <a className={styles.ctaPrimary} href="#cadastro">
                  Quero esse
                </a>
              </article>

              <article className={styles.priceCardFeatured}>
                <p className={styles.priceTag}>Mais escolhido</p>
                <h3 className={styles.priceTitle}>Pro</h3>
                <p className={styles.priceValue}>R$ —</p>
                <ul className={styles.priceList}>
                  <li>Melhor custo-benefício</li>
                  <li>Manutenção e revisões</li>
                  <li>Prioridade no atendimento</li>
                </ul>
                <a className={styles.ctaPrimary} href="#cadastro">
                  Alugar agora
                </a>
              </article>

              <article className={styles.priceCard}>
                <h3 className={styles.priceTitle}>Flex</h3>
                <p className={styles.priceValue}>R$ —</p>
                <ul className={styles.priceList}>
                  <li>Flexibilidade total</li>
                  <li>Troca facilitada</li>
                  <li>Ideal para alta demanda</li>
                </ul>
                <a className={styles.ctaPrimary} href="#cadastro">
                  Quero esse
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

