"""Application settings using Pydantic"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings"""
    
    # Database
    database_url: str = "sqlite+aiosqlite:///./transcriptions.db"
    
    # OpenAI
    openai_api_key: str
    openai_model: str = "gpt-3.5-turbo"  # Default model for summarization, can be overridden via env
    openai_whisper_model: str = "whisper-1"  # Whisper model for transcription, can be overridden via env
    
    # File Storage
    upload_dir: str = "./uploads"
    max_file_size_mb: int = 25
    allowed_extensions: str = "mp3,wav,mp4"
    
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

