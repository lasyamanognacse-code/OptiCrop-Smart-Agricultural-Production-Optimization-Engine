from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import time
import json
import redis.asyncio as redis
from ..core.database import get_db
from ..models.schemas import CropInput, RecommendationResponse
from ..services.model_client import call_model_serving
from ..services.business_rules import apply_business_rules
from ..core.config import get_settings
from ..models.orm import PredictionLog

router = APIRouter()
settings = get_settings()
redis_client = redis.from_url(settings.REDIS_URL)

@router.post("/recommend", response_model=RecommendationResponse)
async def recommend_crops(
    input_data: CropInput,
    db: AsyncSession = Depends(get_db)
):
    start = time.time()
    input_dict = input_data.dict()

    # Check cache
    cache_key = f"pred:{json.dumps(input_dict, sort_keys=True)}"
    cached = await redis_client.get(cache_key)
    if cached:
        latency = (time.time() - start) * 1000
        result = json.loads(cached)
        return RecommendationResponse(recommendations=result, latency_ms=latency)

    # Call model serving
    try:
        model_output = await call_model_serving(input_dict)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Model serving error: {str(e)}")

    # Apply business rules
    top_crops = apply_business_rules(model_output.get("predictions", []))

    # Log to DB
    log_entry = PredictionLog(
        input_json=input_dict,
        result_json=top_crops,
        latency_ms=(time.time() - start) * 1000
    )
    db.add(log_entry)
    await db.commit()

    # Cache result (24h)
    await redis_client.setex(cache_key, 86400, json.dumps(top_crops))

    return RecommendationResponse(
        recommendations=top_crops,
        latency_ms=log_entry.latency_ms
    )
