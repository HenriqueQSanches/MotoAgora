from functools import lru_cache
from urllib.parse import quote_plus

from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Leia `.env` sempre em UTF-8 (sem BOM) para evitar erro no Windows com acentos."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "MotoAgora API"

    #: Se definido, sobrescreve usuario/senha/host abaixo (senha com @ ou # deve estar URL-encoded).
    database_url: str | None = None

    postgres_user: str = "moto"
    postgres_password: str = "moto"
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "motoagora"

    redis_url: str = "redis://localhost:6379/0"

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    rastro_api_base: str = "https://teste.rastrosystem.com.br"
    rastro_app_id: int = 9

    whatsapp_enabled: bool = False
    sglock_enabled: bool = False

    @computed_field
    @property
    def effective_database_url(self) -> str:
        if self.database_url and self.database_url.strip():
            return self.database_url.strip()
        u = quote_plus(self.postgres_user)
        p = quote_plus(self.postgres_password)
        return (
            f"postgresql+psycopg2://{u}:{p}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
