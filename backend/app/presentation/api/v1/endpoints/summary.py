"""Get summary endpoint"""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from dependency_injector.wiring import Provide, inject

from app.application.use_cases.get_summary import GetSummaryUseCase
from app.container import ApplicationContainer
from app.presentation.schemas.response_schemas import SummaryResponse

router = APIRouter()


@router.get(
    "/summary/{transcription_id}",
    response_model=SummaryResponse,
)
@inject
async def get_summary(
    transcription_id: UUID,
    use_case: GetSummaryUseCase = Depends(
        Provide[ApplicationContainer.get_summary_use_case]
    ),
) -> SummaryResponse:
    """Get summary by transcription ID"""
    try:
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

