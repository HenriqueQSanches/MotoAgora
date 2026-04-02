from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.manutencao import Manutencao
from app.models.moto import Moto
from app.schemas.common import ManutencaoCreate, ManutencaoRead

router = APIRouter(prefix="/manutencoes", tags=["manutencoes"])


@router.get("", response_model=list[ManutencaoRead])
def listar(moto_id: int | None = None, db: Session = Depends(get_db)) -> list[Manutencao]:
    q = db.query(Manutencao)
    if moto_id is not None:
        q = q.filter(Manutencao.moto_id == moto_id)
    return list(q.order_by(Manutencao.id.desc()).all())


@router.post("", response_model=ManutencaoRead, status_code=status.HTTP_201_CREATED)
def criar(body: ManutencaoCreate, db: Session = Depends(get_db)) -> Manutencao:
    if not db.get(Moto, body.moto_id):
        raise HTTPException(status_code=400, detail="moto_id invalido")
    row = Manutencao(**body.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.get("/{manutencao_id}", response_model=ManutencaoRead)
def obter(manutencao_id: int, db: Session = Depends(get_db)) -> Manutencao:
    row = db.get(Manutencao, manutencao_id)
    if not row:
        raise HTTPException(status_code=404, detail="Manutencao nao encontrada")
    return row


@router.delete("/{manutencao_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover(manutencao_id: int, db: Session = Depends(get_db)) -> None:
    row = db.get(Manutencao, manutencao_id)
    if not row:
        raise HTTPException(status_code=404, detail="Manutencao nao encontrada")
    db.delete(row)
    db.commit()
