"""File information value object"""
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from app.domain.exceptions.validation_exceptions import (
    FileTooLargeError,
    InvalidFileTypeError,
)
from app.infrastructure.config.settings import settings


@dataclass(frozen=True)
class FileInfo:
    """Immutable file information value object"""
    
    filename: str
    size_bytes: int
    content_type: str
    extension: str
    origin: str | None = None
    
    # Constants
    MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024  # 25MB
    
    @classmethod
    def get_allowed_extensions(cls) -> set[str]:
        """Get allowed extensions from settings"""
        return settings.allowed_extensions_set
    
    @classmethod
    def from_upload_file(
        cls,
        filename: str,
        size_bytes: int,
        content_type: Optional[str] = None,
        origin: Optional[str] = None,
    ) -> "FileInfo":
        """Create FileInfo from upload file metadata"""
        extension = Path(filename).suffix.lower()
        
        # Infer content type if not provided
        if not content_type:
            content_type_map = {
                ".mp3": "audio/mpeg",
                ".wav": "audio/wav",
                ".mp4": "video/mp4",
                ".webm": "audio/webm",
                ".m4a": "audio/mp4",
                ".ogg": "audio/ogg",
            }
            content_type = content_type_map.get(extension, "application/octet-stream")
        
        return cls(
            filename=filename,
            size_bytes=size_bytes,
            content_type=content_type,
            extension=extension,
            origin=origin,
        )
    
    def validate(self) -> None:
        """Validate file info and raise exceptions if invalid"""
        allowed_extensions = self.get_allowed_extensions()
        if self.extension not in allowed_extensions:
            raise InvalidFileTypeError(
                f"File type {self.extension} not allowed. "
                f"Allowed types: {', '.join(sorted(allowed_extensions))}"
            )
        
        if self.size_bytes > self.MAX_FILE_SIZE_BYTES:
            max_size_mb = self.MAX_FILE_SIZE_BYTES / (1024 * 1024)
            raise FileTooLargeError(
                f"File size {self.size_bytes} bytes exceeds maximum "
                f"allowed size of {max_size_mb}MB"
            )

