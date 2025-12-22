"""Transcription DTO"""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from uuid import UUID

from app.domain.entities.transcription import Transcription
from app.domain.value_objects.processing_status import ProcessingStatus


@dataclass
class TranscriptionDTO:
    """Data Transfer Object for Transcription"""
    
    id: UUID
    filename: str
    status: str
    transcript_text: Optional[str] = None
    created_at: datetime = None
    updated_at: datetime = None
    
    @classmethod
    def from_entity(cls, transcription: Transcription) -> "TranscriptionDTO":
        """Create DTO from domain entity"""
        return cls(
            id=transcription.id,
            filename=transcription.filename,
            status=transcription.status.value,
            transcript_text=transcription.transcript_text,
            created_at=transcription.created_at,
            updated_at=transcription.updated_at,
        )

