"""Summary DTO"""
from dataclasses import dataclass, field
from typing import List, Optional
from uuid import UUID

from app.domain.entities.summary import ActionItem, Summary


@dataclass
class ActionItemDTO:
    """Action item DTO"""
    person: str
    task: str
    due_date: Optional[str] = None


@dataclass
class SummaryDTO:
    """Data Transfer Object for Summary"""
    
    id: UUID
    transcription_id: UUID
    muhtasari: str
    maamuzi: List[str] = field(default_factory=list)
    kazi: List[ActionItemDTO] = field(default_factory=list)
    masuala_yaliyoahirishwa: List[str] = field(default_factory=list)
    
    @classmethod
    def from_entity(cls, summary: Summary) -> "SummaryDTO":
        """Create DTO from domain entity"""
        return cls(
            id=summary.id,
            transcription_id=summary.transcription_id,
            muhtasari=summary.muhtasari,
            maamuzi=summary.maamuzi,
            kazi=[
                ActionItemDTO(
                    person=item.person,
                    task=item.task,
                    due_date=item.due_date,
                )
                for item in summary.kazi
            ],
            masuala_yaliyoahirishwa=summary.masuala_yaliyoahirishwa,
        )

