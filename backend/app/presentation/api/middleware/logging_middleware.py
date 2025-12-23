"""Logging middleware"""
import time

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from app.shared.logging import get_logger

logger = get_logger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for request/response logging"""
    
    async def dispatch(self, request: Request, call_next):
        """Log request and response"""
        start_time = time.time()
        
        # Get request ID from request state (set by RequestIDMiddleware)
        request_id = getattr(request.state, "request_id", None)
        
        # Bind request_id to logger context
        bound_logger = logger.bind(request_id=request_id) if request_id else logger
        
        bound_logger.info(
            "request.started",
            method=request.method,
            path=request.url.path,
            client=request.client.host if request.client else None,
        )
        
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            
            # Only log successful requests
            bound_logger.info(
                "request.completed",
                method=request.method,
                path=request.url.path,
                status_code=response.status_code,
                process_time=f"{process_time:.3f}s",
            )
            
            return response
        
        except Exception as e:
            process_time = time.time() - start_time
            # Only log request-level failures (network, middleware errors)
            # Application errors are logged in the application layer
            bound_logger.error(
                "request.failed",
                method=request.method,
                path=request.url.path,
                error=str(e),
                error_type=type(e).__name__,
                process_time=f"{process_time:.3f}s",
            )
            raise

