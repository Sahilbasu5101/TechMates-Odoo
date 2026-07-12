"""
train.py — Trains and compares three methods for fuel discrepancy detection:
  1. IsolationForest      (unsupervised — works with NO labels, day-1 deployable)
  2. RandomForest         (supervised — best accuracy once labels exist)
  3. GradientBoosting     (supervised — often best on tabular, slower)
Saves the best supervised model + the unsupervised fallback + metadata.
"""
import json
import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest, RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, precision_recall_fscore_support

from generate_data import FEATURES

df = pd.read_csv("/home/claude/fuel-ml/fuel_logs.csv")
X, y = df[FEATURES], df["is_discrepancy"]
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)

results = {}

# ---- 1) IsolationForest (unsupervised) ----
iso = IsolationForest(n_estimators=300, contamination=0.09, random_state=42)
iso.fit(X_tr)
iso_pred = (iso.predict(X_te) == -1).astype(int)
p, r, f1, _ = precision_recall_fscore_support(y_te, iso_pred, average="binary", zero_division=0)
results["IsolationForest"] = {"precision": p, "recall": r, "f1": f1}

# ---- 2) RandomForest (supervised) ----
rf = RandomForestClassifier(n_estimators=300, class_weight="balanced", random_state=42)
rf.fit(X_tr, y_tr)
rf_prob = rf.predict_proba(X_te)[:, 1]
rf_pred = (rf_prob >= 0.5).astype(int)
p, r, f1, _ = precision_recall_fscore_support(y_te, rf_pred, average="binary", zero_division=0)
results["RandomForest"] = {"precision": p, "recall": r, "f1": f1, "auc": roc_auc_score(y_te, rf_prob)}

# ---- 3) GradientBoosting (supervised) ----
gb = GradientBoostingClassifier(random_state=42)
gb.fit(X_tr, y_tr)
gb_prob = gb.predict_proba(X_te)[:, 1]
gb_pred = (gb_prob >= 0.5).astype(int)
p, r, f1, _ = precision_recall_fscore_support(y_te, gb_pred, average="binary", zero_division=0)
results["GradientBoosting"] = {"precision": p, "recall": r, "f1": f1, "auc": roc_auc_score(y_te, gb_prob)}

print(json.dumps({k: {m: round(v, 3) for m, v in d.items()} for k, d in results.items()}, indent=2))

best_name = max(["RandomForest", "GradientBoosting"], key=lambda k: results[k]["f1"])
best = rf if best_name == "RandomForest" else gb
print(f"\nBest supervised model: {best_name}")
print("\nFeature importances (what drives detection):")
for f, imp in sorted(zip(FEATURES, best.feature_importances_), key=lambda x: -x[1]):
    print(f"  {f:22s} {imp:.3f}")

joblib.dump(best, "/home/claude/fuel-ml/fuel_discrepancy_model.pkl")
joblib.dump(iso, "/home/claude/fuel-ml/fuel_anomaly_isoforest.pkl")
with open("/home/claude/fuel-ml/model_meta.json", "w") as fh:
    json.dump({"best_model": best_name, "features": FEATURES,
               "metrics": {k: {m: round(v, 4) for m, v in d.items()} for k, d in results.items()}}, fh, indent=2)
print("\nSaved: fuel_discrepancy_model.pkl, fuel_anomaly_isoforest.pkl, model_meta.json")
