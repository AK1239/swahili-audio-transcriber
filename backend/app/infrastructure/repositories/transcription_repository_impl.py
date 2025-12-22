"""Transcription repository implementation"""
from typing import List
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.transcription import Transcription
from app.domain.exceptions.domain_exceptions import TranscriptionNotFoundError
from app.domain.interfaces.transcription_repository import TranscriptionRepository
from app.infrastructure.database.models.transcription_model import TranscriptionModel


class TranscriptionRepositoryImpl(TranscriptionRepository):
    """SQLAlchemy implementation of transcription repository"""
    
    def __init__(self, session: AsyncSession):
        self._session = session
    
    async def create(self, transcription: Transcription) -> None:
        """Create a new transcription"""
        model = TranscriptionModel.from_entity(transcription)
        self._session.add(model)
        await self._session.commit()
        await self._session.refresh(model)
    
    async def get_by_id(self, transcription_id: UUID) -> Transcription:
        """Get transcription by ID"""
        result = await self._session.execute(
            select(TranscriptionModel).where(TranscriptionModel.id == transcription_id)
        )
        model = result.scalar_one_or_none()
        
        if not model:
            raise TranscriptionNotFoundError(str(transcription_id))
        
        return model.to_entity()
    
    async def update(self, transcription: Transcription) -> None:
        """Update transcription"""
        result = await self._session.execute(
            select(TranscriptionModel).where(TranscriptionModel.id == transcription.id)
        )
        model = result.scalar_one_or_none()
        
        if not model:
            raise TranscriptionNotFoundError(str(transcription.id))
        
        # Update model from entity
        updated_model = TranscriptionModel.from_entity(transcription)
        for key, value in updated_model.__dict__.items():
            if key != "id" and not key.startswith("_"):
                setattr(model, key, value)
        
        await self._session.commit()
        await self._session.refresh(model)
    
    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Transcription]:
        """Get all transcriptions with pagination"""
        result = await self._session.execute(
            select(TranscriptionModel)
            .order_by(TranscriptionModel.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        models = result.scalars().all()
        return [model.to_entity() for model in models]

