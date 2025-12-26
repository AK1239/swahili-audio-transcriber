"""SQLAlchemy base configuration"""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool, QueuePool

from app.infrastructure.config.settings import settings

# Determine if we're using PostgreSQL or SQLite
is_postgresql = settings.database_url.startswith("postgresql")

# Configure engine with appropriate pool settings
# PostgreSQL: Use connection pooling for better performance
# SQLite: Use NullPool (no pooling needed for SQLite)
pool_class = QueuePool if is_postgresql else NullPool
pool_kwargs = {}
if is_postgresql:
    # PostgreSQL connection pool settings
    pool_kwargs = {
        "pool_size": 5,  # Number of connections to keep in pool
        "max_overflow": 10,  # Max connections beyond pool_size
        "pool_pre_ping": True,  # Verify connections before using
        "pool_recycle": 3600,  # Recycle connections after 1 hour
    }

# Create async engine
engine = create_async_engine(
    settings.database_url,
    echo=False,  # Disable SQL query logging
    future=True,
    poolclass=pool_class,
    **pool_kwargs,
)

# Create async session factory
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Base class for models
Base = declarative_base()


async def get_session() -> AsyncSession:
    """Dependency to get database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def create_tables() -> None:
    """Create all database tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def drop_tables() -> None:
    """Drop all database tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

