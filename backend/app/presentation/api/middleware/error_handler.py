"""Error handling middleware"""
from fastapi import Request, status
from fastapi.responses import JSONResponse

from app.domain.exceptions.domain_exceptions import DomainException
from app.shared.errors import handle_domain_error
from app.shared.logging import get_logger

logger = get_logger(__name__)


async def domain_exception_handler(request: Request, exc: DomainException) -> JSONResponse:
    """Handle domain exceptions"""
    error_response = handle_domain_error(exc)
    logger.warning(
        "Domain exception",
        path=request.url.path,
        error_type=type(exc).__name__,
        detail=str(exc),
    )
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=error_response,
    )


async def value_error_handler(request: Request, exc: ValueError) -> JSONResponse:
    """Handle value errors"""
    logger.warning(
        "Value error",
        path=request.url.path,
        error=str(exc),
    )
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc), "type": "ValueError"},
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle general exceptions"""
    logger.error(
        "Unhandled exception",
        path=request.url.path,
        error=str(exc),
        error_type=type(exc).__name__,
        exc_info=True,
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "type": "InternalServerError",
        },
    )

