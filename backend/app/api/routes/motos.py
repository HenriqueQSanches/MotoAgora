from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.cliente import Cliente
from app.models.moto import Moto
from app.schemas.common import MotoCreate, MotoOdometerPatch, MotoRead, MotoUpdate
from app.services import rastrosystem
from app.services.notifications import alerta_troca_oleo_whatsapp

router = APIRouter(prefix="/motos", tags=["motos"])


@router.get("", response_model=list[MotoRead])
def listar(db: Session = Depends(get_db)) -> list[Moto]:
    return list(db.query(Moto).order_by(Moto.id).all())


@router.post("", response_model=MotoRead, status_code=status.HTTP_201_CREATED)
def criar(body: MotoCreate, db: Session = Depends(get_db)) -> Moto:
    if not db.get(Cliente, body.cliente_id):
        raise HTTPException(status_code=400, detail="cliente_id invalido")
    m = Moto(**body.model_dump())
    db.add(m)
    db.commit()
    db.refresh(m)
    return m


@router.get("/{moto_id}", response_model=MotoRead)
def obter(moto_id: int, db: Session = Depends(get_db)) -> Moto:
    m = db.get(Moto, moto_id)
    if not m:
        raise HTTPException(status_code=404, detail="Moto nao encontrada")
    return m


@router.patch("/{moto_id}", response_model=MotoRead)
def atualizar(moto_id: int, body: MotoUpdate, db: Session = Depends(get_db)) -> Moto:
    m = db.get(Moto, moto_id)
    if not m:
        raise HTTPException(status_code=404, detail="Moto nao encontrada")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(m, k, v)
    db.commit()
    db.refresh(m)
    return m


@router.patch("/{moto_id}/odometro", response_model=MotoRead)
async def atualizar_odometro(
    moto_id: int,
    body: MotoOdometerPatch,
    db: Session = Depends(get_db),
) -> Moto:
    m = db.get(Moto, moto_id)
    if not m:
        raise HTTPException(status_code=404, detail="Moto nao encontrada")
    if body.novo_odometro <= m.odometro_atual:
        raise HTTPException(
            status_code=400,
            detail="Novo odometro deve ser maior que o atual",
        )

    if body.sync_rastro and m.rastro_veiculo_id and body.rastro_token:
        try:
            await rastrosystem.atualizar_km(
                body.rastro_token.strip(),
                m.rastro_veiculo_id,
                body.novo_odometro,
            )
        except rastrosystem.RastrosystemError as e:
            raise HTTPException(status_code=502, detail=str(e))

    anterior = m.odometro_atual
    m.odometro_atual = body.novo_odometro
    db.commit()
    db.refresh(m)

    limite = m.km_proxima_troca_oleo
    if limite is not None and body.novo_odometro >= limite and anterior < limite:
        cliente = db.get(Cliente, m.cliente_id)
        alerta_troca_oleo_whatsapp(
            moto_id=m.id,
            placa=m.placa,
            modelo=m.modelo,
            km=body.novo_odometro,
            telefone=cliente.telefone if cliente else None,
        )

    return m


@router.delete("/{moto_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover(moto_id: int, db: Session = Depends(get_db)) -> None:
    m = db.get(Moto, moto_id)
    if not m:
        raise HTTPException(status_code=404, detail="Moto nao encontrada")
    db.delete(m)
    db.commit()
