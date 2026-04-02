from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.cliente import Cliente
from app.models.cobranca import Cobranca
from app.schemas.common import CobrancaCreate, CobrancaRead, CobrancaUpdate
from app.services.financeiro_ext import sincronizar_cobranca_sglock
from app.services.notifications import lembrete_cobranca_whatsapp

router = APIRouter(prefix="/cobrancas", tags=["cobrancas"])


@router.get("", response_model=list[CobrancaRead])
def listar(cliente_id: int | None = None, db: Session = Depends(get_db)) -> list[Cobranca]:
    q = db.query(Cobranca)
    if cliente_id is not None:
        q = q.filter(Cobranca.cliente_id == cliente_id)
    return list(q.order_by(Cobranca.data_vencimento).all())


@router.post("", response_model=CobrancaRead, status_code=status.HTTP_201_CREATED)
def criar(body: CobrancaCreate, db: Session = Depends(get_db)) -> Cobranca:
    if not db.get(Cliente, body.cliente_id):
        raise HTTPException(status_code=400, detail="cliente_id invalido")
    row = Cobranca(**body.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    sincronizar_cobranca_sglock(
        cobranca_id=row.id,
        valor=str(row.valor),
        vencimento=row.data_vencimento.isoformat(),
    )
    return row


@router.get("/{cobranca_id}", response_model=CobrancaRead)
def obter(cobranca_id: int, db: Session = Depends(get_db)) -> Cobranca:
    row = db.get(Cobranca, cobranca_id)
    if not row:
        raise HTTPException(status_code=404, detail="Cobranca nao encontrada")
    return row


@router.patch("/{cobranca_id}", response_model=CobrancaRead)
def atualizar(cobranca_id: int, body: CobrancaUpdate, db: Session = Depends(get_db)) -> Cobranca:
    row = db.get(Cobranca, cobranca_id)
    if not row:
        raise HTTPException(status_code=404, detail="Cobranca nao encontrada")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(row, k, v)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{cobranca_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover(cobranca_id: int, db: Session = Depends(get_db)) -> None:
    row = db.get(Cobranca, cobranca_id)
    if not row:
        raise HTTPException(status_code=404, detail="Cobranca nao encontrada")
    db.delete(row)
    db.commit()


@router.post("/jobs/lembretes-vencimento", status_code=status.HTTP_200_OK)
def job_lembretes_vencimento(
    dias: int = 1,
    db: Session = Depends(get_db),
) -> dict[str, int]:
    """Chamar via cron/agendador: lembretes de cobranca proxima do vencimento."""
    from datetime import timedelta

    hoje = date.today()
    alvo = hoje + timedelta(days=dias)
    pendentes = (
        db.query(Cobranca)
        .filter(
            Cobranca.status == "pendente",
            Cobranca.data_vencimento == alvo,
        )
        .all()
    )
    enviados = 0
    for c in pendentes:
        cliente = db.get(Cliente, c.cliente_id)
        lembrete_cobranca_whatsapp(
            cliente.telefone if cliente else None,
            f"Lembrete: cobranca #{c.id} vence em {dias} dia(s). Valor: R$ {c.valor}",
        )
        enviados += 1
    return {"lembretes_registrados": enviados}
