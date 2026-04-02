import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '../../api/client'
import type { ClienteCreate, MotoCreate, MotoDTO } from '../../types/api'
import styles from './GestaoPanel.module.css'

type ClienteDTO = { id: number; nome: string; telefone: string | null; cpf: string | null }

export function GestaoPanel() {
  const qc = useQueryClient()
  const [nomeCliente, setNomeCliente] = useState('')
  const [telCliente, setTelCliente] = useState('')
  const [clienteIdMoto, setClienteIdMoto] = useState('')
  const [placa, setPlaca] = useState('')
  const [modelo, setModelo] = useState('')
  const [km, setKm] = useState('0')
  const [kmOleo, setKmOleo] = useState('')
  const [pernoite, setPernoite] = useState('')
  const [rastroId, setRastroId] = useState('')

  const clientesQ = useQuery({
    queryKey: ['clientes'],
    queryFn: async () => (await api.get<ClienteDTO[]>('/api/v1/clientes')).data,
  })

  const motosQ = useQuery({
    queryKey: ['motos'],
    queryFn: async () => (await api.get<MotoDTO[]>('/api/v1/motos')).data,
  })

  const criarCliente = useMutation({
    mutationFn: async (body: ClienteCreate) =>
      (await api.post<ClienteDTO>('/api/v1/clientes', body)).data,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['clientes'] }),
  })

  const criarMoto = useMutation({
    mutationFn: async (body: MotoCreate) =>
      (await api.post<MotoDTO>('/api/v1/motos', body)).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['motos'] })
      void qc.invalidateQueries({ queryKey: ['dashboard-resumo'] })
    },
  })

  return (
    <div>
      <section className={styles.panel}>
        <h3 className={styles.title}>Clientes</h3>
        <div className={styles.row}>
          <input
            className={styles.input}
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
            placeholder="Nome"
          />
          <input
            className={styles.input}
            value={telCliente}
            onChange={(e) => setTelCliente(e.target.value)}
            placeholder="Telefone"
          />
          <button
            className={styles.button}
            type="button"
            disabled={!nomeCliente.trim() || criarCliente.isPending}
            onClick={() => {
              void criarCliente.mutateAsync({
                nome: nomeCliente.trim(),
                telefone: telCliente.trim() || null,
              })
              setNomeCliente('')
              setTelCliente('')
            }}
          >
            Adicionar cliente
          </button>
        </div>
        {clientesQ.isLoading ? (
          <p className={styles.hint}>Carregando...</p>
        ) : (
          <ul className={styles.list}>
            {(clientesQ.data ?? []).map((c) => (
              <li key={c.id}>
                #{c.id} {c.nome}
                {c.telefone ? ` — ${c.telefone}` : ''}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.panel}>
        <h3 className={styles.title}>Motos</h3>
        <div className={styles.grid}>
          <div className={styles.row}>
            <input
              className={styles.input}
              value={clienteIdMoto}
              onChange={(e) => setClienteIdMoto(e.target.value)}
              placeholder="ID do cliente"
            />
            <input
              className={styles.input}
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              placeholder="Placa"
            />
            <input
              className={styles.input}
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              placeholder="Modelo"
            />
            <input
              className={styles.input}
              value={km}
              onChange={(e) => setKm(e.target.value)}
              placeholder="Odometro"
              type="number"
            />
            <input
              className={styles.input}
              value={kmOleo}
              onChange={(e) => setKmOleo(e.target.value)}
              placeholder="KM prox. oleo (opcional)"
              type="number"
            />
            <input
              className={styles.input}
              value={pernoite}
              onChange={(e) => setPernoite(e.target.value)}
              placeholder="Endereco pernoite"
            />
            <input
              className={styles.input}
              value={rastroId}
              onChange={(e) => setRastroId(e.target.value)}
              placeholder="ID veiculo Rastro (opcional)"
              type="number"
            />
          </div>
          <button
            className={styles.button}
            type="button"
            disabled={
              !clienteIdMoto.trim() ||
              !placa.trim() ||
              !modelo.trim() ||
              criarMoto.isPending
            }
            onClick={() => {
              const cid = Number(clienteIdMoto)
              if (!Number.isFinite(cid)) return
              const body: MotoCreate = {
                cliente_id: cid,
                placa: placa.trim().toUpperCase(),
                modelo: modelo.trim(),
                odometro_atual: Number(km) || 0,
                km_proxima_troca_oleo: kmOleo.trim() ? Number(kmOleo) : null,
                endereco_pernoite: pernoite.trim() || null,
                status: 'disponivel',
                rastro_veiculo_id: rastroId.trim() ? Number(rastroId) : null,
              }
              void criarMoto.mutateAsync(body)
              setPlaca('')
              setModelo('')
              setKm('0')
              setKmOleo('')
              setPernoite('')
              setRastroId('')
            }}
          >
            Cadastrar moto
          </button>
        </div>
        {motosQ.isLoading ? (
          <p className={styles.hint}>Carregando...</p>
        ) : (
          <ul className={styles.list}>
            {(motosQ.data ?? []).map((m) => (
              <li key={m.id}>
                #{m.id} {m.modelo} ({m.placa}) — {m.odometro_atual} km
                {m.rastro_veiculo_id != null ? ` — Rastro #${m.rastro_veiculo_id}` : ''}
              </li>
            ))}
          </ul>
        )}
        <p className={styles.hint}>
          Manutencoes e cobrancas: use a documentacao em /docs (Swagger /api/v1) ou expanda este painel.
        </p>
      </section>
    </div>
  )
}
