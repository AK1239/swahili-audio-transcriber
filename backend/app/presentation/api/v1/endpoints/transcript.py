"""Get transcript endpoint"""
from typing import TYPE_CHECKING
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.presentation.schemas.response_schemas import TranscriptionResponse
from app.shared.logging import get_logger

if TYPE_CHECKING:
    from app.container import ApplicationContainer

router = APIRouter()
logger = get_logger(__name__)


def get_container(request: Request) -> "ApplicationContainer":
    """Get application container from request state"""
    return request.app.state.container


@router.get(
    "/transcript/{transcription_id}",
    response_model=TranscriptionResponse,
)
async def get_transcript(
    transcription_id: UUID,
    request: Request,
    container: "ApplicationContainer" = Depends(get_container),
) -> TranscriptionResponse:
    """Get transcript by transcription ID"""
    request_id = getattr(request.state, "request_id", None)
    bound_logger = logger.bind(request_id=request_id) if request_id else logger
    
    try:
        use_case = container.get_transcript_use_case
        result = await use_case.execute(transcription_id)
        response = TranscriptionResponse.from_dto(result)
        
        # Log response
        bound_logger.info(
            "transcript.response",
            transcription_id=str(transcription_id),
            status=response.status,
            has_transcript=bool(response.transcriptText),
            transcript_length=len(response.transcriptText) if response.transcriptText else 0,
        )
        
        return response
    except Exception as e:
        bound_logger.warning(
            "transcript.not_found",
            transcription_id=str(transcription_id),
            error=str(e),
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

