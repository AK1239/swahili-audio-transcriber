"""Unit tests for Transcription entity"""
import pytest

from app.domain.entities.transcription import Transcription
from app.domain.exceptions.domain_exceptions import InvalidStatusTransitionError
from app.domain.value_objects.processing_status import ProcessingStatus


def test_transcription_create():
    """Test creating a new transcription"""
    transcription = Transcription.create(
        filename="test.mp3",
        file_path="/test/path/test.mp3",
    )
    
    assert transcription.filename == "test.mp3"
    assert transcription.file_path == "/test/path/test.mp3"
    assert transcription.status == ProcessingStatus.PENDING
    assert transcription.transcript_text is None
    assert transcription.summary is None


def test_transcription_mark_as_processing():
    """Test marking transcription as processing"""
    transcription = Transcription.create(
        filename="test.mp3",
        file_path="/test/path/test.mp3",
    )
    
    transcription.mark_as_processing()
    assert transcription.status == ProcessingStatus.PROCESSING


def test_transcription_mark_as_processing_invalid_status():
    """Test that marking as processing from non-pending status fails"""
    transcription = Transcription.create(
        filename="test.mp3",
        file_path="/test/path/test.mp3",
    )
    transcription.mark_as_processing()
    transcription.complete_with_transcript("Test transcript")
    
    with pytest.raises(InvalidStatusTransitionError):
        transcription.mark_as_processing()


def test_transcription_complete_with_transcript():
    """Test completing transcription with transcript"""
    transcription = Transcription.create(
        filename="test.mp3",
        file_path="/test/path/test.mp3",
    )
    transcription.mark_as_processing()
    
    transcript_text = "Hii ni nakala ya mkutano."
    transcription.complete_with_transcript(transcript_text)
    
    assert transcription.status == ProcessingStatus.COMPLETED
    assert transcription.transcript_text == transcript_text


def test_transcription_mark_as_failed():
    """Test marking transcription as failed"""
    transcription = Transcription.create(
        filename="test.mp3",
        file_path="/test/path/test.mp3",
    )
    transcription.mark_as_processing()
    
    error_message = "Transcription failed"
    transcription.mark_as_failed(error_message)
    
    assert transcription.status == ProcessingStatus.FAILED
    assert transcription.error_message == error_message

