"""Get transcript endpoint"""
from typing import TYPE_CHECKING
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.presentation.schemas.response_schemas import TranscriptionResponse

if TYPE_CHECKING:
    from app.container import ApplicationContainer

router = APIRouter()


def get_container(request: Request) -> "ApplicationContainer":
    """Get application container from request state"""
    return request.app.state.container


@router.get(
    "/transcript/{transcription_id}",
    response_model=TranscriptionResponse,
)
async def get_transcript(
    transcription_id: UUID,
    container: "ApplicationContainer" = Depends(get_container),
) -> TranscriptionResponse:
    """Get transcript by transcription ID"""
    try:
        use_case = container.get_transcript_use_case
        result = await use_case.execute(transcription_id)
        return TranscriptionResponse.from_dto(result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

