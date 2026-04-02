import { useEffect } from 'react'
import { GestaoPanel } from '../../components/GestaoPanel/GestaoPanel'
import { useDashboardData } from '../../hooks/useDashboardData'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const {
    selectedId,
    setSelectedId,
    view,
    setView,
    newOdometer,
    setNewOdometer,
    feedback,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    paginatedBikes,
    odometerHistory,
    loading,
    login,
    setLogin,
    senha,
    setSenha,
    rastroVeiculoTag,
    setRastroVeiculoTag,
    isRastroAuthenticated,
    selectedBike,
    filteredBikes,
    contractMetrics,
    dataMode,
    handleLogin,
    handleLoadVehicles,
    handleLoadMockVehicles,
    handleUseApiData,
    handleUpdateOdometer,
    handleGoToPreviousPage,
    handleGoToNextPage,
    handleClearSession,
    clearFeedback,
    apiError,
  } = useDashboardData()

  const isErrorFeedback = feedback.toLowerCase().includes('erro') || feedback.toLowerCase().includes('falha')

  useEffect(() => {
    if (!feedback) return
    const timer = window.setTimeout(() => clearFeedback(), 3500)
    return () => window.clearTimeout(timer)
  }, [feedback, clearFeedback])

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <h1 className={styles.brand}>MotoAgora</h1>
        <nav className={styles.nav}>
          <button
            className={view === 'resumo' ? styles.navItemActive : styles.navItem}
            type="button"
            onClick={() => setView('resumo')}
          >
            Resumo
          </button>
          <button
            className={view === 'motos' ? styles.navItemActive : styles.navItem}
            type="button"
            onClick={() => setView('motos')}
          >
            Motos
          </button>
          <button
            className={view === 'detalhe' ? styles.navItemActive : styles.navItem}
            type="button"
            onClick={() => setView('detalhe')}
          >
            Detalhe da moto
          </button>
          <button
            className={view === 'gestao' ? styles.navItemActive : styles.navItem}
            type="button"
            onClick={() => setView('gestao')}
          >
            Gestao (cadastro)
          </button>
          <a className={styles.navItem} href="/">
            Landing
          </a>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h2 className={styles.title}>Dashboard MotoAgora</h2>
          <p className={styles.subtitle}>
            Dados no PostgreSQL (FastAPI). Rastrosystem passa pelo servidor — sem expor credenciais no
            browser.
          </p>
        </header>

        {apiError ? <p className={styles.envHint}>{apiError}</p> : null}

        <section className={styles.authPanel}>
          <h3 className={styles.panelTitle}>Rastrosystem (via backend)</h3>
          <div className={styles.authGrid}>
            <input
              className={styles.input}
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              placeholder="Login"
            />
            <input
              className={styles.input}
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Senha"
            />
            <button className={styles.button} type="button" onClick={handleLogin} disabled={loading}>
              Entrar
            </button>
            <input
              className={styles.input}
              value={rastroVeiculoTag}
              onChange={(event) => setRastroVeiculoTag(event.target.value)}
              placeholder="Busca Rastro: placa, modelo..."
              title="Opcional. A API tambem recebe pessoa_id do seu login (cliente_id)."
            />
            <button
              className={styles.buttonSecondary}
              type="button"
              onClick={handleLoadVehicles}
              disabled={loading || !isRastroAuthenticated}
            >
              Buscar veiculos
            </button>
            <button className={styles.buttonSecondary} type="button" onClick={handleLoadMockVehicles}>
              Modo demo (sem API)
            </button>
            <button className={styles.buttonSecondary} type="button" onClick={handleUseApiData}>
              Voltar dados do servidor
            </button>
            <button
              className={styles.buttonDanger}
              type="button"
              onClick={handleClearSession}
              disabled={loading && !isRastroAuthenticated}
            >
              Limpar sessao Rastro
            </button>
          </div>
          <p className={styles.tokenInfo}>
            {dataMode === 'demo'
              ? 'Modo demo ativo — cadastros abaixo nao aparecem ate voltar ao servidor.'
              : isRastroAuthenticated
                ? 'Token Rastrosystem OK (sessao local).'
                : 'Sem token Rastrosystem.'}
          </p>
        </section>

        {view === 'resumo' ? (
          <section>
            {contractMetrics.total === 0 && !loading && dataMode === 'api' ? (
              <article className={styles.emptyGuide}>
                <h3 className={styles.panelTitle}>Nenhuma moto cadastrada</h3>
                <p className={styles.emptyState}>
                  Suba o Docker (Postgres), rode migracoes e cadastre clientes/motos em Gestao. Modo
                  demo continua disponivel para testar a interface.
                </p>
                <button className={styles.button} type="button" onClick={handleLoadMockVehicles}>
                  Carregar dados demo
                </button>
              </article>
            ) : null}

            <section className={styles.metrics}>
              <article className={styles.metricCard}>
                <span className={styles.metricLabel}>Total de motos</span>
                {loading ? (
                  <span className={styles.skeletonValue} />
                ) : (
                  <strong className={styles.metricValue}>{contractMetrics.total}</strong>
                )}
              </article>
              <article className={styles.metricCard}>
                <span className={styles.metricLabel}>Troca de oleo (KM)</span>
                {loading ? (
                  <span className={styles.skeletonValue} />
                ) : (
                  <strong className={styles.metricValue}>{contractMetrics.oleoPendente}</strong>
                )}
              </article>
              <article className={styles.metricCard}>
                <span className={styles.metricLabel}>Cobrancas atrasadas</span>
                {loading ? (
                  <span className={styles.skeletonValue} />
                ) : (
                  <strong className={styles.metricValue}>{contractMetrics.cobrancasAtrasadas}</strong>
                )}
              </article>
              <article className={styles.metricCard}>
                <span className={styles.metricLabel}>Com pernoite</span>
                {loading ? (
                  <span className={styles.skeletonValue} />
                ) : (
                  <strong className={styles.metricValue}>{contractMetrics.pernoite}</strong>
                )}
              </article>
            </section>

            <section className={styles.metrics}>
              <article className={styles.metricCard}>
                <span className={styles.metricLabel}>Alugadas</span>
                {loading ? (
                  <span className={styles.skeletonValue} />
                ) : (
                  <strong className={styles.metricValue}>{contractMetrics.alugadas}</strong>
                )}
              </article>
              <article className={styles.metricCard}>
                <span className={styles.metricLabel}>Disponiveis</span>
                {loading ? (
                  <span className={styles.skeletonValue} />
                ) : (
                  <strong className={styles.metricValue}>{contractMetrics.disponiveis}</strong>
                )}
              </article>
              <article className={styles.metricCard}>
                <span className={styles.metricLabel}>Em manutencao</span>
                {loading ? (
                  <span className={styles.skeletonValue} />
                ) : (
                  <strong className={styles.metricValue}>{contractMetrics.manutencao}</strong>
                )}
              </article>
            </section>
            <article className={styles.panel}>
              <h3 className={styles.panelTitle}>Ultimas atualizacoes de hodometro</h3>
              {odometerHistory.length === 0 ? (
                <p className={styles.emptyState}>Nenhuma atualizacao registrada ate agora.</p>
              ) : (
                <ul className={styles.historyList}>
                  {odometerHistory.slice(0, 8).map((item) => (
                    <li key={`${item.bikeId}-${item.at}`} className={styles.historyItem}>
                      <strong>{item.bikeId}</strong> de {item.previousKm.toLocaleString('pt-BR')} km para{' '}
                      {item.newKm.toLocaleString('pt-BR')} km ({item.at})
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </section>
        ) : null}

        {view === 'motos' ? (
          <section className={styles.panel}>
            <div className={styles.tableHeader}>
              <h3 className={styles.panelTitle}>Motos</h3>
              <input
                className={styles.input}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por modelo, placa ou ID"
              />
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Modelo</th>
                  <th>Placa</th>
                  <th>Status</th>
                  <th>Hodometro</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className={styles.loadingCell}>
                      Carregando dados...
                    </td>
                  </tr>
                ) : null}
                {!loading &&
                  paginatedBikes.map((bike) => (
                  <tr
                    key={bike.id}
                    onClick={() => {
                      setSelectedId(bike.id)
                      setView('detalhe')
                    }}
                    className={bike.id === selectedId ? styles.rowActive : ''}
                  >
                    <td>{bike.id}</td>
                    <td>{bike.modelo}</td>
                    <td>{bike.placa}</td>
                    <td>
                      <span
                        className={
                          bike.status === 'Alugada'
                            ? styles.statusAlugada
                            : bike.status === 'Manutencao'
                              ? styles.statusManutencao
                              : styles.statusDisponivel
                        }
                      >
                        {bike.status}
                      </span>
                    </td>
                    <td>{bike.hodometro.toLocaleString('pt-BR')} km</td>
                  </tr>
                  ))}
              </tbody>
            </table>
            {filteredBikes.length === 0 ? (
              <p className={styles.emptyState}>Nenhuma moto encontrada com esse filtro.</p>
            ) : null}
            {filteredBikes.length > 0 ? (
              <div className={styles.pagination}>
                <button
                  type="button"
                  className={styles.buttonSecondary}
                  onClick={handleGoToPreviousPage}
                  disabled={currentPage <= 1}
                >
                  Anterior
                </button>
                <span className={styles.pageInfo}>
                  Pagina {currentPage} de {totalPages}
                </span>
                <button
                  type="button"
                  className={styles.buttonSecondary}
                  onClick={handleGoToNextPage}
                  disabled={currentPage >= totalPages}
                >
                  Proxima
                </button>
              </div>
            ) : null}
          </section>
        ) : null}

        {view === 'gestao' ? (
          <section>
            <GestaoPanel />
          </section>
        ) : null}

        {view === 'detalhe' ? (
          <section className={styles.grid}>
            <article className={styles.panel}>
              <h3 className={styles.panelTitle}>Detalhe da moto</h3>
              {selectedBike ? (
                <div className={styles.form}>
                  <p className={styles.bikeInfo}>
                    <strong>{selectedBike.id}</strong> - {selectedBike.modelo}
                  </p>
                  <p className={styles.bikeInfo}>Placa: {selectedBike.placa}</p>
                  <p className={styles.bikeInfo}>Status: {selectedBike.status}</p>
                  <p className={styles.bikeInfo}>
                    Hodometro atual: {selectedBike.hodometro.toLocaleString('pt-BR')} km
                  </p>
                  <p className={styles.bikeInfo}>
                    Ultima atualizacao: {selectedBike.ultimaAtualizacao}
                  </p>
                </div>
              ) : (
                <p className={styles.emptyState}>Selecione uma moto na tela de Motos.</p>
              )}
            </article>

            <article className={styles.panel}>
              <h3 className={styles.panelTitle}>Atualizar hodometro</h3>
              {selectedBike ? (
                <div className={styles.form}>
                  <label className={styles.label} htmlFor="hodometro">
                    Novo hodometro
                  </label>
                  <input
                    id="hodometro"
                    className={styles.input}
                    type="number"
                    value={newOdometer}
                    onChange={(event) => setNewOdometer(event.target.value)}
                    placeholder="Ex: 14000"
                  />

                  <button
                    className={styles.button}
                    type="button"
                    onClick={handleUpdateOdometer}
                    disabled={loading}
                  >
                    Atualizar
                  </button>
                </div>
              ) : null}
              {feedback ? <p className={styles.feedback}>{feedback}</p> : null}
            </article>
          </section>
        ) : null}
      </main>
      {feedback ? (
        <div className={isErrorFeedback ? styles.toastError : styles.toastSuccess} role="status">
          {feedback}
        </div>
      ) : null}
    </div>
  )
}

