"""Validation exceptions"""

from app.domain.exceptions.domain_exceptions import DomainException


class InvalidFileTypeError(DomainException):
    """Invalid file type"""
    pass


class FileTooLargeError(DomainException):
    """File size exceeds maximum allowed"""
    pass


class TranscriptionProviderError(DomainException):
    """Error from transcription provider"""
    pass


class SummarizationProviderError(DomainException):
    """Error from summarization provider"""
    pass

