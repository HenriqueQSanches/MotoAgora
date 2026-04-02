export type LoginPayload = {
  login: string
  senha: string
  app: number
}

export type SearchVehiclePayload = {
  tag_search?: string
  pessoa_id?: string
}

export type RastroVehicle = {
  id?: number
  veiculo_id?: number
  name?: string
  modelo?: string
  placa?: string
  unique_id?: string
  status?: string | boolean | number
  km_total?: number | string
  time?: string
}

export type ApiObject = Record<string, unknown>
