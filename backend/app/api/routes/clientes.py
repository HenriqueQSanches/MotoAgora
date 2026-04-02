from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.cliente import Cliente
from app.schemas.common import ClienteCreate, ClienteRead, ClienteUpdate

router = APIRouter(prefix="/clientes", tags=["clientes"])


@router.get("", response_model=list[ClienteRead])
def listar(db: Session = Depends(get_db)) -> list[Cliente]:
    return list(db.query(Cliente).order_by(Cliente.nome).all())


@router.post("", response_model=ClienteRead, status_code=status.HTTP_201_CREATED)
def criar(body: ClienteCreate, db: Session = Depends(get_db)) -> Cliente:
    c = Cliente(**body.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@router.get("/{cliente_id}", response_model=ClienteRead)
def obter(cliente_id: int, db: Session = Depends(get_db)) -> Cliente:
    c = db.get(Cliente, cliente_id)
    if not c:
        raise HTTPException(status_code=404, detail="Cliente nao encontrado")
    return c


@router.patch("/{cliente_id}", response_model=ClienteRead)
def atualizar(cliente_id: int, body: ClienteUpdate, db: Session = Depends(get_db)) -> Cliente:
    c = db.get(Cliente, cliente_id)
    if not c:
        raise HTTPException(status_code=404, detail="Cliente nao encontrado")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(c, k, v)
    db.commit()
    db.refresh(c)
    return c


@router.delete("/{cliente_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover(cliente_id: int, db: Session = Depends(get_db)) -> None:
    c = db.get(Cliente, cliente_id)
    if not c:
        raise HTTPException(status_code=404, detail="Cliente nao encontrado")
    db.delete(c)
    db.commit()
