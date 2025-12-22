"""Error handling utilities"""
from typing import Any

from app.domain.exceptions.domain_exceptions import DomainException


def handle_domain_error(error: DomainException) -> dict[str, Any]:
    """Convert domain exception to API error response"""
    return {
        "detail": str(error),
        "type": error.__class__.__name__,
    }

