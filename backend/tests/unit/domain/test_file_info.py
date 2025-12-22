"""Unit tests for FileInfo value object"""
import pytest

from app.domain.exceptions.validation_exceptions import FileTooLargeError, InvalidFileTypeError
from app.domain.value_objects.file_info import FileInfo


def test_file_info_from_upload_file():
    """Test creating FileInfo from upload file metadata"""
    file_info = FileInfo.from_upload_file(
        filename="test.mp3",
        size_bytes=1024,
        content_type="audio/mpeg",
    )
    
    assert file_info.filename == "test.mp3"
    assert file_info.size_bytes == 1024
    assert file_info.content_type == "audio/mpeg"
    assert file_info.extension == ".mp3"


def test_file_info_validate_valid_file():
    """Test validating a valid file"""
    file_info = FileInfo.from_upload_file(
        filename="test.mp3",
        size_bytes=1024,
    )
    
    # Should not raise
    file_info.validate()


def test_file_info_validate_invalid_extension():
    """Test validating file with invalid extension"""
    file_info = FileInfo.from_upload_file(
        filename="test.txt",
        size_bytes=1024,
    )
    
    with pytest.raises(InvalidFileTypeError):
        file_info.validate()


def test_file_info_validate_file_too_large():
    """Test validating file that is too large"""
    file_info = FileInfo.from_upload_file(
        filename="test.mp3",
        size_bytes=FileInfo.MAX_FILE_SIZE_BYTES + 1,
    )
    
    with pytest.raises(FileTooLargeError):
        file_info.validate()

