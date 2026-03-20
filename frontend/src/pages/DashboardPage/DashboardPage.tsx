import { useMemo, useState } from 'react'
import styles from './DashboardPage.module.css'
import {
  loginRastro,
  searchVehicles,
  updateVehicle,
  type RastroVehicle,
} from '../../services/rastrosystemApi'

type Bike = {
  id: string
  veiculoId: number
  modelo: string
  placa: string
  status: 'Disponivel' | 'Alugada' | 'Manutencao'
  hodometro: number
  ultimaAtualizacao: string
}

function mapVehicleToBike(vehicle: RastroVehicle): Bike {
  const statusRaw = String(vehicle.status ?? '').toLowerCase()
  const status: Bike['status'] =
    statusRaw === 'true' || statusRaw === '1'
      ? 'Alugada'
      : statusRaw === 'manutencao' || statusRaw === 'maintenance'
        ? 'Manutencao'
        : 'Disponivel'

  const model = vehicle.name || vehicle.modelo || 'Modelo nao informado'
  const placa = vehicle.placa || '-'
  const veiculoId = Number(vehicle.veiculo_id ?? vehicle.id ?? 0)
  const fallbackId = vehicle.unique_id || `${model}-${placa}`
  const kmValue = Number(vehicle.km_total ?? 0)

  return {
    id: `MTA-${veiculoId || fallbackId}`,
    veiculoId,
    modelo: model,
    placa,
    status,
    hodometro: Number.isFinite(kmValue) ? kmValue : 0,
    ultimaAtualizacao: vehicle.time || new Date().toLocaleString('pt-BR'),
  }
}

export function DashboardPage() {
  const [bikes, setBikes] = useState<Bike[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [newOdometer, setNewOdometer] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const [login, setLogin] = useState<string>('')
  const [senha, setSenha] = useState<string>('')
  const [token, setToken] = useState<string>(
    () => localStorage.getItem('rastrosystem_token') ?? '',
  )

  const isAuthenticated = token.trim().length > 0

  const selectedBike = useMemo(
    () => bikes.find((bike) => bike.id === selectedId),
    [bikes, selectedId],
  )

  const metrics = useMemo(() => {
    const total = bikes.length
    const alugadas = bikes.filter((bike) => bike.status === 'Alugada').length
    const disponiveis = bikes.filter((bike) => bike.status === 'Disponivel').length
    const manutencao = bikes.filter((bike) => bike.status === 'Manutencao').length

    return { total, alugadas, disponiveis, manutencao }
  }, [bikes])

  async function handleLogin() {
    setFeedback('')
    setLoading(true)
    try {
      const response = await loginRastro({ login, senha, app: 9 })
      if (!response.token) {
        throw new Error('Token nao retornado pela API.')
      }
      localStorage.setItem('rastrosystem_token', response.token)
      setToken(response.token)
      setFeedback('Login realizado com sucesso.')
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Falha no login.')
    } finally {
      setLoading(false)
    }
  }

  async function handleLoadVehicles() {
    if (!isAuthenticated) return
    setLoading(true)
    setFeedback('')
    try {
      const vehicles = await searchVehicles(token, { tag_search: '' })
      const mapped = vehicles.map(mapVehicleToBike)
      setBikes(mapped)
      if (mapped[0]) setSelectedId(mapped[0].id)
      setFeedback(`${mapped.length} veiculos carregados.`)
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Erro ao buscar veiculos.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateOdometer() {
    if (!selectedBike) return

    const value = Number(newOdometer)
    if (!Number.isFinite(value) || value <= selectedBike.hodometro) {
      setFeedback('Novo hodometro precisa ser maior que o atual.')
      return
    }

    if (!isAuthenticated) {
      setFeedback('Faca login antes de atualizar o hodometro.')
      return
    }

    setLoading(true)
    setFeedback('')
    try {
      await updateVehicle(token, selectedBike.veiculoId, { km_total: value })
      setBikes((prev) =>
        prev.map((bike) =>
          bike.id === selectedBike.id
            ? {
                ...bike,
                hodometro: value,
                ultimaAtualizacao: new Date().toLocaleString('pt-BR'),
              }
            : bike,
        ),
      )
      setNewOdometer('')
      setFeedback(`Hodometro da moto ${selectedBike.id} atualizado com sucesso.`)
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Erro ao atualizar hodometro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <h1 className={styles.brand}>MotoAgora</h1>
        <nav className={styles.nav}>
          <a className={styles.navItemActive} href="/dashboard">
            Dashboard
          </a>
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
          </div>
          <p className={styles.tokenInfo}>
            {isAuthenticated ? 'Token salvo e pronto para uso.' : 'Sem token autenticado.'}
          </p>
        </section>

        <section className={styles.metrics}>
          <article className={styles.metricCard}>
            <span className={styles.metricLabel}>Total de motos</span>
            <strong className={styles.metricValue}>{metrics.total}</strong>
          </article>
          <article className={styles.metricCard}>
            <span className={styles.metricLabel}>Alugadas</span>
            <strong className={styles.metricValue}>{metrics.alugadas}</strong>
          </article>
          <article className={styles.metricCard}>
            <span className={styles.metricLabel}>Disponiveis</span>
            <strong className={styles.metricValue}>{metrics.disponiveis}</strong>
          </article>
          <article className={styles.metricCard}>
            <span className={styles.metricLabel}>Manutencao</span>
            <strong className={styles.metricValue}>{metrics.manutencao}</strong>
          </article>
        </section>

        <section className={styles.grid}>
          <article className={styles.panel}>
            <h3 className={styles.panelTitle}>Motos</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Modelo</th>
                  <th>Status</th>
                  <th>Hodometro</th>
                </tr>
              </thead>
              <tbody>
                {bikes.map((bike) => (
                  <tr
                    key={bike.id}
                    onClick={() => setSelectedId(bike.id)}
                    className={bike.id === selectedId ? styles.rowActive : ''}
                  >
                    <td>{bike.id}</td>
                    <td>{bike.modelo}</td>
                    <td>{bike.status}</td>
                    <td>{bike.hodometro.toLocaleString('pt-BR')} km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article className={styles.panel}>
            <h3 className={styles.panelTitle}>Atualizar hodometro</h3>

            {selectedBike ? (
              <div className={styles.form}>
                <p className={styles.bikeInfo}>
                  <strong>{selectedBike.id}</strong> - {selectedBike.modelo}
                </p>
                <p className={styles.bikeInfo}>Placa: {selectedBike.placa}</p>
                <p className={styles.bikeInfo}>
                  Atual: {selectedBike.hodometro.toLocaleString('pt-BR')} km
                </p>
                <p className={styles.bikeInfo}>
                  Ultima atualizacao: {selectedBike.ultimaAtualizacao}
                </p>

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

                {feedback ? <p className={styles.feedback}>{feedback}</p> : null}
              </div>
            ) : null}
          </article>
        </section>
      </main>
    </div>
  )
}

