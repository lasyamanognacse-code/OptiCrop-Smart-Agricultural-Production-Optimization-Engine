from pydantic import BaseModel, Field
from typing import List, Optional

class CropInput(BaseModel):
    N: float = Field(..., ge=0, le=300)
    P: float = Field(..., ge=0, le=300)
    K: float = Field(..., ge=0, le=300)
    temperature: float = Field(..., ge=-20, le=50)
    humidity: float = Field(..., ge=0, le=100)
    ph: float = Field(..., ge=0, le=14)
    rainfall: float = Field(..., ge=0, le=500)

class CropRecommendation(BaseModel):
    crop: str
    confidence: float
    tip: Optional[str] = None

class RecommendationResponse(BaseModel):
    recommendations: List[CropRecommendation]
    latency_ms: float

class SuitabilityRequest(CropInput):
    crop_name: str

class SuitabilityResponse(BaseModel):
    crop: str
    score: float
    feature_contributions: dict

class HealthResponse(BaseModel):
    status: str
    version: str = "1.0"
