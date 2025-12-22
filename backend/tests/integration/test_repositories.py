"""Integration tests for repositories"""
import pytest
from uuid import uuid4

from app.domain.entities.transcription import Transcription
from app.infrastructure.repositories.transcription_repository_impl import (
    TranscriptionRepositoryImpl,
)


@pytest.mark.asyncio
async def test_repository_create_and_get(test_session):
    """Test creating and retrieving transcription"""
    repo = TranscriptionRepositoryImpl(test_session)
    
    transcription = Transcription.create(
        filename="test.mp3",
        file_path="/test/path/test.mp3",
    )
    
    await repo.create(transcription)
    
    retrieved = await repo.get_by_id(transcription.id)
    assert retrieved.id == transcription.id
    assert retrieved.filename == transcription.filename


@pytest.mark.asyncio
async def test_repository_update(test_session):
    """Test updating transcription"""
    repo = TranscriptionRepositoryImpl(test_session)
    
    transcription = Transcription.create(
        filename="test.mp3",
        file_path="/test/path/test.mp3",
    )
    await repo.create(transcription)
    
    transcription.mark_as_processing()
    transcription.complete_with_transcript("Test transcript")
    
    await repo.update(transcription)
    
    retrieved = await repo.get_by_id(transcription.id)
    assert retrieved.transcript_text == "Test transcript"


@pytest.mark.asyncio
async def test_repository_get_all(test_session):
    """Test getting all transcriptions"""
    repo = TranscriptionRepositoryImpl(test_session)
    
    # Create multiple transcriptions
    for i in range(3):
        transcription = Transcription.create(
            filename=f"test{i}.mp3",
            file_path=f"/test/path/test{i}.mp3",
        )
        await repo.create(transcription)
    
    all_transcriptions = await repo.get_all(skip=0, limit=10)
    assert len(all_transcriptions) == 3

