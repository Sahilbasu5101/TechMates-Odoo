"""
serve.py — Fuel Discrepancy Prediction API (port 8000)
Your Express fuel route POSTs here after saving a fuel log; response tells you
whether to flag it. Falls back gracefully: if history is thin, uses IsolationForest.

Run: pip install fastapi uvicorn joblib scikit-learn pandas && uvicorn serve:app --port 8000
"""
import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Fuel Discrepancy Detector")

model = joblib.load("fuel_discrepancy_model.pkl")       # GradientBoosting (supervised)
iso = joblib.load("fuel_anomaly_isoforest.pkl")         # IsolationForest (unsupervised fallback)
FEATURES = ["eff_dev_own", "eff_dev_fleet", "liters_per_100km",
            "load_pct", "route_difficulty", "days_since_service", "distance_km"]

class FuelLogInput(BaseModel):
    # Raw values — feature engineering happens here, mirroring training
    distance_km: float
    reported_liters: float
    load_pct: float                 # cargo_weight / vehicle max capacity (from Person B's trip)
    route_difficulty: float = 1.0   # optional; default neutral
    days_since_service: float       # from YOUR maintenance records
    vehicle_avg_kmpl: float | None = None   # vehicle's historical km/L (None if <3 logs)
    fleet_type_avg_kmpl: float      # avg km/L of same vehicle type in fleet

@app.post("/predict")
def predict(log: FuelLogInput):
    kmpl = log.distance_km / log.reported_liters
    thin_history = log.vehicle_avg_kmpl is None

    eff_dev_own = 0.0 if thin_history else (kmpl - log.vehicle_avg_kmpl) / log.vehicle_avg_kmpl
    eff_dev_fleet = (kmpl - log.fleet_type_avg_kmpl) / log.fleet_type_avg_kmpl

    row = pd.DataFrame([{
        "eff_dev_own": eff_dev_own,
        "eff_dev_fleet": eff_dev_fleet,
        "liters_per_100km": 100 * log.reported_liters / log.distance_km,
        "load_pct": log.load_pct,
        "route_difficulty": log.route_difficulty,
        "days_since_service": log.days_since_service,
        "distance_km": log.distance_km,
    }])[FEATURES]

    if thin_history:
        # Not enough vehicle history for the supervised features → unsupervised check
        flagged = bool(iso.predict(row)[0] == -1)
        prob = None
        method = "isolation_forest (thin history)"
    else:
        prob = float(model.predict_proba(row)[0, 1])
        flagged = prob >= 0.5
        method = "gradient_boosting"

    reasons = []
    if eff_dev_own < -0.15: reasons.append(f"Efficiency {abs(eff_dev_own)*100:.0f}% below this vehicle's average")
    if eff_dev_fleet < -0.15: reasons.append(f"Efficiency {abs(eff_dev_fleet)*100:.0f}% below fleet average for this type")
    if log.days_since_service > 90: reasons.append("Vehicle overdue for service (may explain some loss)")
    if not reasons and flagged: reasons.append("Unusual combination of consumption vs load/route")

    return {
        "flagged": flagged,
        "discrepancy_probability": round(prob, 3) if prob is not None else None,
        "method": method,
        "kmpl_this_fill": round(kmpl, 2),
        "reasons": reasons,
        "severity": "HIGH" if (prob or 0) > 0.8 else "MEDIUM" if flagged else "OK",
    }

@app.get("/health")
def health():
    return {"status": "ok", "model": "GradientBoosting + IsolationForest fallback"}
