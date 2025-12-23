"""Get summary endpoint"""
from typing import TYPE_CHECKING
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.presentation.schemas.response_schemas import SummaryResponse
from app.shared.logging import get_logger

if TYPE_CHECKING:
    from app.container import ApplicationContainer

router = APIRouter()
logger = get_logger(__name__)


def get_container(request: Request) -> "ApplicationContainer":
    """Get application container from request state"""
    return request.app.state.container


@router.get(
    "/summary/{transcription_id}",
    response_model=SummaryResponse,
)
async def get_summary(
    transcription_id: UUID,
    request: Request,
    container: "ApplicationContainer" = Depends(get_container),
) -> SummaryResponse:
    """Get summary by transcription ID"""
    request_id = getattr(request.state, "request_id", None)
    bound_logger = logger.bind(request_id=request_id) if request_id else logger
    
    try:
        use_case = container.get_summary_use_case
        result = await use_case.execute(transcription_id)
        response = SummaryResponse.from_dto(result)
        
        # Log response
        bound_logger.info(
            "summary.response",
            transcription_id=str(transcription_id),
            summary_id=str(response.id),
            has_muhtasari=bool(response.muhtasari),
            maamuzi_count=len(response.maamuzi),
            kazi_count=len(response.kazi),
            masuala_count=len(response.masuala_yaliyoahirishwa),
        )
        
        return response
    except ValueError as e:
        bound_logger.warning(
            "summary.not_found",
            transcription_id=str(transcription_id),
            error=str(e),
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        bound_logger.error(
            "summary.error",
            transcription_id=str(transcription_id),
            error=str(e),
            error_type=type(e).__name__,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )

