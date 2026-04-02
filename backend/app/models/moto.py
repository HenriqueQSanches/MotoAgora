from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Moto(Base):
    __tablename__ = "motos"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    cliente_id: Mapped[int] = mapped_column(ForeignKey("clientes.id", ondelete="CASCADE"))
    placa: Mapped[str] = mapped_column(String(16))
    modelo: Mapped[str] = mapped_column(String(120))
    odometro_atual: Mapped[int] = mapped_column(Integer, default=0)
    km_proxima_troca_oleo: Mapped[int | None] = mapped_column(Integer)
    endereco_pernoite: Mapped[str | None] = mapped_column(String(500))
    status: Mapped[str] = mapped_column(String(20), default="disponivel")
    rastro_veiculo_id: Mapped[int | None] = mapped_column(Integer)

    cliente: Mapped["Cliente"] = relationship("Cliente", back_populates="motos")
    manutencoes: Mapped[list["Manutencao"]] = relationship(
        "Manutencao",
        back_populates="moto",
        cascade="all, delete-orphan",
    )
