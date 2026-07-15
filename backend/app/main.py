import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import recommend, suitability

# Setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("opticrop")

app = FastAPI(title="OptiCrop Backend")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(recommend.router, prefix="/api/v1")
app.include_router(suitability.router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    logger.info("Starting OptiCrop backend")