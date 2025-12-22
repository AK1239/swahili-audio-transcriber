"""Request schemas for API validation"""
from pydantic import BaseModel


class UploadAudioRequest(BaseModel):
    """Request schema for audio upload"""
    # File is handled via multipart/form-data, not JSON
    pass

