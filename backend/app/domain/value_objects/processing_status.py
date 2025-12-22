"""Processing status value object"""
from enum import Enum


class ProcessingStatus(str, Enum):
    """Status of transcription processing"""
    
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

