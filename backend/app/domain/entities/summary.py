"""Summary entity"""
from dataclasses import dataclass, field
from typing import List, Optional
from uuid import UUID


@dataclass
class ActionItem:
    """Action item from meeting"""
    person: str
    task: str
    due_date: Optional[str] = None


@dataclass
class Summary:
    """Summary entity containing structured meeting summary"""
    
    id: UUID
    transcription_id: UUID
    muhtasari: str  # Brief summary
    maamuzi: List[str] = field(default_factory=list)  # Important decisions
    kazi: List[ActionItem] = field(default_factory=list)  # Action items
    masuala_yaliyoahirishwa: List[str] = field(default_factory=list)  # Deferred topics
    
    @classmethod
    def create(
        cls,
        transcription_id: UUID,
        muhtasari: str,
        maamuzi: Optional[List[str]] = None,
        kazi: Optional[List[ActionItem]] = None,
        masuala_yaliyoahirishwa: Optional[List[str]] = None,
    ) -> "Summary":
        """Create a new summary"""
        from uuid import uuid4
        
        return cls(
            id=uuid4(),
            transcription_id=transcription_id,
            muhtasari=muhtasari,
            maamuzi=maamuzi or [],
            kazi=kazi or [],
            masuala_yaliyoahirishwa=masuala_yaliyoahirishwa or [],
        )

