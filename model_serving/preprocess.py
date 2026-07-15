import pickle
import numpy as np
from pathlib import Path

SCALER_PATH = Path("/app/artifacts/scaler.pkl")
if SCALER_PATH.exists():
    with open(SCALER_PATH, "rb") as f:
        scaler = pickle.load(f)
else:
    scaler = None

def scale_features(features: list):
    if scaler is None:
        return np.array(features).reshape(1, -1)
    return scaler.transform(np.array(features).reshape(1, -1))
