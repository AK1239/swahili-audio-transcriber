"""Get summary use case"""
from uuid import UUID

from app.application.dto.summary_dto import SummaryDTO
from app.domain.entities.transcription import Transcription
from app.domain.interfaces.transcription_repository import TranscriptionRepository
from app.shared.logging import get_logger

logger = get_logger(__name__)


class GetSummaryUseCase:
    """Use case for retrieving summary"""
    
    def __init__(
        self,
        transcription_repo: TranscriptionRepository,
        logger=None,
    ):
        self._repo = transcription_repo
        self._logger = logger or get_logger(__name__)
    
    async def execute(self, transcription_id: UUID) -> SummaryDTO:
        """
        Get summary by transcription ID
        
        Args:
            transcription_id: ID of transcription
        
        Returns:
            SummaryDTO with summary
        
        Raises:
            ValueError: If transcription has no summary
        """
        transcription = await self._repo.get_by_id(transcription_id)
        
        if not transcription.summary:
            raise ValueError(f"Transcription {transcription_id} has no summary yet")
        
        return SummaryDTO.from_entity(transcription.summary)

