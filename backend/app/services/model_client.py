import httpx
from ..core.config import get_settings

settings = get_settings()

async def call_model_serving(input_data: dict) -> dict:
    async with httpx.AsyncClient(timeout=2.0) as client:
        response = await client.post(
            f"{settings.MODEL_SERVING_URL}/v1/predict",
            json=input_data
        )
        response.raise_for_status()
        return response.json()
