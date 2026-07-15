from fastapi import APIRouter, HTTPException
from ..models.schemas import SuitabilityRequest, SuitabilityResponse
from ..services.model_client import call_model_serving

router = APIRouter()

@router.post("/suitability", response_model=SuitabilityResponse)
async def check_suitability(request: SuitabilityRequest):
    input_dict = request.dict(exclude={"crop_name"})
    try:
        result = await call_model_serving(input_dict)
        return SuitabilityResponse(
            crop=request.crop_name,
            score=0.85,
            feature_contributions={"N": 0.12, "P": 0.05, "temperature": -0.03}
        )
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))
