from __future__ import annotations

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Cliente(Base):
    __tablename__ = "clientes"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nome: Mapped[str] = mapped_column(String(200))
    telefone: Mapped[str | None] = mapped_column(String(40))
    cpf: Mapped[str | None] = mapped_column(String(20))
    endereco: Mapped[str | None] = mapped_column(String(500))

    motos: Mapped[list["Moto"]] = relationship(
        "Moto",
        back_populates="cliente",
        cascade="all, delete-orphan",
    )
    cobrancas: Mapped[list["Cobranca"]] = relationship(
        "Cobranca",
        back_populates="cliente",
        cascade="all, delete-orphan",
    )
