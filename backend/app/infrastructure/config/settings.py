"""Application settings using Pydantic"""
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings"""
    
    # Database
    # Default to SQLite for local development
    # For production, set DATABASE_URL environment variable to PostgreSQL connection string
    # Format: postgresql+asyncpg://user:password@host:port/dbname
    database_url: str = Field(
        default="sqlite+aiosqlite:///./transcriptions.db",
        description="Database URL. Use PostgreSQL for production: postgresql+asyncpg://user:pass@host:port/dbname"
    )
    
    # OpenAI
    openai_api_key: str
    openai_model: str = "gpt-3.5-turbo"  # Default model for summarization, can be overridden via env
    openai_whisper_model: str = "whisper-1"  # Whisper model for transcription, can be overridden via env
    
    # File Storage
    upload_dir: str = "./uploads"  # For local development
    storage_type: str = Field(
        default="local",
        description="Storage type: 'local' for filesystem, 'r2' for Cloudflare R2"
    )
    max_file_size_mb: int = 25
    allowed_extensions: str = "mp3,wav,mp4,webm"
    
    # Cloudflare R2 settings (required if storage_type is 'r2')
    r2_account_id: str | None = Field(
        default=None,
        description="Cloudflare R2 account ID"
    )
    r2_access_key_id: str | None = Field(
        default=None,
        description="Cloudflare R2 access key ID"
    )
    r2_secret_access_key: str | None = Field(
        default=None,
        description="Cloudflare R2 secret access key"
    )
    r2_bucket_name: str | None = Field(
        default=None,
        description="Cloudflare R2 bucket name"
    )
    
    # Application
    environment: str = "development"
    log_level: str = "INFO"
    cors_origins: str = "http://localhost:5173"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )
    
    @property
    def allowed_extensions_set(self) -> set[str]:
        """Get allowed extensions as a set"""
        return {f".{ext.strip()}" for ext in self.allowed_extensions.split(",")}
    
    @property
    def cors_origins_list(self) -> list[str]:
        """Get CORS origins as a list"""
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()

