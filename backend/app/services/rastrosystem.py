from typing import Any

import httpx

from app.core.config import get_settings


class RastrosystemError(Exception):
    def __init__(self, message: str, status_code: int | None = None):
        super().__init__(message)
        self.status_code = status_code


def _base() -> str:
    return get_settings().rastro_api_base.rstrip("/")


async def login(login: str, senha: str) -> dict[str, Any]:
    payload = {"login": login, "senha": senha, "app": get_settings().rastro_app_id}
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.post(
                f"{_base()}/api_v2/login/",
                json=payload,
                headers={"Accept": "application/json", "Content-Type": "application/json"},
            )
    except httpx.RequestError as e:
        raise RastrosystemError(
            f"Sem conexao com Rastrosystem ({_base()}). Verifique internet, URL em RASTRO_API_BASE ou firewall. Detalhe: {e!s}",
            None,
        )
    data: Any = {}
    try:
        data = r.json()
    except Exception:
        data = {}
    if not r.is_success:
        msg = data.get("msg") if isinstance(data, dict) else None
        raise RastrosystemError(str(msg or f"HTTP {r.status_code}"), r.status_code)
    if not isinstance(data, dict) or "token" not in data:
        raise RastrosystemError("Resposta de login invalida", r.status_code)
    return data


async def list_pessoas(token: str, page: int = 0, limit: int = 50) -> Any:
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.get(
                f"{_base()}/api_v2/list-pessoas/",
                params={"page": page, "limit": limit},
                headers={
                    "Accept": "application/json",
                    "Authorization": f"token {token}",
                },
            )
    except httpx.RequestError as e:
        raise RastrosystemError(f"Falha de rede Rastrosystem: {e!s}", None)
    try:
        data = r.json()
    except Exception:
        data = {}
    if not r.is_success:
        msg = data.get("msg") if isinstance(data, dict) else None
        raise RastrosystemError(str(msg or f"HTTP {r.status_code}"), r.status_code)
    return data


async def buscar_veiculos(token: str, tag_search: str = "", pessoa_id: str | None = None) -> list[dict[str, Any]]:
    body: dict[str, Any] = {"tag_search": tag_search}
    if pessoa_id:
        body["pessoa_id"] = pessoa_id
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.post(
                f"{_base()}/api_v2/veiculos/buscar/",
                json=body,
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": f"token {token}",
                },
            )
    except httpx.RequestError as e:
        raise RastrosystemError(f"Falha de rede Rastrosystem: {e!s}", None)
    try:
        data = r.json()
    except Exception:
        data = {}
    if not r.is_success:
        msg = data.get("msg") if isinstance(data, dict) else None
        raise RastrosystemError(str(msg or f"HTTP {r.status_code}"), r.status_code)
    raw = data.get("data", data) if isinstance(data, dict) else data
    if isinstance(raw, str):
        import json

        try:
            raw = json.loads(raw)
        except Exception:
            raw = []
    if not isinstance(raw, list):
        return []
    return [x for x in raw if isinstance(x, dict)]


async def atualizar_km(token: str, veiculo_id: int, km_total: int) -> dict[str, Any]:
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.post(
                f"{_base()}/api_v2/veiculo-update/{veiculo_id}",
                json={"km_total": km_total},
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": f"token {token}",
                },
            )
    except httpx.RequestError as e:
        raise RastrosystemError(f"Falha de rede Rastrosystem: {e!s}", None)
    try:
        data = r.json()
    except Exception:
        data = {}
    if not r.is_success:
        msg = data.get("msg") if isinstance(data, dict) else None
        raise RastrosystemError(str(msg or f"HTTP {r.status_code}"), r.status_code)
    return data if isinstance(data, dict) else {}
