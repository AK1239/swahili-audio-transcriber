"""Transcription repository interface"""
from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from app.domain.entities.transcription import Transcription


class TranscriptionRepository(ABC):
    """Interface for transcription repository"""
    
    @abstractmethod
    async def create(self, transcription: Transcription) -> None:
        """Create a new transcription"""
        pass
    
    @abstractmethod
    async def get_by_id(self, transcription_id: UUID) -> Transcription:
        """Get transcription by ID"""
        pass
    
    @abstractmethod
    async def update(self, transcription: Transcription) -> None:
        """Update transcription"""
        pass
    
    @abstractmethod
    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Transcription]:
        """Get all transcriptions with pagination"""
        pass

