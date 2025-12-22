"""Dependency injection container"""
from dependency_injector import containers, providers
from openai import AsyncOpenAI
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.services.transcription_orchestrator import TranscriptionOrchestrator
from app.application.use_cases.get_summary import GetSummaryUseCase
from app.application.use_cases.get_transcript import GetTranscriptUseCase
from app.application.use_cases.upload_audio import UploadAudioUseCase
from app.infrastructure.config.settings import settings
from app.infrastructure.database.base import AsyncSessionLocal
from app.infrastructure.providers.openai_summarization_provider import (
    OpenAISummarizationProvider,
)
from app.infrastructure.providers.openai_whisper_provider import OpenAIWhisperProvider
from app.infrastructure.repositories.transcription_repository_impl import (
    TranscriptionRepositoryImpl,
)
from app.infrastructure.storage.local_file_storage import LocalFileStorage
from app.shared.logging import get_logger


class ApplicationContainer(containers.DeclarativeContainer):
    """Dependency injection container"""
    
    # Configuration
    config = providers.Configuration()
    config.from_dict({
        "database": {"url": settings.database_url},
        "openai": {"api_key": settings.openai_api_key},
        "storage": {"upload_dir": settings.upload_dir},
    })
    
    # Logging
    logger = providers.Singleton(get_logger)
    
    # Database session factory
    db_session = providers.Factory(
        lambda: AsyncSessionLocal(),
    )
    
    # Repositories
    transcription_repository = providers.Factory(
        TranscriptionRepositoryImpl,
        session=providers.Singleton(
            lambda: AsyncSessionLocal(),
        ),
    )
    
    # OpenAI client
    openai_client = providers.Singleton(
        AsyncOpenAI,
        api_key=config.openai.api_key,
    )
    
    # Providers
    transcription_provider = providers.Factory(
        OpenAIWhisperProvider,
        client=openai_client,
    )
    
    summarization_provider = providers.Factory(
        OpenAISummarizationProvider,
        client=openai_client,
        model=providers.Object("gpt-3.5-turbo"),
    )
    
    # Storage
    file_storage = providers.Factory(
        LocalFileStorage,
        upload_dir=config.storage.upload_dir,
    )
    
    # Services
    transcription_orchestrator = providers.Factory(
        TranscriptionOrchestrator,
        transcription_repo=transcription_repository,
        transcription_provider=transcription_provider,
        summarization_provider=summarization_provider,
        file_storage=file_storage,
        logger=logger,
    )
    
    # Use Cases
    upload_audio_use_case = providers.Factory(
        UploadAudioUseCase,
        transcription_repo=transcription_repository,
        file_storage=file_storage,
        transcription_orchestrator=transcription_orchestrator,
        logger=logger,
    )
    
    get_transcript_use_case = providers.Factory(
        GetTranscriptUseCase,
        transcription_repo=transcription_repository,
        logger=logger,
    )
    
    get_summary_use_case = providers.Factory(
        GetSummaryUseCase,
        transcription_repo=transcription_repository,
        logger=logger,
    )
