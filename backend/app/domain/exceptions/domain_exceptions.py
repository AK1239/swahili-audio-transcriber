"""Base domain exceptions"""


class DomainException(Exception):
    """Base exception for all domain errors"""
    pass


class TranscriptionNotFoundError(DomainException):
    """Transcription not found"""
    
    def __init__(self, transcription_id: str):
        self.transcription_id = transcription_id
        super().__init__(f"Transcription with id {transcription_id} not found")


class InvalidStatusTransitionError(DomainException):
    """Invalid status transition attempted"""
    
    def __init__(self, current_status: str, attempted_status: str):
        super().__init__(
            f"Cannot transition from {current_status} to {attempted_status}"
        )

