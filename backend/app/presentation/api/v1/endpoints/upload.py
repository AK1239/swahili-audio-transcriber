"""Upload audio endpoint"""
from typing import TYPE_CHECKING

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status

from app.presentation.schemas.response_schemas import TranscriptionResponse
from app.shared.logging import get_logger

if TYPE_CHECKING:
    from app.container import ApplicationContainer

router = APIRouter()
logger = get_logger(__name__)


def get_container(request: Request) -> "ApplicationContainer":
    """Get application container from request state"""
    return request.app.state.container


@router.post(
    "/upload",
    response_model=TranscriptionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_audio(
    file: UploadFile = File(...),
    request: Request = None,
    container: "ApplicationContainer" = Depends(get_container),
) -> TranscriptionResponse:
    """
    Upload audio file for transcription
    
    Accepts: .mp3, .wav, .mp4 files up to 25MB
    """
    # Get request_id if available (set by RequestIDMiddleware)
    request_id = None
    if request:
        request_id = getattr(request.state, "request_id", None)
    bound_logger = logger.bind(request_id=request_id) if request_id else logger
    
    try:
        use_case = container.upload_audio_use_case
        result = await use_case.execute(file)
        response = TranscriptionResponse.from_dto(result)
        
        # Log response
        bound_logger.info(
            "upload.response",
            transcription_id=str(response.id),
            filename=response.filename,
            status=response.status,
            has_transcript=bool(response.transcriptText),
        )
        
        return response
    except Exception as e:
        bound_logger.error(
            "upload.error",
            filename=file.filename,
            error=str(e),
            error_type=type(e).__name__,
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

