"""Database session utilities"""
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database.base import AsyncSessionLocal


async def create_async_session() -> AsyncSession:
    """Create a new async database session"""
    return AsyncSessionLocal()

