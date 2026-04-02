from typing import Any

from fastapi import APIRouter, Header, HTTPException

from app.schemas.common import RastroKmBody, RastroLoginBody, RastroVeiculosBody
from app.services import rastrosystem

router = APIRouter(prefix="/rastro", tags=["rastro"])


@router.post("/login")
async def rastro_login(body: RastroLoginBody) -> dict:
    try:
        return await rastrosystem.login(body.login, body.senha)
    except rastrosystem.RastrosystemError as e:
        # Credencial/API Rastrosystem: costuma vir 401/403 no status da API externa
        if e.status_code in (401, 403):
            raise HTTPException(status_code=401, detail=str(e))
        # Rede, 5xx externo, resposta inesperada
        raise HTTPException(status_code=502, detail=str(e))


@router.get("/pessoas")
async def rastro_list_pessoas(
    page: int = 0,
    limit: int = 50,
    x_rastro_token: str | None = Header(default=None, alias="X-Rastro-Token"),
    authorization: str | None = Header(default=None),
) -> Any:
    """Lista pessoas (clientes) no Rastrosystem — util para conferir IDs se buscar veiculos vier vazio."""

    token = _extract_token(x_rastro_token, authorization)
    try:
        return await rastrosystem.list_pessoas(token, page=page, limit=limit)
    except rastrosystem.RastrosystemError as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.post("/veiculos/buscar")
async def rastro_buscar(
    body: RastroVeiculosBody,
    x_rastro_token: str | None = Header(default=None, alias="X-Rastro-Token"),
    authorization: str | None = Header(default=None),
) -> dict:
    token = _extract_token(x_rastro_token, authorization)
    try:
        items = await rastrosystem.buscar_veiculos(
            token,
            tag_search=body.tag_search,
            pessoa_id=body.pessoa_id,
        )
        uid = body.login_user_id
        if (
            not items
            and uid is not None
            and (body.pessoa_id is None or str(body.pessoa_id).strip() != str(uid))
        ):
            items = await rastrosystem.buscar_veiculos(
                token,
                tag_search=body.tag_search,
                pessoa_id=str(uid),
            )
        if not items:
            items = await rastrosystem.buscar_veiculos(
                token,
                tag_search=body.tag_search,
                pessoa_id=None,
            )
        return {"data": items}
    except rastrosystem.RastrosystemError as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.post("/veiculos/{veiculo_id}/km")
async def rastro_km(
    veiculo_id: int,
    body: RastroKmBody,
    x_rastro_token: str | None = Header(default=None, alias="X-Rastro-Token"),
    authorization: str | None = Header(default=None),
) -> dict:
    token = _extract_token(x_rastro_token, authorization)
    try:
        return await rastrosystem.atualizar_km(token, veiculo_id, body.km_total)
    except rastrosystem.RastrosystemError as e:
        raise HTTPException(status_code=502, detail=str(e))


def _extract_token(x_rastro: str | None, authorization: str | None) -> str:
    if x_rastro and x_rastro.strip():
        return x_rastro.strip()
    if authorization and authorization.lower().startswith("token "):
        return authorization[6:].strip()
    if authorization and authorization.lower().startswith("bearer "):
        return authorization[7:].strip()
    raise HTTPException(status_code=401, detail="Token Rastrosystem ausente (header X-Rastro-Token ou Authorization)")
