import { useCallback, useMemo, useState } from 'react'
import { mockBikes } from '../services/dashboardMock'
import {
  loginRastro,
  searchVehicles,
  updateVehicle,
  type RastroVehicle,
} from '../services/rastrosystemApi'
import type { Bike, DashboardView, OdometerHistoryItem } from '../types/dashboard'

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

export function useDashboardData() {
  const pageSize = 6
  const [bikes, setBikes] = useState<Bike[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [view, setView] = useState<DashboardView>('resumo')
  const [newOdometer, setNewOdometer] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [odometerHistory, setOdometerHistory] = useState<OdometerHistoryItem[]>([])
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

  const filteredBikes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return bikes
    return bikes.filter(
      (bike) =>
        bike.id.toLowerCase().includes(term) ||
        bike.modelo.toLowerCase().includes(term) ||
        bike.placa.toLowerCase().includes(term),
    )
  }, [bikes, searchTerm])

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredBikes.length / pageSize)),
    [filteredBikes.length, pageSize],
  )

  const paginatedBikes = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredBikes.slice(start, start + pageSize)
  }, [filteredBikes, currentPage, pageSize])

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
      if (!response.token) throw new Error('Token nao retornado pela API.')
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
      setCurrentPage(1)
      setView('motos')
      setFeedback(`${mapped.length} veiculos carregados.`)
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Erro ao buscar veiculos.')
    } finally {
      setLoading(false)
    }
  }

  function handleLoadMockVehicles() {
    setBikes(mockBikes)
    setSelectedId(mockBikes[0].id)
    setCurrentPage(1)
    setView('motos')
    setFeedback('Modo demo carregado com sucesso.')
  }

  function handleSearchTermChange(value: string) {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  function handleGoToPreviousPage() {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  function handleGoToNextPage() {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  function handleClearSession() {
    localStorage.removeItem('rastrosystem_token')
    setToken('')
    setBikes([])
    setSelectedId('')
    setSearchTerm('')
    setCurrentPage(1)
    setOdometerHistory([])
    setView('resumo')
    setFeedback('Sessao limpa com sucesso.')
  }

  const clearFeedback = useCallback(() => {
    setFeedback('')
  }, [])

  async function handleUpdateOdometer() {
    if (!selectedBike) return
    const value = Number(newOdometer)
    if (!Number.isFinite(value) || value <= selectedBike.hodometro) {
      setFeedback('Novo hodometro precisa ser maior que o atual.')
      return
    }

    const applyLocalUpdate = () => {
      const now = new Date().toLocaleString('pt-BR')
      setBikes((prev) =>
        prev.map((bike) =>
          bike.id === selectedBike.id
            ? { ...bike, hodometro: value, ultimaAtualizacao: now }
            : bike,
        ),
      )
      setOdometerHistory((prev) => [
        {
          bikeId: selectedBike.id,
          previousKm: selectedBike.hodometro,
          newKm: value,
          at: now,
        },
        ...prev,
      ])
      setNewOdometer('')
      setFeedback(`Hodometro da moto ${selectedBike.id} atualizado com sucesso.`)
    }

    if (!isAuthenticated) {
      applyLocalUpdate()
      return
    }

    setLoading(true)
    setFeedback('')
    try {
      await updateVehicle(token, selectedBike.veiculoId, { km_total: value })
      applyLocalUpdate()
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Erro ao atualizar hodometro.')
    } finally {
      setLoading(false)
    }
  }

  return {
    bikes,
    selectedId,
    setSelectedId,
    view,
    setView,
    newOdometer,
    setNewOdometer,
    feedback,
    searchTerm,
    setSearchTerm: handleSearchTermChange,
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
  }
}
