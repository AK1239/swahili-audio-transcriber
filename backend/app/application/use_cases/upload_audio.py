"""Upload audio use case"""
from typing import Optional

from fastapi import UploadFile

from app.application.dto.transcription_dto import TranscriptionDTO
from app.domain.interfaces.file_storage import FileStorage
from app.domain.interfaces.transcription_repository import TranscriptionRepository
from app.domain.value_objects.file_info import FileInfo
from app.shared.logging import get_logger

logger = get_logger(__name__)


class UploadAudioUseCase:
    """Use case for uploading and processing audio files"""
    
    def __init__(
        self,
        transcription_repo: TranscriptionRepository,
        file_storage: FileStorage,
        transcription_orchestrator,
        logger=None,
    ):
        self._repo = transcription_repo
        self._storage = file_storage
        self._orchestrator = transcription_orchestrator
        self._logger = logger or get_logger(__name__)
    
    async def execute(
        self,
        file: UploadFile,
        origin: Optional[str] = None,
    ) -> TranscriptionDTO:
        """
        Upload and process audio file
        
        Args:
            file: Uploaded file
        
        Returns:
            TranscriptionDTO with transcription info
        """
        # Read file content
        file_content = await file.read()
        
        # Create file info and validate
        file_info = FileInfo.from_upload_file(
            filename=file.filename or "unknown",
            size_bytes=len(file_content),
            content_type=file.content_type,
            origin=origin,
        )
        file_info.validate()
        
        self._logger.info(
            "upload.started",
            filename=file_info.filename,
            size_bytes=file_info.size_bytes,
            origin=file_info.origin,
        )
        
        # Save file
        file_path = await self._storage.save(file_content, file_info.filename)
        
        # Create transcription entity
        from app.domain.entities.transcription import Transcription
        transcription = Transcription.create(
            filename=file_info.filename,
            file_path=file_path,
        )
        
        # Persist
        await self._repo.create(transcription)
        
        # Process asynchronously (in background for production)
        # For MVP, we'll process synchronously
        # Don't catch/log here - orchestrator handles error logging
        await self._orchestrator.process_transcription(transcription.id)
        
        # Return DTO
        updated_transcription = await self._repo.get_by_id(transcription.id)
        return TranscriptionDTO.from_entity(updated_transcription)

