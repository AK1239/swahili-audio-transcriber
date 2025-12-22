"""Common validators"""
from pathlib import Path


def validate_file_extension(filename: str, allowed_extensions: set[str]) -> bool:
    """Validate file extension"""
    extension = Path(filename).suffix.lower()
    return extension in allowed_extensions


def validate_file_size(size_bytes: int, max_size_bytes: int) -> bool:
    """Validate file size"""
    return size_bytes <= max_size_bytes

