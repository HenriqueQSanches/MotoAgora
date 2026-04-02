import logging

from app.core.config import get_settings

log = logging.getLogger(__name__)


def sincronizar_cobranca_sglock(*, cobranca_id: int, valor: str, vencimento: str) -> None:
    """Integracao SGLock conforme documentacao. Stub ate credenciais."""
    settings = get_settings()
    if not settings.sglock_enabled:
        log.info(
            "SGLock desabilitado (stub): cobranca_id=%s valor=%s venc=%s",
            cobranca_id,
            valor,
            vencimento,
        )
        return
    log.warning("SGLock habilitado mas integracao ainda nao implementada.")
