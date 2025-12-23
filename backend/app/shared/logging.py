"""Structured logging configuration"""
import logging
import sys

import structlog

from app.infrastructure.config.settings import settings


def configure_logging(log_level: str = "INFO") -> None:
    """Configure structured logging with environment-based formatting"""
    # Configure standard library logging
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, log_level.upper()),
    )
    
    # Hide noisy third-party logs
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.pool").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("openai").setLevel(logging.WARNING)
    
    # Base processors for all environments
    base_processors = [
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
    ]
    
    # Environment-based rendering
    if settings.environment == "development":
        # Pretty console output for local development
        processors = base_processors + [
            structlog.dev.ConsoleRenderer(colors=True),
        ]
    else:
        # JSON output for production
        processors = base_processors + [
            structlog.processors.JSONRenderer(),
        ]
    
    # Configure structlog
    structlog.configure(
        processors=processors,
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )


def get_logger(name: str = __name__) -> structlog.BoundLogger:
    """Get a structured logger instance"""
    return structlog.get_logger(name)

