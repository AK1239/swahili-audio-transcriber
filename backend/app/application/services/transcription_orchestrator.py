"""Transcription orchestrator service"""
from uuid import UUID

from app.domain.interfaces.file_storage import FileStorage
from app.domain.interfaces.summarization_provider import SummarizationProvider
from app.domain.interfaces.transcription_provider import TranscriptionProvider
from app.domain.interfaces.transcription_repository import TranscriptionRepository
from app.shared.logging import get_logger

logger = get_logger(__name__)


class TranscriptionOrchestrator:
    """Orchestrates the transcription and summarization workflow"""
    
    def __init__(
        self,
        transcription_repo: TranscriptionRepository,
        transcription_provider: TranscriptionProvider,
        summarization_provider: SummarizationProvider,
        file_storage: FileStorage,
        logger=None,
    ):
        self._repo = transcription_repo
        self._transcription_provider = transcription_provider
        self._summarization_provider = summarization_provider
        self._file_storage = file_storage
        self._logger = logger or get_logger(__name__)
    
    async def process_transcription(self, transcription_id: UUID) -> None:
        """
        Process transcription: transcribe audio and generate summary
        
        Args:
            transcription_id: ID of transcription to process
        """
        try:
            # Get transcription
            transcription = await self._repo.get_by_id(transcription_id)
            
            # Mark as processing
            transcription.mark_as_processing()
            await self._repo.update(transcription)
            
            self._logger.info(
                "transcription.processing.started",
                transcription_id=str(transcription_id),
            )
            
            # Load audio file
            audio_bytes = await self._file_storage.load(transcription.file_path)
            
            # Transcribe
            transcript = await self._transcription_provider.transcribe(
                audio_bytes,
                language_hint="sw",
            )
            
            # Update with transcript
            transcription.complete_with_transcript(transcript)
            await self._repo.update(transcription)
            
            self._logger.info(
                "transcription.completed",
                transcription_id=str(transcription_id),
            )
            
            # Summarize
            summary = await self._summarization_provider.summarize(
                transcript=transcript,
                transcription_id=transcription_id,
                language="sw",
            )
            
            # Log generated summary details before saving
            self._logger.info(
                "summarization.generated",
                transcription_id=str(transcription_id),
                summary_id=str(summary.id),
                muhtasari_length=len(summary.muhtasari or ""),
                maamuzi_count=len(summary.maamuzi or []),
                kazi_count=len(summary.kazi or []),
                masuala_count=len(summary.masuala_yaliyoahirishwa or []),
            )
            
            # Add summary
            transcription.add_summary(summary)
            await self._repo.update(transcription)
            
            self._logger.info(
                "transcription.processing.completed",
                transcription_id=str(transcription_id),
            )
        
        except Exception as e:
            # Application layer is the ONLY place to log errors
            self._logger.error(
                "transcription.processing.failed",
                transcription_id=str(transcription_id),
                error=str(e),
                error_type=type(e).__name__,
            )
            
            # Mark as failed
            transcription = await self._repo.get_by_id(transcription_id)
            transcription.mark_as_failed(str(e))
            await self._repo.update(transcription)
            
            raise

