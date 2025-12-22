"""Response schemas for API"""
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel

from app.application.dto.summary_dto import ActionItemDTO, SummaryDTO
from app.application.dto.transcription_dto import TranscriptionDTO


class TranscriptionResponse(BaseModel):
    """Response schema for transcription"""
    id: UUID
    filename: str
    status: str
    transcript_text: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    @classmethod
    def from_dto(cls, dto: TranscriptionDTO) -> "TranscriptionResponse":
        """Create response from DTO"""
        return cls(
            id=dto.id,
            filename=dto.filename,
            status=dto.status,
            transcript_text=dto.transcript_text,
            created_at=dto.created_at,
            updated_at=dto.updated_at,
        )
    
    class Config:
        from_attributes = True


class ActionItemResponse(BaseModel):
    """Response schema for action item"""
    person: str
    task: str
    due_date: Optional[str] = None
    
    @classmethod
    def from_dto(cls, dto: ActionItemDTO) -> "ActionItemResponse":
        """Create response from DTO"""
        return cls(
            person=dto.person,
            task=dto.task,
            due_date=dto.due_date,
        )
    
    class Config:
        from_attributes = True


class SummaryResponse(BaseModel):
    """Response schema for summary"""
    id: UUID
    transcription_id: UUID
    muhtasari: str
    maamuzi: List[str]
    kazi: List[ActionItemResponse]
    masuala_yaliyoahirishwa: List[str]
    
    @classmethod
    def from_dto(cls, dto: SummaryDTO) -> "SummaryResponse":
        """Create response from DTO"""
        return cls(
            id=dto.id,
            transcription_id=dto.transcription_id,
            muhtasari=dto.muhtasari,
            maamuzi=dto.maamuzi,
            kazi=[ActionItemResponse.from_dto(item) for item in dto.kazi],
            masuala_yaliyoahirishwa=dto.masuala_yaliyoahirishwa,
        )
    
    class Config:
        from_attributes = True


class ErrorResponse(BaseModel):
    """Error response schema"""
    detail: str
    type: Optional[str] = None

