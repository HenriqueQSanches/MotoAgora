from fastapi import APIRouter

from app.core.config import get_settings

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/health/redis")
def health_redis() -> dict[str, str]:
    import redis

    settings = get_settings()
    try:
        r = redis.from_url(settings.redis_url)
        r.ping()
        return {"redis": "ok"}
    except Exception as e:
        return {"redis": f"error: {e!s}"}
