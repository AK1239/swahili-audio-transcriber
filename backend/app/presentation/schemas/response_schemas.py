"""Response schemas for API"""
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict

from app.application.dto.summary_dto import ActionItemDTO, SummaryDTO
from app.application.dto.transcription_dto import TranscriptionDTO


class TranscriptionResponse(BaseModel):
    """Response schema for transcription"""
    id: UUID
    filename: str
    status: str
    transcriptText: Optional[str] = Field(None, alias="transcript_text")
    createdAt: datetime = Field(alias="created_at")
    updatedAt: datetime = Field(alias="updated_at")
    
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
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        # Use alias for serialization (camelCase in JSON)
        json_encoders={},
    )


class ActionItemResponse(BaseModel):
    """Response schema for action item"""
    person: str
    task: str
    dueDate: Optional[str] = Field(None, alias="due_date")
    
    @classmethod
    def from_dto(cls, dto: ActionItemDTO) -> "ActionItemResponse":
        """Create response from DTO"""
        return cls(
            person=dto.person,
            task=dto.task,
            due_date=dto.due_date,
        )
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )


class SummaryResponse(BaseModel):
    """Response schema for summary"""
    id: UUID
    transcriptionId: UUID = Field(alias="transcription_id")
    muhtasari: str
    maamuzi: List[str]
    kazi: List[ActionItemResponse]
    masualaYaliyoahirishwa: List[str] = Field(alias="masuala_yaliyoahirishwa")
    
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
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )


class ErrorResponse(BaseModel):
    """Error response schema"""
    detail: str
    type: Optional[str] = None

