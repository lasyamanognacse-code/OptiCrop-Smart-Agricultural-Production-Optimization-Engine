from sqlalchemy import Column, Integer, Float, String, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from ..core.database import Base

class PredictionLog(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    input_json = Column(JSON, nullable=False)
    result_json = Column(JSON, nullable=False)
    latency_ms = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class CropMetadata(Base):
    __tablename__ = "crop_metadata"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    ideal_ph_min = Column(Float)
    ideal_ph_max = Column(Float)
    ideal_temp_min = Column(Float)
    ideal_temp_max = Column(Float)

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id"))
    actual_yield = Column(Float, nullable=True)
    user_rating = Column(Integer, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
