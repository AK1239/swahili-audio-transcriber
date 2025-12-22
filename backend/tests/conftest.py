"""Pytest configuration and fixtures"""
import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.domain.entities.transcription import Transcription
from app.domain.value_objects.processing_status import ProcessingStatus
from app.infrastructure.database.base import Base, get_session


@pytest.fixture
async def test_db():
    """Create test database"""
    # Use in-memory SQLite for testing
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        echo=False,
    )
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield engine
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    await engine.dispose()


@pytest.fixture
async def test_session(test_db):
    """Create test database session"""
    async_session = sessionmaker(
        test_db,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    
    async with async_session() as session:
        yield session
        await session.rollback()


@pytest.fixture
def sample_transcription():
    """Create sample transcription entity"""
    return Transcription.create(
        filename="test.mp3",
        file_path="/test/path/test.mp3",
    )


@pytest.fixture
def sample_transcript_text():
    """Sample Swahili transcript text"""
    return """
    Hii ni mkutano wa timu yetu. Leo tutajadili mipango ya miradi yetu.
    Tuna miradi mitatu: deployment ya API, database update, na frontend improvements.
    """
