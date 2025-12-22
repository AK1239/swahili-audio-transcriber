"""SQLAlchemy model for Transcription"""
import json
from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy import JSON, String, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.domain.entities.summary import ActionItem, Summary
from app.domain.entities.transcription import Transcription
from app.domain.value_objects.processing_status import ProcessingStatus
from app.infrastructure.database.base import Base


class TranscriptionModel(Base):
    """SQLAlchemy model for transcription"""
    
    __tablename__ = "transcriptions"
    
    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    transcript_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    summary_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )
    
    @classmethod
    def from_entity(cls, transcription: Transcription) -> "TranscriptionModel":
        """Create model from domain entity"""
        summary_json = None
        if transcription.summary:
            summary_dict = {
                "id": str(transcription.summary.id),
                "transcription_id": str(transcription.summary.transcription_id),
                "muhtasari": transcription.summary.muhtasari,
                "maamuzi": transcription.summary.maamuzi,
                "kazi": [
                    {
                        "person": item.person,
                        "task": item.task,
                        "due_date": item.due_date,
                    }
                    for item in transcription.summary.kazi
                ],
                "masuala_yaliyoahirishwa": transcription.summary.masuala_yaliyoahirishwa,
            }
            summary_json = json.dumps(summary_dict)
        
        return cls(
            id=transcription.id,
            filename=transcription.filename,
            file_path=transcription.file_path,
            status=transcription.status.value,
            transcript_text=transcription.transcript_text,
            summary_json=summary_json,
            error_message=transcription.error_message,
            created_at=transcription.created_at,
            updated_at=transcription.updated_at,
        )
    
    def to_entity(self) -> Transcription:
        """Convert model to domain entity"""
        from app.domain.entities.summary import ActionItem, Summary
        
        summary = None
        if self.summary_json:
            summary_dict = json.loads(self.summary_json)
            summary = Summary(
                id=UUID(summary_dict["id"]),
                transcription_id=UUID(summary_dict["transcription_id"]),
                muhtasari=summary_dict["muhtasari"],
                maamuzi=summary_dict.get("maamuzi", []),
                kazi=[
                    ActionItem(
                        person=item["person"],
                        task=item["task"],
                        due_date=item.get("due_date"),
                    )
                    for item in summary_dict.get("kazi", [])
                ],
                masuala_yaliyoahirishwa=summary_dict.get("masuala_yaliyoahirishwa", []),
            )
        
        return Transcription(
            id=self.id,
            filename=self.filename,
            file_path=self.file_path,
            status=ProcessingStatus(self.status),
            transcript_text=self.transcript_text,
            summary=summary,
            error_message=self.error_message,
            created_at=self.created_at,
            updated_at=self.updated_at,
        )

