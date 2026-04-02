export type BikeStatus = 'Disponivel' | 'Alugada' | 'Manutencao'

export type Bike = {
  id: string
  /** ID da moto no PostgreSQL (API MotoAgora). Ausente no modo demo local. */
  dbId?: number
  veiculoId: number
  modelo: string
  placa: string
  status: BikeStatus
  hodometro: number
  ultimaAtualizacao: string
}

export type OdometerHistoryItem = {
  bikeId: string
  previousKm: number
  newKm: number
  at: string
}

export type DashboardView = 'resumo' | 'motos' | 'detalhe' | 'gestao'
