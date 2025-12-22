"""Summarization provider interface"""
from abc import ABC, abstractmethod
from uuid import UUID

from app.domain.entities.summary import Summary


class SummarizationProvider(ABC):
    """Interface for text summarization providers"""
    
    @abstractmethod
    async def summarize(
        self,
        transcript: str,
        transcription_id: UUID,
        language: str = "sw",
    ) -> Summary:
        """
        Summarize transcript text
        
        Args:
            transcript: Transcript text to summarize
            transcription_id: ID of the transcription
            language: Language code (default: "sw" for Swahili)
        
        Returns:
            Summary entity with structured summary
        
        Raises:
            SummarizationProviderError: If summarization fails
        """
        pass

