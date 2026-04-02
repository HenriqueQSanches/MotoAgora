import { mockBikes } from './dashboardMock'
import type { RastroVehicle } from './rastroTypes'

/** Shape returned by /api_v2/veiculos/buscar/ for local mock parity. */
export function getMockRastroVehicles(): RastroVehicle[] {
  return mockBikes.map((bike) => ({
    veiculo_id: bike.veiculoId,
    id: bike.veiculoId,
    name: bike.modelo,
    modelo: bike.modelo,
    placa: bike.placa,
    status:
      bike.status === 'Alugada' ? '1' : bike.status === 'Manutencao' ? 'manutencao' : '0',
    km_total: bike.hodometro,
    time: bike.ultimaAtualizacao,
  }))
}

export const MOCK_RASTRO_TOKEN = 'mock-rastrosystem-token'
