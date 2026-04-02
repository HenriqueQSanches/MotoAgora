from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class ClienteCreate(BaseModel):
    nome: str
    telefone: str | None = None
    cpf: str | None = None
    endereco: str | None = None


class ClienteRead(ClienteCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int


class ClienteUpdate(BaseModel):
    nome: str | None = None
    telefone: str | None = None
    cpf: str | None = None
    endereco: str | None = None


class MotoCreate(BaseModel):
    cliente_id: int
    placa: str
    modelo: str
    odometro_atual: int = 0
    km_proxima_troca_oleo: int | None = None
    endereco_pernoite: str | None = None
    status: str = "disponivel"
    rastro_veiculo_id: int | None = None


class MotoRead(MotoCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int


class MotoUpdate(BaseModel):
    placa: str | None = None
    modelo: str | None = None
    odometro_atual: int | None = None
    km_proxima_troca_oleo: int | None = None
    endereco_pernoite: str | None = None
    status: str | None = None
    rastro_veiculo_id: int | None = None


class MotoOdometerPatch(BaseModel):
    novo_odometro: int
    sync_rastro: bool = True
    rastro_token: str | None = None


class ManutencaoCreate(BaseModel):
    moto_id: int
    tipo: str
    descricao: str | None = None
    custo: Decimal | None = None
    km_realizada: int


class ManutencaoRead(ManutencaoCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int


class CobrancaCreate(BaseModel):
    cliente_id: int
    valor: Decimal
    data_vencimento: date
    boleto_url: str | None = None
    status: str = "pendente"


class CobrancaRead(CobrancaCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int


class CobrancaUpdate(BaseModel):
    valor: Decimal | None = None
    data_vencimento: date | None = None
    boleto_url: str | None = None
    status: str | None = None


class DashboardResumo(BaseModel):
    total_motos: int
    motos_troca_oleo_pendente: int
    cobrancas_atrasadas: int
    motos_com_pernoite_cadastrada: int


class RastroLoginBody(BaseModel):
    login: str
    senha: str


class RastroVeiculosBody(BaseModel):
    tag_search: str = ""
    pessoa_id: str | None = None
    #: ID do usuario retornado no login (ex. 2010). Se a busca com pessoa_id=cliente_id vier vazia,
    #: o backend tenta de novo com pessoa_id = login_user_id (frota associada ao usuario no painel).
    login_user_id: int | None = None


class RastroKmBody(BaseModel):
    km_total: int
