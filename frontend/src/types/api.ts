export type DashboardResumo = {
  total_motos: number
  motos_troca_oleo_pendente: number
  cobrancas_atrasadas: number
  motos_com_pernoite_cadastrada: number
}

export type MotoDTO = {
  id: number
  cliente_id: number
  placa: string
  modelo: string
  odometro_atual: number
  km_proxima_troca_oleo: number | null
  endereco_pernoite: string | null
  status: string
  rastro_veiculo_id: number | null
}

export type ClienteCreate = {
  nome: string
  telefone?: string | null
  cpf?: string | null
  endereco?: string | null
}

export type MotoCreate = {
  cliente_id: number
  placa: string
  modelo: string
  odometro_atual?: number
  km_proxima_troca_oleo?: number | null
  endereco_pernoite?: string | null
  status?: string
  rastro_veiculo_id?: number | null
}
