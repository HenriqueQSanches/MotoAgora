import logging

from app.core.config import get_settings

log = logging.getLogger(__name__)


def alerta_troca_oleo_whatsapp(
    *,
    moto_id: int,
    placa: str,
    modelo: str,
    km: int,
    telefone: str | None,
) -> None:
    """Envia aviso de troca de oleo. Stub ate credenciais WhatsApp."""
    settings = get_settings()
    if not settings.whatsapp_enabled:
        log.info(
            "WhatsApp desabilitado (stub): troca oleo moto id=%s %s/%s km=%s destino=%s",
            moto_id,
            placa,
            modelo,
            km,
            telefone,
        )
        return
    log.warning("WhatsApp habilitado mas integracao ainda nao implementada.")


def lembrete_cobranca_whatsapp(telefone: str | None, mensagem: str) -> None:
    settings = get_settings()
    if not settings.whatsapp_enabled:
        log.info("WhatsApp desabilitado (stub): cobranca msg=%s destino=%s", mensagem, telefone)
        return
    log.warning("WhatsApp habilitado mas integracao ainda nao implementada.")
