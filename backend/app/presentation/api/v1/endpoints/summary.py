"""Get summary endpoint"""
from typing import TYPE_CHECKING
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.presentation.schemas.response_schemas import SummaryResponse

if TYPE_CHECKING:
    from app.container import ApplicationContainer

router = APIRouter()


def get_container(request: Request) -> "ApplicationContainer":
    """Get application container from request state"""
    return request.app.state.container


@router.get(
    "/summary/{transcription_id}",
    response_model=SummaryResponse,
)
async def get_summary(
    transcription_id: UUID,
    container: "ApplicationContainer" = Depends(get_container),
) -> SummaryResponse:
    """Get summary by transcription ID"""
    try:
        use_case = container.get_summary_use_case
        result = await use_case.execute(transcription_id)
        return SummaryResponse.from_dto(result)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )

