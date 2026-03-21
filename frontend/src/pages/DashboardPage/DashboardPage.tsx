import { useEffect } from 'react'
import styles from './DashboardPage.module.css'
import { useDashboardData } from '../../hooks/useDashboardData'

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
    isAuthenticated,
    selectedBike,
    filteredBikes,
    metrics,
    handleLogin,
    handleLoadVehicles,
    handleLoadMockVehicles,
    handleUpdateOdometer,
    handleGoToPreviousPage,
    handleGoToNextPage,
    handleClearSession,
    clearFeedback,
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
          <a className={styles.navItem} href="/">
            Landing
          </a>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h2 className={styles.title}>Dashboard de Frota (MVP)</h2>
          <p className={styles.subtitle}>
            Integrado com a API Rastrosystem para veiculos e hodometro.
          </p>
        </header>

        <section className={styles.authPanel}>
          <h3 className={styles.panelTitle}>Conexao com API</h3>
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
            <button
              className={styles.buttonSecondary}
              type="button"
              onClick={handleLoadVehicles}
              disabled={loading || !isAuthenticated}
            >
              Buscar veiculos
            </button>
            <button className={styles.buttonSecondary} type="button" onClick={handleLoadMockVehicles}>
              Usar modo demo
            </button>
            <button
              className={styles.buttonDanger}
              type="button"
              onClick={handleClearSession}
              disabled={loading && !isAuthenticated}
            >
              Limpar sessao
            </button>
          </div>
          <p className={styles.tokenInfo}>
            {isAuthenticated ? 'Token salvo e pronto para uso.' : 'Sem token autenticado.'}
          </p>
        </section>

        {view === 'resumo' ? (
          <section>
            {metrics.total === 0 && !loading ? (
              <article className={styles.emptyGuide}>
                <h3 className={styles.panelTitle}>Comece pelo modo demo</h3>
                <p className={styles.emptyState}>
                  Voce ainda nao tem motos carregadas no painel. Use o modo demo
                  para validar o fluxo enquanto as credenciais da API nao chegam.
                </p>
                <button className={styles.button} type="button" onClick={handleLoadMockVehicles}>
                  Carregar dados demo
                </button>
              </article>
            ) : null}

            <section className={styles.metrics}>
              <article className={styles.metricCard}>
                <span className={styles.metricLabel}>Total de motos</span>
                {loading ? <span className={styles.skeletonValue} /> : <strong className={styles.metricValue}>{metrics.total}</strong>}
              </article>
              <article className={styles.metricCard}>
                <span className={styles.metricLabel}>Alugadas</span>
                {loading ? <span className={styles.skeletonValue} /> : <strong className={styles.metricValue}>{metrics.alugadas}</strong>}
              </article>
              <article className={styles.metricCard}>
                <span className={styles.metricLabel}>Disponiveis</span>
                {loading ? <span className={styles.skeletonValue} /> : <strong className={styles.metricValue}>{metrics.disponiveis}</strong>}
              </article>
              <article className={styles.metricCard}>
                <span className={styles.metricLabel}>Manutencao</span>
                {loading ? <span className={styles.skeletonValue} /> : <strong className={styles.metricValue}>{metrics.manutencao}</strong>}
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

