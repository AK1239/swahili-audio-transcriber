"""Get transcript endpoint"""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from dependency_injector.wiring import Provide, inject

from app.application.use_cases.get_transcript import GetTranscriptUseCase
from app.container import ApplicationContainer
from app.presentation.schemas.response_schemas import TranscriptionResponse

router = APIRouter()


@router.get(
    "/transcript/{transcription_id}",
    response_model=TranscriptionResponse,
)
@inject
async def get_transcript(
    transcription_id: UUID,
    use_case: GetTranscriptUseCase = Depends(
        Provide[ApplicationContainer.get_transcript_use_case]
    ),
) -> TranscriptionResponse:
    """Get transcript by transcription ID"""
    try:
        result = await use_case.execute(transcription_id)
        return TranscriptionResponse.from_dto(result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

