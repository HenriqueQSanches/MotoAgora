from __future__ import annotations

from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Manutencao(Base):
    __tablename__ = "manutencoes"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    moto_id: Mapped[int] = mapped_column(ForeignKey("motos.id", ondelete="CASCADE"))
    tipo: Mapped[str] = mapped_column(String(80))
    descricao: Mapped[str | None] = mapped_column(Text)
    custo: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    km_realizada: Mapped[int] = mapped_column(Integer)

    moto: Mapped["Moto"] = relationship("Moto", back_populates="manutencoes")
