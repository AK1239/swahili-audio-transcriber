"""Get audio file endpoint"""
from typing import TYPE_CHECKING
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import FileResponse

from app.shared.logging import get_logger

if TYPE_CHECKING:
    from app.container import ApplicationContainer

router = APIRouter()
logger = get_logger(__name__)


def get_container(request: Request) -> "ApplicationContainer":
    """Get application container from request state"""
    return request.app.state.container


@router.get("/audio/{transcription_id}")
async def get_audio(
    transcription_id: UUID,
    request: Request,
    container: "ApplicationContainer" = Depends(get_container),
):
    """Get audio file by transcription ID"""
    request_id = getattr(request.state, "request_id", None)
    bound_logger = logger.bind(request_id=request_id) if request_id else logger
    
    try:
        # Get transcription entity to access file_path
        transcription = await container.transcription_repository.get_by_id(transcription_id)
        
        # Determine content type from filename
        filename = transcription.filename
        content_type = "audio/mpeg"  # default
        if filename.endswith(".wav"):
            content_type = "audio/wav"
        elif filename.endswith(".mp4"):
            content_type = "audio/mp4"
        elif filename.endswith(".mp3"):
            content_type = "audio/mpeg"
        
        # Return file response using file path directly
        from pathlib import Path
        file_path = Path(transcription.file_path)
        
        if not file_path.exists():
            raise FileNotFoundError(f"Audio file not found: {file_path}")
        
        bound_logger.info(
            "audio.response",
            transcription_id=str(transcription_id),
            filename=filename,
        )
        
        return FileResponse(
            path=str(file_path),
            media_type=content_type,
            filename=filename,
        )
    except FileNotFoundError as e:
        bound_logger.warning(
            "audio.file_not_found",
            transcription_id=str(transcription_id),
            error=str(e),
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Audio file not found: {str(e)}",
        )
    except Exception as e:
        bound_logger.error(
            "audio.error",
            transcription_id=str(transcription_id),
            error=str(e),
            error_type=type(e).__name__,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )

