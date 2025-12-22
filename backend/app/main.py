"""FastAPI application entry point"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.container import ApplicationContainer
from app.infrastructure.config.settings import settings
from app.infrastructure.database.base import create_tables
from app.presentation.api.middleware.error_handler import (
    domain_exception_handler,
    general_exception_handler,
    value_error_handler,
)
from app.presentation.api.middleware.logging_middleware import LoggingMiddleware
from app.presentation.api.v1.router import api_router
from app.domain.exceptions.domain_exceptions import DomainException
from app.shared.logging import configure_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    configure_logging(settings.log_level)
    await create_tables()
    
    # Wire dependency injection
    from app.container import ApplicationContainer
    from app.presentation.api.v1.endpoints import summary, transcript, upload
    
    container = ApplicationContainer()
    container.wire(
        modules=[
            __name__,
            upload,
            transcript,
            summary,
        ]
    )
    app.state.container = container
    
    yield
    
    # Shutdown
    container.unwire()


# Create FastAPI app
app = FastAPI(
    title="Swahili Audio Transcriber API",
    description="API for transcribing and summarizing Swahili audio",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging middleware
app.add_middleware(LoggingMiddleware)

# Exception handlers
app.add_exception_handler(DomainException, domain_exception_handler)
app.add_exception_handler(ValueError, value_error_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Include routers
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Swahili Audio Transcriber API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}
