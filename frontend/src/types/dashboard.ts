export type BikeStatus = 'Disponivel' | 'Alugada' | 'Manutencao'

export type Bike = {
  id: string
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

export type DashboardView = 'resumo' | 'motos' | 'detalhe'
