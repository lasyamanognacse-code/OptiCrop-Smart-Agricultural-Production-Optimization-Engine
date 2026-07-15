import onnxruntime as ort
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, validator
import json
from pathlib import Path
from preprocess import scale_features

app = FastAPI(title="OptiCrop Model Serving")

class PredictRequest(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

    @validator('ph')
    def validate_ph(cls, v):
        if not 0 <= v <= 14:
            raise ValueError('pH must be between 0 and 14')
        return v

MODEL_PATH = Path("/app/artifacts/model.onnx")
if MODEL_PATH.exists():
    session = ort.InferenceSession(str(MODEL_PATH))
else:
    session = None

CROP_LABELS = ["rice", "maize", "wheat", "cotton", "sugarcane", "soybean", "peanut"]

@app.on_event("startup")
async def startup():
    if session is None:
        print("WARNING: ONNX model not found. Running in dummy mode.")

@app.post("/v1/predict")
async def predict(request: PredictRequest):
    if session is None:
        return {
            "predictions": [
                {"crop": "rice", "confidence": 0.35},
                {"crop": "maize", "confidence": 0.25},
                {"crop": "wheat", "confidence": 0.20}
            ]
        }

    features = [request.N, request.P, request.K, request.temperature,
                request.humidity, request.ph, request.rainfall]
    scaled = scale_features(features)
    input_name = session.get_inputs()[0].name
    outputs = session.run(None, {input_name: scaled.astype(np.float32)})
    probs = outputs[0][0]

    top_indices = np.argsort(probs)[::-1][:3]
    result = []
    for idx in top_indices:
        result.append({
            "crop": CROP_LABELS[idx] if idx < len(CROP_LABELS) else f"crop_{idx}",
            "confidence": float(probs[idx])
        })
    return {"predictions": result}

@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": session is not None}
