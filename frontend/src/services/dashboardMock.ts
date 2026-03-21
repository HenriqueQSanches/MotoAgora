import type { Bike } from '../types/dashboard'

export const mockBikes: Bike[] = [
  {
    id: 'MTA-101',
    veiculoId: 101,
    modelo: 'Factor DX 2025',
    placa: 'QWE1A23',
    status: 'Alugada',
    hodometro: 13200,
    ultimaAtualizacao: '20/03/2026 14:01',
  },
  {
    id: 'MTA-102',
    veiculoId: 102,
    modelo: 'Fan 160 2026',
    placa: 'RTY4B56',
    status: 'Disponivel',
    hodometro: 9280,
    ultimaAtualizacao: '20/03/2026 11:21',
  },
  {
    id: 'MTA-103',
    veiculoId: 103,
    modelo: 'Fazer 250',
    placa: 'UIO7C89',
    status: 'Manutencao',
    hodometro: 21040,
    ultimaAtualizacao: '19/03/2026 17:42',
  },
]
