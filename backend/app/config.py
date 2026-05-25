from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    mongodb_uri: str = Field(default="mongodb://localhost:27017", alias="MONGODB_URI")
    mongodb_db: str = Field(default="speaker_recognition", alias="MONGODB_DB")
    jwt_secret: str = Field(default="change-me", alias="JWT_SECRET")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(default=1440, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    allowed_origins: str = Field(default="http://localhost:5173", alias="ALLOWED_ORIGINS")
    upload_dir: str = Field(default="uploads", alias="UPLOAD_DIR")
    model_dir: str = Field(default="trained_models", alias="MODEL_DIR")
    speechbrain_source: str = Field(default="speechbrain/spkrec-ecapa-voxceleb", alias="SPEECHBRAIN_SOURCE")
    max_upload_mb: int = Field(default=25, alias="MAX_UPLOAD_MB")

    @property
    def allowed_origin_list(self) -> list[str]:
        return [item.strip() for item in self.allowed_origins.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
