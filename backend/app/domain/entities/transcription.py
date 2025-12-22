"""Transcription entity"""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from uuid import UUID

from app.domain.entities.summary import Summary
from app.domain.exceptions.domain_exceptions import InvalidStatusTransitionError
from app.domain.value_objects.processing_status import ProcessingStatus


@dataclass
class Transcription:
    """Transcription entity representing an audio transcription job"""
    
    id: UUID
    filename: str
    file_path: str
    status: ProcessingStatus
    transcript_text: Optional[str] = None
    summary: Optional[Summary] = None
    error_message: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    
    @classmethod
    def create(
        cls,
        filename: str,
        file_path: str,
    ) -> "Transcription":
        """Create a new transcription entity"""
        from uuid import uuid4
        
        return cls(
            id=uuid4(),
            filename=filename,
            file_path=file_path,
            status=ProcessingStatus.PENDING,
        )
    
    def mark_as_processing(self) -> None:
        """Mark transcription as processing"""
        if self.status != ProcessingStatus.PENDING:
            raise InvalidStatusTransitionError(
                self.status.value,
                ProcessingStatus.PROCESSING.value
            )
        self.status = ProcessingStatus.PROCESSING
        self.updated_at = datetime.utcnow()
    
    def complete_with_transcript(self, transcript: str) -> None:
        """Complete transcription with transcript text"""
        if self.status != ProcessingStatus.PROCESSING:
            raise InvalidStatusTransitionError(
                self.status.value,
                ProcessingStatus.COMPLETED.value
            )
        self.transcript_text = transcript
        self.status = ProcessingStatus.COMPLETED
        self.updated_at = datetime.utcnow()
    
    def add_summary(self, summary: Summary) -> None:
        """Add summary to transcription"""
        if summary.transcription_id != self.id:
            raise ValueError("Summary transcription_id must match transcription id")
        self.summary = summary
        self.updated_at = datetime.utcnow()
    
    def mark_as_failed(self, error_message: str) -> None:
        """Mark transcription as failed"""
        self.status = ProcessingStatus.FAILED
        self.error_message = error_message
        self.updated_at = datetime.utcnow()

