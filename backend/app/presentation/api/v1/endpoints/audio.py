"""Get audio file endpoint"""
from typing import TYPE_CHECKING
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import FileResponse, StreamingResponse
from io import BytesIO

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
        elif filename.endswith(".webm"):
            content_type = "audio/webm"
        elif filename.endswith(".m4a"):
            content_type = "audio/mp4"
        elif filename.endswith(".ogg"):
            content_type = "audio/ogg"
        
        # Get file storage from container
        file_storage = container._file_storage
        
        # Check if using local storage (file_path is a local path)
        from pathlib import Path
        file_path = Path(transcription.file_path)
        
        # If file exists locally, use FileResponse (for local storage)
        if file_path.exists() and file_path.is_absolute():
            bound_logger.info(
                "audio.response.local",
                transcription_id=str(transcription_id),
                filename=filename,
            )
            
            response = FileResponse(
                path=str(file_path),
                media_type=content_type,
                filename=filename,
            )
            response.headers["Accept-Ranges"] = "bytes"
            return response
        
        # Otherwise, load from cloud storage (R2)
        try:
            audio_bytes = await file_storage.load(transcription.file_path)
            
            bound_logger.info(
                "audio.response.cloud",
                transcription_id=str(transcription_id),
                filename=filename,
                file_size=len(audio_bytes),
            )
            
            # Create streaming response from bytes
            response = StreamingResponse(
                iter([audio_bytes]),
                media_type=content_type,
                headers={
                    "Accept-Ranges": "bytes",
                    "Content-Length": str(len(audio_bytes)),
                    "Content-Disposition": f'inline; filename="{filename}"',
                }
            )
            
            return response
            
        except FileNotFoundError as e:
            bound_logger.warning(
                "audio.file_not_found",
                transcription_id=str(transcription_id),
                file_path=transcription.file_path,
                error=str(e),
            )
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Audio file not found: {str(e)}",
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

