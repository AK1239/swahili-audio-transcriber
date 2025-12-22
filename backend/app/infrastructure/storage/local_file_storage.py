"""Local filesystem file storage implementation"""
import os
from pathlib import Path
from uuid import uuid4

from app.domain.interfaces.file_storage import FileStorage
from app.infrastructure.config.settings import settings
from app.shared.logging import get_logger

logger = get_logger(__name__)


class LocalFileStorage(FileStorage):
    """Local filesystem storage implementation"""
    
    def __init__(self, upload_dir: str | None = None):
        self._upload_dir = Path(upload_dir or settings.upload_dir)
        self._upload_dir.mkdir(parents=True, exist_ok=True)
    
    async def save(self, file_content: bytes, filename: str) -> str:
        """
        Save file to local filesystem
        
        Args:
            file_content: File content as bytes
            filename: Original filename
        
        Returns:
            Path where file was saved
        """
        # Generate unique filename
        file_extension = Path(filename).suffix
        unique_filename = f"{uuid4()}{file_extension}"
        file_path = self._upload_dir / unique_filename
        
        # Write file
        file_path.write_bytes(file_content)
        
        logger.info(
            "File saved",
            original_filename=filename,
            saved_path=str(file_path),
            file_size=len(file_content),
        )
        
        return str(file_path)
    
    async def load(self, file_path: str) -> bytes:
        """
        Load file from local filesystem
        
        Args:
            file_path: Path to file
        
        Returns:
            File content as bytes
        """
        path = Path(file_path)
        
        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        content = path.read_bytes()
        
        logger.debug(
            "File loaded",
            file_path=file_path,
            file_size=len(content),
        )
        
        return content
    
    async def delete(self, file_path: str) -> None:
        """
        Delete file from local filesystem
        
        Args:
            file_path: Path to file to delete
        """
        path = Path(file_path)
        
        if path.exists():
            path.unlink()
            logger.info("File deleted", file_path=file_path)
        else:
            logger.warning("File not found for deletion", file_path=file_path)

