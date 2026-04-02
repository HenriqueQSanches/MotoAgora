import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import { mockBikes } from '../services/dashboardMock'
import type { DashboardResumo, MotoDTO } from '../types/api'
import type { Bike, DashboardView, OdometerHistoryItem } from '../types/dashboard'

const LS_RASTRO_CLIENTE = 'rastrosystem_cliente_id'
const LS_RASTRO_USER = 'rastrosystem_user_id'

type RastroLoginResponse = {
  token: string
  cliente_id?: number
  id?: number
}

function mapDtoToBike(m: MotoDTO): Bike {
  const st = m.status.toLowerCase()
  const status: Bike['status'] =
    st === 'alugada' ? 'Alugada' : st === 'manutencao' ? 'Manutencao' : 'Disponivel'
  return {
    id: `MTA-${m.id}`,
    dbId: m.id,
    veiculoId: m.rastro_veiculo_id ?? m.id,
    modelo: m.modelo,
    placa: m.placa,
    status,
    hodometro: m.odometro_atual,
    ultimaAtualizacao: new Date().toLocaleString('pt-BR'),
  }
}

export function useDashboardData() {
  const pageSize = 6
  const queryClient = useQueryClient()
  const [dataMode, setDataMode] = useState<'api' | 'demo'>('api')
  const [selectedId, setSelectedId] = useState<string>('')
  const [view, setView] = useState<DashboardView>('resumo')
  const [newOdometer, setNewOdometer] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [odometerHistory, setOdometerHistory] = useState<OdometerHistoryItem[]>([])
  const [login, setLogin] = useState<string>('')
  const [senha, setSenha] = useState<string>('')
  const [rastroVeiculoTag, setRastroVeiculoTag] = useState<string>('')
  const [rastroToken, setRastroToken] = useState<string>(
    () => localStorage.getItem('rastrosystem_token') ?? '',
  )

  const resumoQuery = useQuery({
    queryKey: ['dashboard-resumo'],
    queryFn: async () => (await api.get<DashboardResumo>('/api/v1/dashboard/resumo')).data,
    enabled: dataMode === 'api',
    retry: 1,
  })

  const motosQuery = useQuery({
    queryKey: ['motos'],
    queryFn: async () => (await api.get<MotoDTO[]>('/api/v1/motos')).data,
    enabled: dataMode === 'api',
    retry: 1,
  })

  const rastroLoginMut = useMutation({
    mutationFn: async () =>
      (await api.post<RastroLoginResponse>('/api/v1/rastro/login', { login, senha })).data,
    onSuccess: (data) => {
      if (!data.token) throw new Error('Token nao retornado')
      localStorage.setItem('rastrosystem_token', data.token)
      if (data.cliente_id != null) {
        localStorage.setItem(LS_RASTRO_CLIENTE, String(data.cliente_id))
      }
      if (data.id != null) {
        localStorage.setItem(LS_RASTRO_USER, String(data.id))
      }
      setRastroToken(data.token)
      setFeedback(
        'Login Rastrosystem OK. Buscar veiculos usa cliente_id e, se vier vazio, o id do usuario (frota associada no painel).',
      )
    },
    onError: (e: Error) => setFeedback(e.message),
  })

  const rastroBuscarMut = useMutation({
    mutationFn: async (token: string) => {
      const pessoaId = localStorage.getItem(LS_RASTRO_CLIENTE)
      const loginUserId = localStorage.getItem(LS_RASTRO_USER)
      const tag = rastroVeiculoTag.trim()
      const loginUserIdNum =
        loginUserId != null && loginUserId !== '' ? Number(loginUserId) : undefined
      return (
        await api.post<{ data: unknown[] }>(
          '/api/v1/rastro/veiculos/buscar',
          {
            tag_search: tag,
            ...(pessoaId ? { pessoa_id: pessoaId } : {}),
            ...(loginUserIdNum != null && Number.isFinite(loginUserIdNum)
              ? { login_user_id: loginUserIdNum }
              : {}),
          },
          { headers: { 'X-Rastro-Token': token } },
        )
      ).data
    },
    onSuccess: (data) => {
      const n = Array.isArray(data.data) ? data.data.length : 0
      const hasScope = Boolean(localStorage.getItem(LS_RASTRO_CLIENTE))
      if (n === 0) {
        setFeedback(
          hasScope
            ? 'Nenhum veiculo retornado. Tente um termo em "Busca placa/modelo" ou confira no painel Rastrosystem se ha veiculos neste cliente.'
            : 'Lista vazia e sem cliente_id salvo. Faca login de novo (a resposta precisa incluir cliente_id) ou informe busca por placa/modelo.',
        )
        return
      }
      setFeedback(
        `${n} veiculo(s) na Rastrosystem. Em Gestao, cadastre moto com rastro_veiculo_id = veiculo_id da lista.`,
      )
    },
    onError: (e: Error) => setFeedback(e.message),
  })

  const patchOdometer = useMutation({
    mutationFn: async (vars: { dbId: number; novo: number; token: string | null }) =>
      (
        await api.patch<MotoDTO>(`/api/v1/motos/${vars.dbId}/odometro`, {
          novo_odometro: vars.novo,
          sync_rastro: Boolean(vars.token),
          rastro_token: vars.token ?? undefined,
        })
      ).data,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['motos'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard-resumo'] })
    },
    onError: (e: Error) => setFeedback(e.message),
  })

  const loading =
    dataMode === 'api' && (resumoQuery.isFetching || motosQuery.isFetching || patchOdometer.isPending)

  const bikes = useMemo(() => {
    if (dataMode === 'demo') {
      return mockBikes
    }
    return (motosQuery.data ?? []).map(mapDtoToBike)
  }, [dataMode, motosQuery.data])

  const contractMetrics = useMemo(() => {
    const r = resumoQuery.data
    const alugadas = bikes.filter((b) => b.status === 'Alugada').length
    const disponiveis = bikes.filter((b) => b.status === 'Disponivel').length
    const manutencao = bikes.filter((b) => b.status === 'Manutencao').length

    if (r && dataMode === 'api') {
      return {
        total: r.total_motos,
        oleoPendente: r.motos_troca_oleo_pendente,
        cobrancasAtrasadas: r.cobrancas_atrasadas,
        pernoite: r.motos_com_pernoite_cadastrada,
        alugadas,
        disponiveis,
        manutencao,
      }
    }

    return {
      total: bikes.length,
      oleoPendente: manutencao,
      cobrancasAtrasadas: 0,
      pernoite: 0,
      alugadas,
      disponiveis,
      manutencao,
    }
  }, [resumoQuery.data, dataMode, bikes])

  useEffect(() => {
    if (bikes.length === 0) return
    const ok = bikes.some((b) => b.id === selectedId)
    if (!ok) setSelectedId(bikes[0]!.id)
  }, [bikes, selectedId])

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

  const isRastroAuthenticated = rastroToken.trim().length > 0

  function handleLogin() {
    setFeedback('')
    rastroLoginMut.mutate()
  }

  function handleLoadVehicles() {
    if (!isRastroAuthenticated) return
    setFeedback('')
    rastroBuscarMut.mutate(rastroToken)
  }

  function handleLoadMockVehicles() {
    setDataMode('demo')
    setSelectedId(mockBikes[0]?.id ?? '')
    setCurrentPage(1)
    setView('motos')
    setFeedback('Modo demo (somente front). Dados nao vao para o servidor.')
  }

  function handleUseApiData() {
    setDataMode('api')
    void queryClient.invalidateQueries()
    setCurrentPage(1)
    setFeedback('Carregando dados do servidor MotoAgora...')
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
    localStorage.removeItem(LS_RASTRO_CLIENTE)
    localStorage.removeItem(LS_RASTRO_USER)
    setRastroToken('')
    setSelectedId('')
    setSearchTerm('')
    setCurrentPage(1)
    setOdometerHistory([])
    setView('resumo')
    setFeedback('Sessao Rastrosystem limpa.')
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
      setFeedback(`Hodometro da moto ${selectedBike.id} atualizado.`)
    }

    if (dataMode === 'demo' || selectedBike.dbId == null) {
      setFeedback('')
      applyLocalUpdate()
      return
    }

    setFeedback('')
    try {
      await patchOdometer.mutateAsync({
        dbId: selectedBike.dbId,
        novo: value,
        token: rastroToken.trim() || null,
      })
      applyLocalUpdate()
    } catch {
      /* feedback via mutation */
    }
  }

  const apiError =
    dataMode === 'api' && (resumoQuery.isError || motosQuery.isError)
      ? 'Nao foi possivel falar com a API. Suba Postgres/Redis (Docker) e o backend: uvicorn app.main:app --reload'
      : null

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
    rastroVeiculoTag,
    setRastroVeiculoTag,
    isAuthenticated: isRastroAuthenticated,
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
    refetchMotos: () => motosQuery.refetch(),
  }
}
