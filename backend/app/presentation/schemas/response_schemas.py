"""Response schemas for API"""
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.application.dto.summary_dto import ActionItemDTO, SummaryDTO
from app.application.dto.transcription_dto import TranscriptionDTO


class TranscriptionResponse(BaseModel):
    """Response schema for transcription"""
    id: UUID
    filename: str
    status: str
    transcriptText: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime
    
    @classmethod
    def from_dto(cls, dto: TranscriptionDTO) -> "TranscriptionResponse":
        """Create response from DTO"""
        return cls(
            id=dto.id,
            filename=dto.filename,
            status=dto.status,
            transcriptText=dto.transcript_text,
            createdAt=dto.created_at,
            updatedAt=dto.updated_at,
        )
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )


class ActionItemResponse(BaseModel):
    """Response schema for action item"""
    person: str
    task: str
    dueDate: Optional[str] = None
    
    @classmethod
    def from_dto(cls, dto: ActionItemDTO) -> "ActionItemResponse":
        """Create response from DTO"""
        return cls(
            person=dto.person,
            task=dto.task,
            dueDate=dto.due_date,
        )
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )


class SummaryResponse(BaseModel):
    """Response schema for summary"""
    id: UUID
    transcriptionId: UUID
    muhtasari: str
    maamuzi: List[str]
    kazi: List[ActionItemResponse]
    masualaYaliyoahirishwa: List[str]
    
    @classmethod
    def from_dto(cls, dto: SummaryDTO) -> "SummaryResponse":
        """Create response from DTO"""
        return cls(
            id=dto.id,
            transcriptionId=dto.transcription_id,
            muhtasari=dto.muhtasari,
            maamuzi=dto.maamuzi,
            kazi=[ActionItemResponse.from_dto(item) for item in dto.kazi],
            masualaYaliyoahirishwa=dto.masuala_yaliyoahirishwa,
        )
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )


class ErrorResponse(BaseModel):
    """Error response schema"""
    detail: str
    type: Optional[str] = None

