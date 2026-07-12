"""
generate_data.py — Synthetic training data for the fuel discrepancy model.
Simulates a fleet's fuel logs with realistic physics + injected fraud/fault patterns,
so the model can be trained TODAY without waiting for months of real logs.
At integration time, the same feature schema is computed from real Mongo data.
"""
import numpy as np
import pandas as pd

rng = np.random.default_rng(42)

VEHICLE_PROFILES = [
    # (base_kmpl, load_sensitivity, age_factor)
    ("VAN",   11.0, 0.25, 0.9),
    ("TRUCK",  5.5, 0.40, 0.8),
    ("MINI",  14.0, 0.20, 1.0),
    ("TRUCK",  5.0, 0.45, 0.7),
    ("VAN",   10.5, 0.30, 0.85),
]

def simulate(n_vehicles=25, logs_per_vehicle=60):
    rows = []
    for v in range(n_vehicles):
        vtype, base_kmpl, load_sens, age = VEHICLE_PROFILES[v % len(VEHICLE_PROFILES)]
        base_kmpl *= rng.normal(1.0, 0.05)  # per-vehicle variation
        odo = rng.integers(20_000, 150_000)

        for i in range(logs_per_vehicle):
            distance = float(rng.uniform(80, 600))
            load_pct = float(rng.uniform(0.2, 1.0))          # cargo / capacity
            route_difficulty = float(rng.uniform(0.8, 1.2))  # terrain/traffic proxy
            days_since_service = float(rng.uniform(0, 120))

            # Physics: efficiency drops with load, route difficulty, service neglect
            eff = (base_kmpl * age
                   * (1 - load_sens * (load_pct - 0.5))
                   / route_difficulty
                   * (1 - 0.0008 * days_since_service))
            eff *= rng.normal(1.0, 0.06)  # measurement noise

            expected_liters = distance / eff
            label = 0
            reported_liters = expected_liters

            r = rng.random()
            if r < 0.04:      # fuel theft / siphoning: more liters billed than burned
                reported_liters = expected_liters * rng.uniform(1.25, 1.8)
                label = 1
            elif r < 0.07:    # odometer tampering / distance under-report
                distance *= rng.uniform(0.6, 0.85)
                label = 1
            elif r < 0.09:    # mechanical fault: genuine efficiency collapse
                reported_liters = expected_liters * rng.uniform(1.15, 1.4)
                label = 1

            rows.append({
                "vehicle_id": f"V{v:03d}",
                "vehicle_type": vtype,
                "distance_km": round(distance, 1),
                "reported_liters": round(reported_liters, 2),
                "load_pct": round(load_pct, 2),
                "route_difficulty": round(route_difficulty, 2),
                "days_since_service": round(days_since_service, 1),
                "odometer_km": int(odo := odo + distance),
                "fuel_cost": round(reported_liters * 90, 0),
                "is_discrepancy": label,
            })
    return pd.DataFrame(rows)

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Feature engineering — SAME function must be used at inference time."""
    df = df.sort_values(["vehicle_id", "odometer_km"]).copy()
    df["kmpl"] = df["distance_km"] / df["reported_liters"]

    # Rolling per-vehicle baseline (expanding mean of past logs, no leakage)
    df["vehicle_avg_kmpl"] = (
        df.groupby("vehicle_id")["kmpl"]
          .transform(lambda s: s.shift(1).expanding().mean())
    )
    df["fleet_type_avg_kmpl"] = df.groupby("vehicle_type")["kmpl"].transform(
        lambda s: s.shift(1).expanding().mean()
    )
    df = df.dropna(subset=["vehicle_avg_kmpl", "fleet_type_avg_kmpl"])

    # The money features: deviation from own history and from fleet peers
    df["eff_dev_own"] = (df["kmpl"] - df["vehicle_avg_kmpl"]) / df["vehicle_avg_kmpl"]
    df["eff_dev_fleet"] = (df["kmpl"] - df["fleet_type_avg_kmpl"]) / df["fleet_type_avg_kmpl"]
    df["liters_per_100km"] = 100 * df["reported_liters"] / df["distance_km"]
    return df

FEATURES = [
    "eff_dev_own",        # % deviation vs vehicle's own historical km/L  ← strongest signal
    "eff_dev_fleet",      # % deviation vs same-type fleet average
    "liters_per_100km",
    "load_pct",           # heavy load legitimately raises consumption — model learns to excuse it
    "route_difficulty",
    "days_since_service", # neglected vehicle legitimately less efficient
    "distance_km",
]

if __name__ == "__main__":
    df = simulate()
    df = engineer_features(df)
    df.to_csv("/home/claude/fuel-ml/fuel_logs.csv", index=False)
    print(f"{len(df)} rows, {df.is_discrepancy.mean():.1%} discrepancies")
