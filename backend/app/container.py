from openai import AsyncOpenAI

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


class ApplicationContainer:
    """Manual dependency injection container"""
    
    def __init__(self):
        """Initialize all dependencies"""
        # Logger
        self._logger = get_logger()
        
        # OpenAI client
        self._openai_client = AsyncOpenAI(api_key=settings.openai_api_key)
        
        # Database session factory
        self._db_session_factory = AsyncSessionLocal
        
        # Repositories
        self._transcription_repository = None  # Lazy initialization
        
        # Providers
        self._transcription_provider = OpenAIWhisperProvider(
            client=self._openai_client,
            model=settings.openai_whisper_model
        )
        
        self._summarization_provider = OpenAISummarizationProvider(
            client=self._openai_client,
            model=settings.openai_model
        )
        
        # Storage
        self._file_storage = LocalFileStorage(upload_dir=settings.upload_dir)
        
        # Initialize use cases after repository is available (lazy initialization)
        self._upload_audio_use_case = None
        self._get_transcript_use_case = None
        self._get_summary_use_case = None
        self._transcription_orchestrator = None
    
    @property
    def transcription_repository(self):
        """Get transcription repository (lazy initialization)"""
        if self._transcription_repository is None:
            session = self._db_session_factory()
            self._transcription_repository = TranscriptionRepositoryImpl(session)
            
            # Initialize orchestrator and use cases after repository is ready
            if self._transcription_orchestrator is None:
                self._transcription_orchestrator = TranscriptionOrchestrator(
                    transcription_repo=self._transcription_repository,
                    transcription_provider=self._transcription_provider,
                    summarization_provider=self._summarization_provider,
                    file_storage=self._file_storage,
                    logger=self._logger,
                )
                
                self._upload_audio_use_case = UploadAudioUseCase(
                    transcription_repo=self._transcription_repository,
                    file_storage=self._file_storage,
                    transcription_orchestrator=self._transcription_orchestrator,
                    logger=self._logger,
                )
                
                self._get_transcript_use_case = GetTranscriptUseCase(
                    transcription_repo=self._transcription_repository,
                    logger=self._logger,
                )
                
                self._get_summary_use_case = GetSummaryUseCase(
                    transcription_repo=self._transcription_repository,
                    logger=self._logger,
                )
        
        return self._transcription_repository
    
    @property
    def upload_audio_use_case(self) -> UploadAudioUseCase:
        """Get upload audio use case"""
        _ = self.transcription_repository  # Ensure initialization
        return self._upload_audio_use_case
    
    @property
    def get_transcript_use_case(self) -> GetTranscriptUseCase:
        """Get transcript use case"""
        _ = self.transcription_repository  # Ensure initialization
        return self._get_transcript_use_case
    
    @property
    def get_summary_use_case(self) -> GetSummaryUseCase:
        """Get summary use case"""
        _ = self.transcription_repository  # Ensure initialization
        return self._get_summary_use_case
    
    def wire(self, modules=None):
        """Wire dependencies (compatibility method - no-op for manual DI)"""
        pass
    
    def unwire(self):
        """Unwire dependencies (compatibility method - no-op for manual DI)"""
        pass
