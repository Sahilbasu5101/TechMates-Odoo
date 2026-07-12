from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="TechMates ML Risk Prediction Service")

class VehicleFeatures(BaseModel):
    odometer_km: float
    age_years: float
    days_since_last_service: float

@app.get("/")
def read_root():
    return {"status": "ML Service is running", "version": "1.0.0"}

@app.post("/predict-risk")
def predict_risk(features: VehicleFeatures):
    # Read thresholds from .env
    max_lifetime_km = float(os.getenv("LIFETIME_ODOMETER_KM", 150000))
    max_age_years = float(os.getenv("MAX_VEHICLE_AGE_YEARS", 10))
    service_interval_days = float(os.getenv("SERVICE_INTERVAL_DAYS", 180))

    # Calculate risk factors (0 to 1)
    odometer_risk = min(features.odometer_km / max_lifetime_km, 1.0)
    age_risk = min(features.age_years / max_age_years, 1.0)
    service_risk = min(features.days_since_last_service / service_interval_days, 1.0)

    # Weighted risk calculation
    # 40% odometer, 40% service delay, 20% age
    total_risk_score = (odometer_risk * 40) + (service_risk * 40) + (age_risk * 20)

    return {
        "risk_score": round(total_risk_score, 2),
        "risk_level": "High" if total_risk_score > 70 else "Medium" if total_risk_score > 40 else "Low",
        "factors": {
            "odometer_contribution": round(odometer_risk * 40, 2),
            "age_contribution": round(age_risk * 20, 2),
            "service_contribution": round(service_risk * 40, 2)
        }
    }
