const mongoose = require("mongoose");

const fuelLogSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    liters: { type: Number, required: true, min: 0.1 },
    cost: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    // Enables km/L calculation and the fuel-ml discrepancy check (Phase 4)
    odometerAtFill: { type: Number, required: true, min: 0 },
    // ML result fields — nullable until the fuel-ml service (or fallback rule) scores the fill
    flagged: { type: Boolean, default: false },
    severity: { type: String, enum: ["HIGH", "MEDIUM", "OK"] },
    flagReasons: { type: [String], default: [] },
    discrepancyProbability: { type: Number, min: 0, max: 1 },
  },
  { timestamps: true }
);

fuelLogSchema.index({ vehicle: 1, date: 1 });

module.exports = mongoose.model("FuelLog", fuelLogSchema);
