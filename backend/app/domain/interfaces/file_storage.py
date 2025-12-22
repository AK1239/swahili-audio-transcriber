"""File storage interface"""
from abc import ABC, abstractmethod
from typing import BinaryIO


class FileStorage(ABC):
    """Interface for file storage"""
    
    @abstractmethod
    async def save(self, file_content: bytes, filename: str) -> str:
        """
        Save file and return file path
        
        Args:
            file_content: File content as bytes
            filename: Original filename
        
        Returns:
            Path where file was saved
        """
        pass
    
    @abstractmethod
    async def load(self, file_path: str) -> bytes:
        """
        Load file content
        
        Args:
            file_path: Path to file
        
        Returns:
            File content as bytes
        """
        pass
    
    @abstractmethod
    async def delete(self, file_path: str) -> None:
        """
        Delete file
        
        Args:
            file_path: Path to file to delete
        """
        pass

