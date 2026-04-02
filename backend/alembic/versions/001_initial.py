"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-04-02

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "clientes",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("nome", sa.String(length=200), nullable=False),
        sa.Column("telefone", sa.String(length=40), nullable=True),
        sa.Column("cpf", sa.String(length=20), nullable=True),
        sa.Column("endereco", sa.String(length=500), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "motos",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("cliente_id", sa.Integer(), nullable=False),
        sa.Column("placa", sa.String(length=16), nullable=False),
        sa.Column("modelo", sa.String(length=120), nullable=False),
        sa.Column("odometro_atual", sa.Integer(), nullable=False),
        sa.Column("km_proxima_troca_oleo", sa.Integer(), nullable=True),
        sa.Column("endereco_pernoite", sa.String(length=500), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("rastro_veiculo_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["cliente_id"], ["clientes.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "manutencoes",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("moto_id", sa.Integer(), nullable=False),
        sa.Column("tipo", sa.String(length=80), nullable=False),
        sa.Column("descricao", sa.Text(), nullable=True),
        sa.Column("custo", sa.Numeric(precision=12, scale=2), nullable=True),
        sa.Column("km_realizada", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["moto_id"], ["motos.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "cobrancas",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("cliente_id", sa.Integer(), nullable=False),
        sa.Column("valor", sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column("data_vencimento", sa.Date(), nullable=False),
        sa.Column("boleto_url", sa.String(length=500), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.ForeignKeyConstraint(["cliente_id"], ["clientes.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("cobrancas")
    op.drop_table("manutencoes")
    op.drop_table("motos")
    op.drop_table("clientes")
