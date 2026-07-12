const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    serviceType: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    cost: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["OPEN", "CLOSED"], default: "OPEN" },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

maintenanceSchema.index({ vehicle: 1, status: 1 });

module.exports = mongoose.model("Maintenance", maintenanceSchema);
