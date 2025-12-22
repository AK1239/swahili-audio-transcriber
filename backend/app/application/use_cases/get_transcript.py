"""Get transcript use case"""
from uuid import UUID

from app.application.dto.transcription_dto import TranscriptionDTO
from app.domain.interfaces.transcription_repository import TranscriptionRepository
from app.shared.logging import get_logger

logger = get_logger(__name__)


class GetTranscriptUseCase:
    """Use case for retrieving transcript"""
    
    def __init__(
        self,
        transcription_repo: TranscriptionRepository,
        logger=None,
    ):
        self._repo = transcription_repo
        self._logger = logger or get_logger(__name__)
    
    async def execute(self, transcription_id: UUID) -> TranscriptionDTO:
        """
        Get transcript by ID
        
        Args:
            transcription_id: ID of transcription
        
        Returns:
            TranscriptionDTO with transcript
        """
        transcription = await self._repo.get_by_id(transcription_id)
        return TranscriptionDTO.from_entity(transcription)

