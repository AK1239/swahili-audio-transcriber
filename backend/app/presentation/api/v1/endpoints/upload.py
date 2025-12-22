"""Upload audio endpoint"""
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from dependency_injector.wiring import Provide, inject

from app.application.use_cases.upload_audio import UploadAudioUseCase
from app.container import ApplicationContainer
from app.presentation.schemas.response_schemas import TranscriptionResponse

router = APIRouter()


@router.post(
    "/upload",
    response_model=TranscriptionResponse,
    status_code=status.HTTP_201_CREATED,
)
@inject
async def upload_audio(
    file: UploadFile = File(...),
    use_case: UploadAudioUseCase = Depends(
        Provide[ApplicationContainer.upload_audio_use_case]
    ),
) -> TranscriptionResponse:
    """
    Upload audio file for transcription
    
    Accepts: .mp3, .wav, .mp4 files up to 25MB
    """
    try:
        result = await use_case.execute(file)
        return TranscriptionResponse.from_dto(result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

