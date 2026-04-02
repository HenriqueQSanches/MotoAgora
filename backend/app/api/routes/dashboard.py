from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.cobranca import Cobranca
from app.models.moto import Moto
from app.schemas.common import DashboardResumo

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/resumo", response_model=DashboardResumo)
def resumo(db: Session = Depends(get_db)) -> DashboardResumo:
    total_motos = db.query(func.count(Moto.id)).scalar() or 0

    motos_oleo = (
        db.query(func.count(Moto.id))
        .filter(
            Moto.km_proxima_troca_oleo.isnot(None),
            Moto.odometro_atual >= Moto.km_proxima_troca_oleo,
        )
        .scalar()
        or 0
    )

    hoje = date.today()
    cobrancas_atrasadas = (
        db.query(func.count(Cobranca.id))
        .filter(
            or_(
                Cobranca.status == "atrasado",
                (Cobranca.status == "pendente") & (Cobranca.data_vencimento < hoje),
            )
        )
        .scalar()
        or 0
    )

    motos_pernoite = (
        db.query(func.count(Moto.id))
        .filter(
            Moto.endereco_pernoite.isnot(None),
            Moto.endereco_pernoite != "",
        )
        .scalar()
        or 0
    )

    return DashboardResumo(
        total_motos=int(total_motos),
        motos_troca_oleo_pendente=int(motos_oleo),
        cobrancas_atrasadas=int(cobrancas_atrasadas),
        motos_com_pernoite_cadastrada=int(motos_pernoite),
    )
