"""Request ID middleware for request tracking"""
import uuid

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


class RequestIDMiddleware(BaseHTTPMiddleware):
    """Middleware to add request ID to each request"""
    
    async def dispatch(self, request: Request, call_next):
        """Add request ID to request state"""
        # Generate a short request ID
        request.state.request_id = uuid.uuid4().hex[:8]
        
        response = await call_next(request)
        
        # Add request ID to response headers for debugging
        response.headers["X-Request-ID"] = request.state.request_id
        
        return response

