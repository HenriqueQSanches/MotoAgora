from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import (
    clientes,
    cobrancas,
    dashboard,
    health,
    manutencoes,
    motos,
    rastro,
)
from app.core.config import get_settings

settings = get_settings()
app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(clientes.router, prefix="/api/v1")
app.include_router(motos.router, prefix="/api/v1")
app.include_router(manutencoes.router, prefix="/api/v1")
app.include_router(cobrancas.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(rastro.router, prefix="/api/v1")


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "motoagora-api", "docs": "/docs"}
