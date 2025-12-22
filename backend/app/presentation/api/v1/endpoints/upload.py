"""Upload audio endpoint"""
from typing import TYPE_CHECKING

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status

from app.presentation.schemas.response_schemas import TranscriptionResponse

if TYPE_CHECKING:
    from app.container import ApplicationContainer

router = APIRouter()


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
    container: "ApplicationContainer" = Depends(get_container),
) -> TranscriptionResponse:
    """
    Upload audio file for transcription
    
    Accepts: .mp3, .wav, .mp4 files up to 25MB
    """
    try:
        use_case = container.upload_audio_use_case
        result = await use_case.execute(file)
        return TranscriptionResponse.from_dto(result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

